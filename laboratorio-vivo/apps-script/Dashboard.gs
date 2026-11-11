/** Privacy-scoped queries. Responses and individual reflections never enter aggregate exports. */
function lvReceipt_(ctx, actor, input) {
  lvKeys_(input,['submission_id'],['submission_id']);
  lvId_(input.submission_id);
  var submission = lvFind_(ctx,'Submissoes',{submission_id:input.submission_id});
  lvCanReadSubmission_(actor,submission);
  var committed = lvCommitted_(ctx).filter(function (entry) {
    return ['saveDraft','submitActivity'].indexOf(entry.row.operation)>=0 && entry.data.submission_id===input.submission_id;
  })[0];
  lvAssert_(committed,'RECOVERY_REQUIRED','O envio aguarda retomada e não possui recibo confirmado.');
  lvAssert_(lvFind_(ctx,'Auditoria',{event_id:'evt-'+committed.plan.key}),
    'RECOVERY_REQUIRED','O envio foi persistido, mas sua auditoria precisa ser reconciliada por replay.');
  var pending = lvRows_(ctx,'Idempotencia').some(function (entry) {
    if (entry.state==='COMMITTED') return false;
    try {return JSON.parse(entry.receipt_json).plan.submission_id===input.submission_id;} catch(e) {return true;}
  });
  lvAssert_(!pending,'RECOVERY_REQUIRED','Há uma alteração interrompida para este envio.');
  var review = lvReviewHistory_(ctx,input.submission_id)[0];
  var rows = lvRows_(ctx,'Respostas').filter(function (r) {return r.submission_id===input.submission_id;});
  var reflection = rows.filter(function(r) {return r.question_id==='__reflection';})[0];
  var self = rows.filter(function(r) {return r.question_id==='__self_assessment';})[0];
  return Object.assign({},committed.data,{status:submission.status,updated_at:submission.updated_at,
    criteria_version:submission.criteria_version,review_revision:review?review.data.review_revision:0,
    answers:rows.filter(function(r) {return r.question_id.indexOf('__')!==0;}).map(function(r) {
      return {question_id:r.question_id,answer_kind:r.answer_kind,value:r.value};}),
    reflection:reflection?reflection.value:'',self_assessment:self?JSON.parse(self.value):{},
    review:review?{decision:review.data.decision,review_revision:review.data.review_revision,
      official_grade_posted:review.data.official_grade_posted}:null});
}
function lvTeamScope_(ctx,actor,input) {
  var team = input && input.team_id;
  if (team!==undefined && team!=='') lvId_(team);
  if (actor.role==='ESTUDANTE') {
    lvAssert_(!team || team===actor.team_id,'FORBIDDEN','Acesso limitado à própria equipe.');
    return actor.team_id;
  }
  lvTeacher_(actor);
  if (team) lvAssert_(lvFind_(ctx,'Equipes',{team_id:team}),'TEAM_NOT_FOUND','Equipe não encontrada.');
  return team || 'ALL';
}
function lvProgress_(ctx,actor,input) {
  lvKeys_(input || {},['team_id']);
  var team = lvTeamScope_(ctx,actor,input || {});
  var activities = lvRows_(ctx,'Atividades');
  var items = lvRows_(ctx,'Progresso').filter(function(r) {return team==='ALL' || r.team_id===team;}).map(function(r) {
    var activity = activities.filter(function(a) {return a.activity_id===r.activity_id && a.activity_version===r.activity_version;})[0];
    return {progress_id:r.progress_id,team_id:r.team_id,participant_id:r.participant_id,
      activity_id:r.activity_id,activity_version:r.activity_version,title:activity?activity.title:r.activity_id,
      status:r.status,formative_xp:Number(r.formative_xp),pending_count:Number(r.pending_count),
      last_submission_id:r.last_submission_id,updated_at:r.updated_at};
  });
  // One score per participant/activity/version; revisions never add XP repeatedly.
  return {team_id:team,items:items,total_formative_xp:items.reduce(function(sum,r) {return sum+r.formative_xp;},0)};
}
function lvExport_(ctx,actor,input) {
  lvKeys_(input,['format','team_id'],['format']);
  lvAssert_(['JSON','CSV'].indexOf(input.format)>=0,'INVALID_FORMAT','Exportação deve ser JSON ou CSV; PDF usa impressão acessível.');
  var progress = lvProgress_(ctx,actor,input.team_id?{team_id:input.team_id}:{});
  lvAssert_(progress.items.length<=LV_LIMITS_.exportRows,'EXPORT_TOO_LARGE','Restrinja o relatório por equipe.');
  var stamp = new Date().toISOString();
  if (input.format==='JSON') return {filename:'ppi-laboratorio-progresso.json',mime_type:'application/json',content:JSON.stringify({
    schema_version:LV_VERSION_,environment:ctx.environment,generated_at:stamp,timezone:'America/Fortaleza',
    report_type:'PROGRESSO_FORMATIVO',official_grade:false,progress:progress},null,2)};
  var headers = ['team_id','participant_id','activity_id','activity_version','status','formative_xp','pending_count','updated_at'];
  var lines = [headers.map(lvCsvCell_).join(',')].concat(progress.items.map(function(row) {
    return headers.map(function(h) {return lvCsvCell_(row[h]);}).join(',');
  }));
  return {filename:'ppi-laboratorio-progresso.csv',mime_type:'text/csv;charset=utf-8',content:'\uFEFF'+lines.join('\r\n')+'\r\n'};
}

