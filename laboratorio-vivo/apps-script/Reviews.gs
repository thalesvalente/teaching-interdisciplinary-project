/** Teacher criterion review and strictly committed grade projections. */
function lvPlanItem_(ctx, activity) {
  lvAssert_(ctx.config.plan_status === 'APROVADO' && typeof ctx.config.plan_approval_ref === 'string' &&
    ctx.config.plan_approval_ref.trim().length >= 8 && ctx.config.plan_version,
    'PLAN_NOT_APPROVED', 'Plano institucional em rascunho ou sem referência de aprovação.');
  var items;
  try { items = JSON.parse(ctx.config.plan_items_json || 'null'); }
  catch (e) { lvFail_('PLAN_NOT_APPROVED', 'Vínculos versionados do plano não estão configurados.'); }
  lvAssert_(Array.isArray(items), 'PLAN_NOT_APPROVED', 'Vínculos versionados do plano não estão configurados.');
  var match = items.filter(function (item) {
    return item.activity_id === activity.activity_id && item.activity_version === activity.activity_version &&
      item.criteria_version === activity.criteria_version && Number(item.official_max) === Number(activity.official_max);
  });
  lvAssert_(match.length === 1, 'PLAN_VERSION_MISMATCH', 'Esta versão da atividade não pertence ao plano aprovado.');
  return match[0];
}
function lvReviewHistory_(ctx, submissionId) {
  return lvCommitted_(ctx, 'reviewSubmission').filter(function (entry) {
    return entry.data.submission_id === submissionId;
  }).sort(function (a,b) { return b.data.review_revision - a.data.review_revision; });
}
function lvPrepareReview_(ctx, actor, payload, key) {
  lvTeacher_(actor);
  lvKeys_(payload, ['submission_id','participant_id','decision','criteria_version','scores','justification','expected_revision'],
    ['submission_id','participant_id','decision','criteria_version','scores','justification','expected_revision']);
  lvId_(payload.submission_id); lvId_(payload.participant_id);
  var submission = lvFind_(ctx, 'Submissoes', {submission_id:payload.submission_id});
  lvAssert_(submission && submission.participant_id === payload.participant_id,
    'NOT_FOUND_OR_FORBIDDEN', 'Submissão não corresponde ao participante indicado.');
  lvAssert_(['RASCUNHO','PREPARING','RECONCILE_REQUIRED'].indexOf(submission.status) < 0,
    'SUBMISSION_NOT_READY', 'Somente submissões enviadas e confirmadas podem ser avaliadas.');
  var submitted = lvCommitted_(ctx, 'submitActivity').some(function (r) {
    return r.data.submission_id === submission.submission_id;
  });
  lvAssert_(submitted, 'SUBMISSION_NOT_READY', 'O envio ainda não está confirmado no ledger.');
  var latest = lvRows_(ctx, 'Submissoes').filter(function (s) {
    return s.participant_id === submission.participant_id && s.activity_id === submission.activity_id &&
      s.activity_version === submission.activity_version;
  }).sort(function (a,b) {return Number(b.revision)-Number(a.revision);})[0];
  lvAssert_(latest.submission_id === submission.submission_id, 'STALE_SUBMISSION', 'A equipe já criou uma revisão mais recente.');
  lvParticipant_(ctx, payload.participant_id);
  var activity = lvActivity_(ctx, submission.activity_id, submission.activity_version, true);
  lvAssert_(payload.criteria_version === submission.criteria_version && payload.criteria_version === activity.criteria_version,
    'VERSION_MISMATCH', 'Versão da rubrica diverge do envio.');
  var rubric = lvRubric_(ctx, activity, true);
  lvAssert_(['PROPOSTA','EM_REVISAO','APROVADA','DEVOLVIDA'].indexOf(payload.decision) >= 0,
    'INVALID_DECISION', 'Decisão docente inválida.');
  lvText_(payload.justification, 2000, true);
  lvAssert_(Array.isArray(payload.scores) && payload.scores.length === rubric.length,
    'INVALID_SCORES', 'Avalie todos os critérios da versão vigente.');
  var seen = Object.create(null);
  payload.scores.forEach(function (entry) {
    lvKeys_(entry, ['criterion_id','score'], ['criterion_id','score']);
    var criterion = rubric.filter(function (r) {return r.criterion_id === entry.criterion_id;})[0];
    lvAssert_(criterion && !seen[entry.criterion_id] && typeof entry.score === 'number' &&
      Number.isFinite(entry.score) && entry.score >= 0 && entry.score <= criterion.max_points &&
      Math.abs(entry.score * 100 - Math.round(entry.score * 100)) < 1e-8,
      'INVALID_SCORES', 'Critério duplicado ou pontuação fora do limite/precisão de duas casas.');
    seen[entry.criterion_id] = true;
  });
  var history = lvReviewHistory_(ctx, submission.submission_id);
  var current = history.length ? history[0].data.review_revision : 0;
  lvAssert_(Number.isInteger(payload.expected_revision) && payload.expected_revision === current,
    'STALE_REVIEW', 'A avaliação foi alterada; carregue a revisão atual antes de salvar.');
  var official = activity.kind === 'OFICIAL';
  if (official && payload.decision === 'APROVADA') lvPlanItem_(ctx, activity);
  return { submission_id:submission.submission_id, participant_id:submission.participant_id,
    activity_id:activity.activity_id, activity_version:activity.activity_version,
    criteria_version:activity.criteria_version, decision:payload.decision, review_revision:current+1,
    evaluation_ids: payload.scores.map(function (s) { return 'eval-' + key.slice(4,36) + ':' + s.criterion_id; }),
    official:official, plan_version:ctx.config.plan_version, grade_total:
      Math.round(payload.scores.reduce(function (sum,s) {return sum+s.score;},0)*100)/100 };
}
function lvApplyReview_(ctx, actor, plan, payload) {
  lvTeacher_(actor);
  lvParticipant_(ctx, plan.participant_id);
  var activity = lvActivity_(ctx, plan.activity_id, plan.activity_version, true);
  lvRubric_(ctx, activity, true);
  if (plan.official && plan.decision === 'APROVADA') {
    lvPlanItem_(ctx, activity);
    lvAssert_(ctx.config.plan_version === plan.plan_version, 'PLAN_VERSION_MISMATCH', 'Plano mudou durante a avaliação.');
  }
  payload.scores.forEach(function (entry, index) {
    lvEnsure_(ctx, 'Avaliacoes_Docente', { evaluation_id:plan.evaluation_ids[index],
      submission_id:plan.submission_id, participant_id:plan.participant_id, criterion_id:entry.criterion_id,
      criteria_version:plan.criteria_version, score:entry.score, decision:plan.decision,
      reviewer_id:actor.participant_id, justification:payload.justification, revision:plan.review_revision,
      created_at:plan.timestamp });
  });
  lvPatch_(ctx, 'Submissoes', lvFind_(ctx,'Submissoes',{submission_id:plan.submission_id}), {
    status:plan.decision === 'PROPOSTA' ? 'EM_REVISAO' : plan.decision, updated_at:plan.timestamp
  });
  return { submission_id:plan.submission_id, participant_id:plan.participant_id, decision:plan.decision,
    review_revision:plan.review_revision, evaluation_ids:plan.evaluation_ids,
    official_grade_posted:false, updated_at:plan.timestamp };
}
function lvGradeFormula_(stage, row) {
  var columns = ['B','D','F'];
  var ids = ['PPI1-' + stage + 'A','PPI1-' + stage + 'B','PPI1-' + stage + 'C'];
  var checks = ['A'+row+'<>""','C'+row+'="APROVADA"','E'+row+'="APROVADA"','G'+row+'="APROVADA"',
    'J'+row+'="APROVADO"','I'+row+'=VLOOKUP("plan_version",Config!$A$2:$B$1000,2,FALSE)',
    'VLOOKUP("plan_status",Config!$A$2:$B$1000,2,FALSE)="APROVADO"',
    'LEN(VLOOKUP("plan_approval_ref",Config!$A$2:$B$1000,2,FALSE))>=8',
    'COUNT(B'+row+',D'+row+',F'+row+')=3'];
  columns.forEach(function (col,index) {
    checks.push(col+row+'>=0');
    checks.push(col+row+'<=VALUE(VLOOKUP("plan_max_'+ids[index]+'",Config!$A$2:$B$1000,2,FALSE))');
  });
  checks.push('SUM(B'+row+',D'+row+',F'+row+')<=10');
  // Native Sheets pt_BR parses semicolons. Excel OOXML uses an invariant comma grammar;
  // the separate workbook fixture remains in that grammar and must not be rewritten here.
  return ('=IFERROR(IF(AND('+checks.join(',')+'),SUM(B'+row+',D'+row+',F'+row+'),""),"")').replace(/,/g,';');
}
function lvProjectGrades_(ctx, participantId) {
  // Only ledger-COMMITTED reviews are eligible; partial criterion rows never enter grades.
  var all = lvCommitted_(ctx, 'reviewSubmission').filter(function (entry) {
    return entry.plan.participant_id === participantId && entry.plan.official;
  });
  var currentItems=[];
  try {currentItems=JSON.parse(ctx.config.plan_items_json||'[]');} catch(ignored) {currentItems=[];}
  if(!Array.isArray(currentItems))currentItems=[];
  [3,4].forEach(function (stage) {
    var table = 'Notas_'+stage+'a_Etapa';
    var existing = lvFind_(ctx, table, {participant_id:participantId});
    var chosen = [];
    ['A','B','C'].forEach(function (suffix) {
      var id = 'PPI1-'+stage+suffix;
      var selected=currentItems.filter(function(i){return i.activity_id===id;})[0];
      var relevant = all.filter(function (r) {
        if(r.plan.activity_id!==id)return false;
        if(!selected)return r.plan.plan_version===ctx.config.plan_version;
        // Revision counters restart at one for each activity version. Never compare them across versions.
        return r.plan.plan_version===ctx.config.plan_version && r.plan.activity_version===selected.activity_version &&
          r.plan.criteria_version===selected.criteria_version;
      }).sort(function (a,b) {
        var sa = lvFind_(ctx, 'Submissoes', {submission_id:a.plan.submission_id});
        var sb = lvFind_(ctx, 'Submissoes', {submission_id:b.plan.submission_id});
        return Number(sb.revision)-Number(sa.revision) || b.plan.review_revision-a.plan.review_revision;
      });
      chosen.push(relevant[0] || null);
    });
    if (!existing && chosen.every(function (r) {return !r;})) return;
    var lastReviewAt=chosen.filter(function(r){return !!r;}).map(function(r){return r.plan.timestamp;}).sort().pop();
    var data = { participant_id:participantId, plan_version:ctx.config.plan_version,
      plan_status:ctx.config.plan_status, updated_at:lastReviewAt||(existing?existing.updated_at:''), source_evaluation_ids:'[]' };
    var sourceIds = [];
    ['a','b','c'].forEach(function (suffix,index) {
      var entry = chosen[index];
      data['item_'+suffix] = '';
      data['decision_'+suffix] = '';
      if (!entry) return;
      var activity = lvActivity_(ctx, entry.plan.activity_id, entry.plan.activity_version, false);
      var eligible = entry.plan.decision === 'APROVADA' && entry.plan.plan_version === ctx.config.plan_version;
      if (eligible) {
        try {lvPlanItem_(ctx,activity);} catch(e) {eligible=false;}
      }
      data['decision_'+suffix] = eligible ? 'APROVADA' : (entry.plan.decision === 'APROVADA' ? 'EM_REVISAO' : entry.plan.decision);
      if (eligible) {
        var criteria = lvRows_(ctx,'Avaliacoes_Docente').filter(function (r) {
          return entry.plan.evaluation_ids.indexOf(r.evaluation_id)>=0;
        });
        lvAssert_(criteria.length === entry.plan.evaluation_ids.length &&
          criteria.every(function(r) {return r.decision==='APROVADA' && r.participant_id===participantId;}),
          'INTEGRITY_ERROR','Avaliações confirmadas não foram encontradas integralmente.');
        var value = Math.round(criteria.reduce(function(sum,r) {return sum+Number(r.score);},0)*100)/100;
        lvAssert_(Math.abs(value-entry.plan.grade_total)<1e-8 && value<=Number(activity.official_max),
          'INTEGRITY_ERROR','Total de avaliação inconsistente.');
        data['item_'+suffix] = value;
        sourceIds = sourceIds.concat(entry.plan.evaluation_ids);
      }
    });
    data.source_evaluation_ids = JSON.stringify(sourceIds);
    var rowIndex = lvUpsert_(ctx,table,{participant_id:participantId},data);
    var range=lvSheet_(ctx,table).getRange(rowIndex,8),formula=lvGradeFormula_(stage,rowIndex);
    if(range.getFormula()!==formula)range.setFormula(formula);
  });
}
function lvProjectReview_(ctx, actor, plan, payload, data) {
  lvProjectSubmission_(ctx, actor, plan, payload, data);
  if (plan.official) lvProjectGrades_(ctx, plan.participant_id);
  var latest = lvReviewHistory_(ctx,plan.submission_id)[0];
  var posted = false;
  if (plan.official && latest && latest.plan.key === plan.key && plan.decision==='APROVADA') {
    var stage = Number(plan.activity_id.slice(5,6));
    var note = lvFind_(ctx,'Notas_'+stage+'a_Etapa',{participant_id:plan.participant_id});
    var suffix = plan.activity_id.slice(-1).toLowerCase();
    posted = !!note && note['decision_'+suffix]==='APROVADA' && note.plan_version===plan.plan_version;
  }
  return Object.assign({},data,{official_grade_posted:posted});
}

