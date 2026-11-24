'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {createHarness}=require('./backend-harness.cjs');
function ok(result){assert.equal(result.ok,true,JSON.stringify(result));return result.data;}

test('bootstrap returns authenticated scoped identity without private binding',()=>{
  const h=createHarness();const b=ok(h.call('getBootstrap'));
  assert.equal(b.environment,'QA');assert.equal(b.viewer.role,'ADMIN');assert.equal(b.activities.length,7);
  assert.equal(JSON.stringify(b).includes(h.targetId),false);assert.equal(h.state.writes.length,0);
});
test('blank/unknown identity fails closed before any write',()=>{
  for(const email of ['', 'stranger@example.test']) {const h=createHarness({email});
    assert.equal(h.call('submitActivity',h.makeSubmission()).ok,false);assert.equal(h.state.writes.length,0);}
});
test('target binding, denylist, copied QA nonce, script id and timezone reject writes',()=>{
  const mutations=[h=>delete h.props.PPI_BINDING_JSON,
    h=>h.props.PPI_PROTECTED_IDS_JSON=JSON.stringify([h.targetId,'TEST_OTHER_PROTECTED_0000000001']),
    h=>{const b=JSON.parse(h.props.PPI_BINDING_JSON);b.script_id='OTHER';h.props.PPI_BINDING_JSON=JSON.stringify(b);},
    h=>h.setConfig('binding_nonce','COPIED_PRODUCTION_NONCE'),h=>h.setConfig('environment','PRODUCTION'),
    h=>h.state.timeZone='UTC',h=>h.state.locale='en_US'];
  for(const mutate of mutations){const h=createHarness();mutate(h);assert.equal(h.call('submitActivity',h.makeSubmission()).ok,false);assert.equal(h.state.writes.length,0);}
});
test('production needs independent QA/privacy/approval gate; writing flags default deny',()=>{
  const h=createHarness();delete h.props.PPI_WRITES_ENABLED;
  assert.equal(h.call('submitActivity',h.makeSubmission()).code,'WRITES_DISABLED');
  h.props.PPI_WRITES_ENABLED='true';const b=JSON.parse(h.props.PPI_BINDING_JSON);b.environment='PRODUCTION';
  h.props.PPI_BINDING_JSON=JSON.stringify(b);h.setConfig('environment','PRODUCTION');
  assert.equal(h.call('submitActivity',h.makeSubmission()).code,'WRITES_DISABLED');assert.equal(h.state.writes.length,0);
});
test('submit -> receipt -> same request NO_OP -> changed payload CONFLICT exactly one snapshot',()=>{
  const h=createHarness();const req=h.makeSubmission();const first=ok(h.call('submitActivity',req));
  assert.equal(first.formative_xp,100);assert.equal(h.call('submitActivity',req).code,'NO_OP');
  req.payload.answers[0].value='Outro conteúdo fictício';assert.equal(h.call('submitActivity',req).code,'CONFLICT');
  assert.equal(h.sheets.Submissoes.objects().length,1);assert.equal(h.sheets.Respostas.objects().length,10);
  assert.equal(h.sheets.Conflitos.objects().length,1);
  const receipt=ok(h.call('getReceipt',{submission_id:first.submission_id}));
  assert.equal(receipt.answers.length,8);assert.equal(receipt.review_revision,0);assert.equal(receipt.activity_id,'AULA08-FORMATIVA');
  assert.equal(h.state.locks,h.state.unlock);
});
test('student authority comes from private mapping; cannot spoof identity, review or another group',()=>{
  const h=createHarness({email:'alfa@example.test'});const req=h.makeSubmission();delete req.payload.on_behalf_of;
  const first=ok(h.call('submitActivity',req));assert.equal(first.participant_id,'EST-ALFA-01');
  req.request_id='request-spoof-team';req.payload.team_id='TEAM-BETA';assert.equal(h.call('submitActivity',req).ok,false);
  req.payload.on_behalf_of='EST-BETA-01';assert.equal(h.call('submitActivity',req).code,'FORBIDDEN');
  assert.equal(h.call('getTeamProgress',{team_id:'TEAM-BETA'}).code,'FORBIDDEN');
  assert.equal(h.call('reviewSubmission',h.makeReview(first)).code,'FORBIDDEN');
  h.state.email='beta@example.test';assert.equal(h.call('getReceipt',{submission_id:first.submission_id}).code,'NOT_FOUND_OR_FORBIDDEN');
});
test('student access and authorship gates do not trust self assessment',()=>{
  const h=createHarness({email:'alfa@example.test'});h.setConfig('student_access_enabled','false');
  assert.equal(h.call('getBootstrap').code,'STUDENT_ACCESS_DISABLED');
  h.setConfig('student_access_enabled','true');h.sheets.Participantes.grid[1][5]={value:false};
  const req=h.makeSubmission();delete req.payload.on_behalf_of;
  assert.equal(h.call('submitActivity',req).code,'PARTICIPANT_NOT_VALIDATED');
});
test('formula-like strings and leading apostrophe roundtrip as exact text',()=>{
  const h=createHarness();const req=h.makeSubmission();const strings=['=IMPORTXML("x","y")','+SUM(1,2)','-1+2','@A1',
    '\t=cmd','\n=cmd',"'=preserve-leading-apostrophe",'Texto: = apenas evidência'];
  req.payload.answers.forEach((a,i)=>a.value=strings[i]);const sub=ok(h.call('submitActivity',req));
  assert.deepEqual(ok(h.call('getReceipt',{submission_id:sub.submission_id})).answers.map(a=>a.value),strings);
  assert.deepEqual(h.state.unsafeFormulas,[]);
});
test('invalid version/type/size/unknown question/prototype key and import hash are rejected',()=>{
  const cases=[r=>r.schema_version='2.0.0',r=>r.payload.answers[0].value='x'.repeat(4001),
    r=>r.payload.answers[0].answer_kind='html',r=>r.payload.answers[0].question_id='__reflection',
    r=>r.payload.self_assessment.understood='true',r=>r.payload.criteria_version='OLD',
    r=>r.payload_hash='a'.repeat(64),r=>r.payload.constructor='bad',
    r=>r.payload.answers[0].value='\uD800'];
  for(const change of cases){const h=createHarness();const req=h.makeSubmission();change(req);
    assert.equal(h.call('submitActivity',req).ok,false);assert.equal(h.sheets.Submissoes.objects().length,0);}
});
test('canonical hash sorts objects while preserving arrays and Unicode',()=>{
  const h=createHarness();assert.equal(h.context.lvCanonical_({b:2,a:1}),'\{"a":1,"b":2\}'.replaceAll('\\',''));
  assert.notEqual(h.context.lvCanonical_(['a','b']),h.context.lvCanonical_(['b','a']));
  const req=h.makeSubmission();req.payload_hash=crypto.createHash('sha256').update(h.context.lvCanonical_(req.payload),'utf8').digest('hex');
  assert.equal(h.call('submitActivity',req).ok,true);
});
test('new request without latest receipt cannot duplicate or overwrite; draft revisions preserve history',()=>{
  const h=createHarness();let req=h.makeSubmission();const draft=ok(h.call('saveDraft',req));
  req.request_id='submit-from-draft';assert.equal(h.call('submitActivity',req).code,'STALE_SUBMISSION');
  req.payload.previous_submission_id=draft.submission_id;const sent=ok(h.call('submitActivity',req));assert.equal(sent.revision,2);
  const later={...req,request_id:'stale-concurrent-0001'};assert.equal(h.call('submitActivity',later).code,'STALE_SUBMISSION');
  assert.equal(h.sheets.Submissoes.objects().length,2);assert.equal(h.sheets.Progresso.objects().length,1);
  assert.equal(ok(h.call('getTeamProgress',{})).total_formative_xp,100);
  assert.equal(h.call('saveDraft',h.makeSubmission()).code,'NO_OP');
  assert.equal(h.sheets.Progresso.objects()[0].last_submission_id,sent.submission_id);
});
test('lock contention is retryable and performs zero writes',()=>{
  const h=createHarness({lockBusy:true});assert.equal(h.call('submitActivity',h.makeSubmission()).code,'BUSY_RETRY');
  assert.equal(h.state.writes.length,0);assert.equal(h.state.unlock,0);
});
test('mid-answer failure blocks fresh requests, then exact replay repairs without duplicate rows',()=>{
  const h=createHarness();const req=h.makeSubmission();h.state.fail={table:'Respostas',at:4};
  assert.equal(h.call('submitActivity',req).code,'RECOVERY_REQUIRED');
  assert.equal(h.sheets.Idempotencia.objects()[0].state,'RECOVERY_REQUIRED');
  assert.equal(h.call('submitActivity',{...req,request_id:'fresh-request-0002'}).code,'RECOVERY_REQUIRED');
  ok(h.call('submitActivity',req));assert.equal(h.sheets.Submissoes.objects().length,1);
  assert.equal(h.sheets.Respostas.objects().length,10);assert.equal(h.sheets.Idempotencia.objects()[0].state,'COMMITTED');
});
test('post-commit projection failure repairs on replay without duplicating primary records',()=>{
  const h=createHarness();const req=h.makeSubmission();h.state.fail={table:'Progresso',at:1};
  assert.equal(h.call('submitActivity',req).code,'RECOVERY_REQUIRED');
  assert.equal(h.sheets.Idempotencia.objects()[0].state,'COMMITTED');
  assert.equal(h.call('submitActivity',req).code,'NO_OP');assert.equal(h.sheets.Progresso.objects().length,1);
  assert.equal(h.sheets.Submissoes.objects().length,1);
});
test('rubric proposals and formative approval never become official grades',()=>{
  const h=createHarness();const sub=ok(h.call('submitActivity',h.makeSubmission()));
  const review=ok(h.call('reviewSubmission',h.makeReview(sub)));assert.equal(review.official_grade_posted,false);
  assert.equal(h.sheets.Notas_3a_Etapa.objects().length,0);assert.equal(h.sheets.Notas_4a_Etapa.objects().length,0);
  assert.equal(ok(h.call('getReceipt',{submission_id:sub.submission_id})).review_revision,1);
});
test('official item starts proposal only; plan/rubric approval and criterion limits are enforced',()=>{
  const h=createHarness();const a=h.catalog.activities.find(a=>a.activity_id==='PPI1-3A');
  const req=h.makeSubmission({activity_id:a.activity_id,activity_version:a.activity_version,lesson_id:a.lesson_id,criteria_version:a.criteria_version});
  const sub=ok(h.call('submitActivity',req));assert.equal(sub.formative_xp,0);
  assert.equal(h.call('reviewSubmission',h.makeReview(sub)).code,'PLAN_NOT_APPROVED');
  const proposal=h.makeReview(sub,{decision:'PROPOSTA'});proposal.request_id='proposal-0001';
  assert.equal(ok(h.call('reviewSubmission',proposal)).official_grade_posted,false);
  assert.equal(h.sheets.Notas_3a_Etapa.objects()[0].item_a,'');
  ok(h.approvePlan());
  const reviewed=h.makeReview(sub,{expected_revision:1});reviewed.request_id='approve-review-0002';
  assert.equal(ok(h.call('reviewSubmission',reviewed)).official_grade_posted,true);
  assert.equal(h.sheets.Notas_3a_Etapa.objects()[0].item_a,2);
  assert.equal(h.sheets.Notas_3a_Etapa.objects()[0].item_b,'');
  assert.equal(h.call('reviewSubmission',{...reviewed,request_id:'stale-review-0003'}).code,'STALE_REVIEW');
});
test('incomplete criterion writes never publish official grade; replay restores approval',()=>{
  const h=createHarness();ok(h.approvePlan());const a=h.catalog.activities.find(a=>a.activity_id==='PPI1-4A');
  const sub=ok(h.call('submitActivity',h.makeSubmission({activity_id:a.activity_id,lesson_id:a.lesson_id,criteria_version:a.criteria_version})));
  const review=h.makeReview(sub);h.state.fail={table:'Avaliacoes_Docente',at:3};
  assert.equal(h.call('reviewSubmission',review).code,'RECOVERY_REQUIRED');assert.equal(h.sheets.Notas_4a_Etapa.objects().length,0);
  assert.equal(ok(h.call('reviewSubmission',review)).official_grade_posted,true);
  assert.equal(h.sheets.Avaliacoes_Docente.objects().length,4);assert.equal(h.sheets.Notas_4a_Etapa.objects()[0].item_a,2);
});
test('N3/N4 sums 2+3+5 and 2+4+4 only after explicit synthetic approvals; no N1/N2 or annual result',()=>{
  const h=createHarness();ok(h.approvePlan());
  for(const a of h.catalog.activities.filter(a=>a.kind==='OFICIAL')) {
    const req=h.makeSubmission({activity_id:a.activity_id,lesson_id:a.lesson_id,criteria_version:a.criteria_version});req.request_id='request-'+a.activity_id;
    const sub=ok(h.call('submitActivity',req));ok(h.call('reviewSubmission',h.makeReview(sub)));
  }
  for(const stage of [3,4]) {const row=h.sheets['Notas_'+stage+'a_Etapa'].objects()[0];
    assert.equal(row.item_a+row.item_b+row.item_c,10);assert.equal(row.decision_a,'APROVADA');
    const formula=h.sheets['Notas_'+stage+'a_Etapa'].grid.find(r=>r[0]?.value==='EST-ALFA-01')[7].formula;
    assert.match(formula,/plan_approval_ref/);assert.match(formula,/COUNT\(B/);assert.match(formula,/plan_max_PPI1-/);
    assert.equal(formula.includes(','),false);assert.match(formula,/;Config!/);
  }
  assert.equal(Object.keys(h.sheets).some(k=>/1a_Etapa|2a_Etapa|Anual/.test(k)),false);
});
test('revoked plan blocks totals and old approval replay cannot restore it',()=>{
  const h=createHarness();ok(h.approvePlan());
  ok(h.call('revokePlan',{schema_version:'1.0.0',request_id:'revoke-plan-0001',payload:{plan_version:'QA-PLAN-SYNTHETIC-1',reason:'Revogação sintética de teste.'}}));
  assert.equal(h.approvePlan().code,'NO_OP');assert.equal(h.sheets.Config.objects().find(r=>r.config_key==='plan_status').config_value,'RASCUNHO');
});
test('teacher export excludes individual answers, identity email, private binding and grades by default',()=>{
  const h=createHarness();ok(h.call('submitActivity',h.makeSubmission()));
  const report=ok(h.call('exportReport',{format:'JSON'}));
  assert.equal(report.content.includes('Conteúdo sintético'),false);assert.equal(report.content.includes('example.test'),false);
  assert.equal(report.content.includes(h.targetId),false);assert.equal(JSON.parse(report.content).official_grade,false);
  assert.match(ok(h.call('exportReport',{format:'CSV'})).content,/formative_xp/);
});
test('audit stores event codes and hashes, never answers, credentials or identity email',()=>{
  const h=createHarness();ok(h.call('submitActivity',h.makeSubmission()));const audit=JSON.stringify(h.sheets.Auditoria.objects());
  assert.equal(audit.includes('Conteúdo sintético'),false);assert.equal(audit.includes('example.test'),false);
  assert.equal(audit.includes(h.targetId),false);assert.match(audit,/TRANSACTION_COMMITTED/);
});
test('blank PK template formula does not become a real grade row',()=>{
  const h=createHarness();h.sheets.Notas_3a_Etapa.grid[1]=Array.from({length:12},()=>({value:''}));
  h.sheets.Notas_3a_Etapa.grid[1][7]={value:'',formula:'=IF(A2="","",1)'};
  const ctx=h.context.lvContext_(false,false);assert.equal(h.context.lvRows_(ctx,'Notas_3a_Etapa').length,0);
});

test('catalog authoring is versioned, approves rubric explicitly and activates only after approval',()=>{
  const h=createHarness();const old=h.catalog.activities.find(a=>a.activity_id==='AULA08-FORMATIVA');
  const activity={...old,activity_version:'1.1.0',criteria_version:'FORM-1.1.0'};
  for(const field of ['status','reflection_prompt','self_assessment_criteria','xp_policy'])delete activity[field];
  const rubric=h.catalog.rubrics.filter(r=>r.activity_id===old.activity_id).map(r=>({criterion_id:r.criterion_id,label:r.label,max_points:r.max_points}));
  const req={schema_version:'1.0.0',request_id:'new-version-0001',payload:{activity,rubric,change_reason:'Melhoria sintética de instruções.'}};
  assert.equal(ok(h.call('saveActivityVersion',req)).status,'RASCUNHO');
  const activate={schema_version:'1.0.0',request_id:'activate-version-0001',payload:{activity_id:old.activity_id,activity_version:'1.1.0',status:'ATIVA'}};
  assert.equal(h.call('activateActivity',activate).code,'RUBRIC_NOT_APPROVED');
  ok(h.call('approveRubric',{schema_version:'1.0.0',request_id:'approve-rubric-0001',payload:{activity_id:old.activity_id,
    activity_version:'1.1.0',criteria_version:'FORM-1.1.0',approval_ref:'SYNTHETIC-QA-RUBRIC-APPROVAL'}}));
  assert.equal(ok(h.call('activateActivity',activate)).status,'ATIVA');
  assert.equal(h.call('saveActivityVersion',{...req,request_id:'new-version-again-0002'}).code,'IMMUTABLE_VERSION');
  const oldRow=h.sheets.Atividades.objects().find(r=>r.activity_id===old.activity_id && r.activity_version==='1.0.0');
  assert.equal(oldRow.criteria_version,'FORM-1.0.0');
});
test('team/participant registration validates teacher role without creating a login',()=>{
  const h=createHarness();const base={schema_version:'1.0.0',request_id:'new-team-0001',payload:{team_id:'TEAM-GAMA',display_name:'Equipe Gama fictícia',track_id:'PERMANENCIA'}};
  ok(h.call('registerTeam',base));
  const participant={schema_version:'1.0.0',request_id:'new-participant-0001',payload:{participant_id:'EST-GAMA-01',team_id:'TEAM-GAMA',
    display_name:'Participante Gama fictício',authorship_validated:false}};
  assert.equal(ok(h.call('registerParticipant',participant)).login_created,false);
  const req=h.makeSubmission({on_behalf_of:'EST-GAMA-01',track_id:'PERMANENCIA'});
  assert.equal(h.call('submitActivity',req).code,'PARTICIPANT_NOT_VALIDATED');
  h.state.email='alfa@example.test';assert.equal(h.call('registerTeam',{...base,request_id:'student-team-0002'}).code,'FORBIDDEN');
});
test('failure while writing commit receipt cannot expose a commit without full data',()=>{
  const h=createHarness();const req=h.makeSubmission();h.state.fail={table:'Idempotencia',at:2};
  assert.equal(h.call('submitActivity',req).code,'RECOVERY_REQUIRED');
  const row=h.sheets.Idempotencia.objects()[0];assert.equal(row.state,'RECOVERY_REQUIRED');
  assert.ok(JSON.parse(row.receipt_json).plan);
  assert.equal(h.sheets.Progresso.objects().length,0);ok(h.call('submitActivity',req));
  assert.equal(h.sheets.Submissoes.objects().length,1);
});
test('oversized UTF-8 envelope is rejected independently of character count',()=>{
  const h=createHarness();const req=h.makeSubmission();
  req.payload.answers.forEach(answer=>answer.value='漢'.repeat(4000));
  assert.equal(h.call('submitActivity',req).code,'PAYLOAD_TOO_LARGE');assert.equal(h.sheets.Submissoes.objects().length,0);
});
test('activity inactive and missing required answer reject submit, while incomplete draft remains explicit',()=>{
  const h=createHarness();const req=h.makeSubmission();req.payload.answers=[];req.payload.reflection='';
  assert.equal(h.call('submitActivity',req).code,'INCOMPLETE_SUBMISSION');
  assert.equal(ok(h.call('saveDraft',req)).status,'RASCUNHO');
  const activity=h.sheets.Atividades.grid.find(r=>r[0]?.value==='AULA08-FORMATIVA');activity[12]={value:'RASCUNHO'};
  assert.equal(h.call('submitActivity',{...h.makeSubmission(),request_id:'inactive-0002'}).code,'ACTIVITY_INACTIVE');
});
test('official review rejects missing, duplicate and excessive criterion scores',()=>{
  for(const mutate of [r=>r.payload.scores.pop(),r=>r.payload.scores[0].score=100,r=>r.payload.scores[1].criterion_id=r.payload.scores[0].criterion_id]){
    const h=createHarness();ok(h.approvePlan());const a=h.catalog.activities.find(a=>a.activity_id==='PPI1-3A');
    const sub=ok(h.call('submitActivity',h.makeSubmission({activity_id:a.activity_id,lesson_id:a.lesson_id,criteria_version:a.criteria_version})));
    const review=h.makeReview(sub);mutate(review);assert.equal(h.call('reviewSubmission',review).code,'INVALID_SCORES');
    assert.equal(h.sheets.Avaliacoes_Docente.objects().length,0);assert.equal(h.sheets.Notas_3a_Etapa.objects().length,0);
  }
});
test('non-teacher cannot change catalog, plan approval or roster',()=>{
  const h=createHarness({email:'alfa@example.test'});
  for(const method of ['saveActivityVersion','approveRubric','activateActivity','approvePlan','revokePlan','registerTeam','registerParticipant'])
    assert.equal(h.call(method,{schema_version:'1.0.0',request_id:'forbidden-0001',payload:{}}).code,'FORBIDDEN');
});

test('editor-only initialization binds blank metadata, closes flags, is idempotent and never claims browser QA',()=>{
  const h=createHarness();h.setConfig('spreadsheet_id','');h.setConfig('binding_nonce','');
  const initialized=ok(h.call('initializeBinding_'));
  assert.equal(initialized.initialized,true);assert.equal(initialized.writes_enabled,false);
  assert.equal(initialized.student_access_enabled,false);assert.equal(initialized.browserRoundTrip,false);
  assert.equal(initialized.connected_qa,'NOT_RUN');assert.equal(h.props.PPI_WRITES_ENABLED,'false');
  assert.equal(h.sheets.Config.objects().find(r=>r.config_key==='spreadsheet_id').config_value,h.targetId);
  const writes=h.state.writes.length;
  assert.equal(h.call('initializeBinding_').code,'NO_OP');assert.equal(h.state.writes.length,writes);
  assert.equal(h.sheets.Auditoria.objects().filter(r=>r.operation==='initializeBinding').length,1);
  assert.equal(JSON.stringify(initialized).includes(h.targetId),false);
});
test('initialization cannot rebind, accept an unverified title, omit counterpart denylist or run as student',()=>{
  const changes=[h=>h.setConfig('spreadsheet_id','TEST_ANOTHER_SPREADSHEET_000000001'),
    h=>h.setConfig('binding_nonce','DIFFERENT_NONCE_1234567890123456'),
    h=>{const b=JSON.parse(h.props.PPI_BINDING_JSON);b.expected_title+=' OTHER';h.props.PPI_BINDING_JSON=JSON.stringify(b);},
    h=>h.props.PPI_PROTECTED_IDS_JSON=JSON.stringify(['TEST_OLD_PPI_PROTECTED_000000000001','TEST_WEB_QA_PROTECTED_000000000002']),
    h=>h.state.email='alfa@example.test',h=>h.state.email=''];
  for(const change of changes){const h=createHarness();change(h);assert.equal(h.call('initializeBinding_').ok,false);
    assert.equal(h.state.writes.length,0);assert.equal(h.props.PPI_WRITES_ENABLED,'true');}
});

test('normal exact replay performs no new Sheet writes after all projections are current',()=>{
  const h=createHarness();const req=h.makeSubmission();ok(h.call('submitActivity',req));
  const writes=h.state.writes.length;assert.equal(h.call('submitActivity',req).code,'NO_OP');
  assert.equal(h.state.writes.length,writes);
});
