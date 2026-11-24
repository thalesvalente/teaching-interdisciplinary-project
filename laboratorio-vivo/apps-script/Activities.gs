/** Versioned catalog and submission snapshots. */
function lvActivity_(ctx, id, version, active) {
  lvId_(id); lvId_(version);
  var activity = lvFind_(ctx, 'Atividades', { activity_id: id, activity_version: version });
  lvAssert_(activity, 'ACTIVITY_NOT_FOUND', 'Atividade ou versão inexistente.');
  if (active) lvAssert_(activity.status === 'ATIVA', 'ACTIVITY_INACTIVE', 'Atividade ainda não foi ativada pelo docente.');
  lvAssert_(activity.schema_version === LV_VERSION_, 'SCHEMA_VERSION_MISMATCH', 'Atividade usa outro contrato.');
  return activity;
}
function lvQuestions_(activity) {
  var questions;
  try { questions = JSON.parse(activity.questions_json); }
  catch (e) { lvFail_('CATALOG_INVALID', 'Catálogo de perguntas inválido.'); }
  lvAssert_(Array.isArray(questions) && questions.length > 0 && questions.length <= LV_LIMITS_.questions,
    'CATALOG_INVALID', 'Quantidade de perguntas inválida.');
  var seen = Object.create(null);
  questions.forEach(function (q) {
    lvId_(q.question_id);
    lvAssert_(q.question_id.indexOf('__') !== 0 && !seen[q.question_id] && q.answer_kind === 'text',
      'CATALOG_INVALID', 'Pergunta duplicada ou tipo não suportado.');
    seen[q.question_id] = true;
    lvAssert_(typeof q.label === 'string' && q.label.length > 0 && q.label.length <= 200,
      'CATALOG_INVALID', 'Pergunta sem rótulo válido.');
    lvAssert_(Number.isInteger(q.maxLength) && q.maxLength > 0 && q.maxLength <= LV_LIMITS_.answerLength,
      'CATALOG_INVALID', 'Limite de pergunta inválido.');
  });
  return questions;
}
function lvRubric_(ctx, activity, requireApproved) {
  var rows = lvRows_(ctx, 'Rubricas').filter(function (r) {
    return r.activity_id === activity.activity_id && r.criteria_version === activity.criteria_version;
  });
  lvAssert_(rows.length > 0 && rows.length <= 32, 'RUBRIC_INVALID', 'Rubrica não encontrada.');
  var seen = Object.create(null);
  rows.forEach(function (r) {
    lvAssert_(!seen[r.criterion_id] && typeof r.max_points === 'number' && r.max_points >= 0 &&
      r.max_points <= 100 && r.evaluation_type === (activity.kind === 'OFICIAL' ? 'DOCENTE_OFICIAL' : 'FORMATIVA'),
      'RUBRIC_INVALID', 'Critérios ou limites inconsistentes.');
    seen[r.criterion_id] = true;
    if (requireApproved) lvAssert_(r.status === 'APROVADA' && r.approved_by && r.approved_at,
      'RUBRIC_NOT_APPROVED', 'Rubrica precisa de aprovação explícita.');
  });
  var sum = rows.reduce(function (acc, r) { return acc + r.max_points; }, 0);
  var max = Number(activity.kind === 'OFICIAL' ? activity.official_max : activity.xp_max);
  lvAssert_(Math.abs(sum - max) < 1e-8, 'RUBRIC_INVALID', 'A soma dos critérios diverge do valor da atividade.');
  return rows;
}
function lvCatalog_(ctx, actor) {
  return lvRows_(ctx, 'Atividades').filter(function (a) {
    return actor.role !== 'ESTUDANTE' || a.status === 'ATIVA';
  }).map(function (a) {
    return { activity_id: a.activity_id, activity_version: a.activity_version, lesson_id: a.lesson_id,
      stage: a.stage, track_id: a.track_id, title: a.title, kind: a.kind, status: a.status,
      criteria_version: a.criteria_version, schema_version: a.schema_version,
      xp_max: Number(a.xp_max), official_max: a.official_max === '' ? null : Number(a.official_max),
      questions: lvQuestions_(a), rubric: lvRubric_(ctx, a, false).map(function (r) {
        return { criterion_id: r.criterion_id, label: r.label, max_points: r.max_points, status: r.status };
      }) };
  });
}
function lvPrepareSubmission_(ctx, actor, payload, key, transportHash, submitted) {
  lvKeys_(payload, ['lesson_id','activity_id','activity_version','track_id','criteria_version','answers',
    'reflection','self_assessment','previous_submission_id','on_behalf_of'],
    ['lesson_id','activity_id','activity_version','track_id','criteria_version','answers','reflection','self_assessment']);
  var owner = lvSubmissionOwner_(ctx, actor, payload);
  var activity = lvActivity_(ctx, payload.activity_id, payload.activity_version, true);
  lvAssert_(payload.lesson_id === activity.lesson_id && payload.criteria_version === activity.criteria_version,
    'VERSION_MISMATCH', 'Aula ou versão de critérios diverge do catálogo atual.');
  lvAssert_(payload.track_id === owner.track_id && (activity.track_id === 'AMBOS' || activity.track_id === payload.track_id),
    'TRACK_MISMATCH', 'Trilha não corresponde à equipe validada.');
  lvRubric_(ctx, activity, true);
  var questions = lvQuestions_(activity);
  lvAssert_(Array.isArray(payload.answers) && payload.answers.length <= questions.length,
    'INVALID_ANSWERS', 'Lista de respostas inválida.');
  var byId = Object.create(null);
  payload.answers.forEach(function (answer) {
    lvKeys_(answer, ['question_id','answer_kind','value'], ['question_id','answer_kind','value']);
    var question = questions.filter(function (q) { return q.question_id === answer.question_id; })[0];
    lvAssert_(question && !byId[answer.question_id] && answer.answer_kind === question.answer_kind,
      'INVALID_ANSWERS', 'Pergunta desconhecida, repetida ou tipo divergente.');
    lvText_(answer.value, question.maxLength, submitted && question.required);
    byId[answer.question_id] = true;
  });
  if (submitted) questions.forEach(function (q) {
    lvAssert_(!q.required || byId[q.question_id], 'INCOMPLETE_SUBMISSION', 'Complete as perguntas obrigatórias antes de enviar.');
  });
  lvText_(payload.reflection, LV_LIMITS_.reflectionLength, submitted);
  lvKeys_(payload.self_assessment, ['understood','evidence_checked','authorship_declared'],
    ['understood','evidence_checked','authorship_declared']);
  Object.keys(payload.self_assessment).forEach(function (k) {
    lvAssert_(typeof payload.self_assessment[k] === 'boolean', 'INVALID_PAYLOAD', 'Autoavaliação deve conter somente booleanos.');
  });
  var history = lvRows_(ctx, 'Submissoes').filter(function (r) {
    return r.participant_id === owner.participant_id && r.activity_id === activity.activity_id &&
      r.activity_version === activity.activity_version;
  }).sort(function (a, b) { return Number(b.revision) - Number(a.revision); });
  if (history.length) {
    lvAssert_(payload.previous_submission_id === history[0].submission_id,
      'STALE_SUBMISSION', 'Há versão anterior ou concorrente; confira o último recibo antes de reenviar.');
  } else lvAssert_(!payload.previous_submission_id, 'STALE_SUBMISSION', 'Submissão anterior não encontrada.');
  return { submission_id: 'sub-' + key.slice(4, 36), participant_id: owner.participant_id,
    team_id: owner.team_id, activity_id: activity.activity_id, activity_version: activity.activity_version,
    criteria_version: activity.criteria_version, revision: history.length ? Number(history[0].revision) + 1 : 1,
    previous_submission_id: payload.previous_submission_id || '',
    status: submitted ? 'ENVIADA' : 'RASCUNHO', formative_xp: lvXp_(activity, payload.self_assessment) };
}
function lvApplySubmission_(ctx, actor, plan, payload) {
  var base = { submission_id: plan.submission_id, request_id: plan.request_id, payload_hash: plan.payload_hash,
    activity_id: plan.activity_id, activity_version: plan.activity_version, criteria_version: plan.criteria_version,
    team_id: plan.team_id, participant_id: plan.participant_id, revision: plan.revision,
    previous_submission_id: plan.previous_submission_id, status: 'PREPARING', created_at: plan.timestamp,
    updated_at: plan.timestamp, formative_xp: plan.formative_xp };
  lvEnsure_(ctx, 'Submissoes', base, Object.keys(base).filter(function (k) { return k !== 'status'; }));
  var answers = payload.answers.concat([
    {question_id:'__reflection',answer_kind:'text',value:payload.reflection},
    {question_id:'__self_assessment',answer_kind:'json',value:lvCanonical_(payload.self_assessment)}
  ]);
  answers.forEach(function (answer) {
    lvEnsure_(ctx, 'Respostas', { response_id: plan.submission_id + ':' + answer.question_id,
      submission_id: plan.submission_id, question_id: answer.question_id, answer_kind: answer.answer_kind,
      value: answer.value, review_status: 'PENDENTE' });
  });
  lvPatch_(ctx, 'Submissoes', lvFind_(ctx, 'Submissoes', {submission_id:plan.submission_id}), {status:plan.status});
  return { submission_id: plan.submission_id, request_id: plan.request_id, status: plan.status,
    revision: plan.revision, created_at: plan.timestamp, updated_at: plan.timestamp,
    formative_xp: plan.formative_xp, payload_hash: plan.payload_hash,
    transport_hash: plan.transport_hash, participant_id: plan.participant_id, team_id: plan.team_id,
    activity_id: plan.activity_id, activity_version: plan.activity_version, review_revision: 0 };
}
function lvProjectSubmission_(ctx, actor, plan, payload, data) {
  var sub = lvFind_(ctx, 'Submissoes', {submission_id:plan.submission_id});
  var history = lvRows_(ctx, 'Submissoes').filter(function (s) {
    return s.participant_id === sub.participant_id && s.activity_id === sub.activity_id &&
      s.activity_version === sub.activity_version;
  });
  var latest = history.sort(function (a,b) {return Number(b.revision)-Number(a.revision);})[0];
  // Replaying an old receipt must not roll progress back to an earlier revision.
  if (latest.submission_id !== sub.submission_id) return data;
  var id = 'progress-' + lvSha_(sub.participant_id + ':' + sub.activity_id + ':' + sub.activity_version).slice(0,32);
  lvUpsert_(ctx, 'Progresso', {progress_id:id}, {
    team_id: sub.team_id, participant_id: sub.participant_id, activity_id: sub.activity_id,
    activity_version: sub.activity_version, status: sub.status, formative_xp: sub.formative_xp,
    pending_count: ['APROVADA'].indexOf(sub.status) >= 0 ? 0 : 1,
    last_submission_id: sub.submission_id, updated_at: sub.updated_at
  });
  return data;
}
