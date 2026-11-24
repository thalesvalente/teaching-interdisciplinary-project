'use strict';
/* C4 independent, non-author review. These service doubles do NOT prove connected Google QA. */
const test = require('node:test');
const assert = require('node:assert/strict');
const {createHarness} = require('./backend-harness.cjs');
const L = require('../frontend/lib.js');

function ok(result) {
  assert.equal(result.ok, true, JSON.stringify(result));
  return result.data;
}
function envelope(requestId, payload) {
  return {schema_version:'1.0.0', request_id:requestId, payload};
}
function officialSubmission(h, activityId, requestId, overrides={}) {
  const activity=h.catalog.activities.find(a=>a.activity_id===activityId);
  const req=h.makeSubmission({activity_id:activity.activity_id, lesson_id:activity.lesson_id,
    activity_version:activity.activity_version, criteria_version:activity.criteria_version, ...overrides});
  req.request_id=requestId;
  return req;
}
function changeCell(sheet, matchHeader, matchValue, field, value) {
  const match=sheet.headers.indexOf(matchHeader), col=sheet.headers.indexOf(field);
  assert.ok(match>=0 && col>=0);
  const row=sheet.grid.find(r=>r[match]?.value===matchValue);
  assert.ok(row);
  row[col]={value};
}

test('C4 independent: malformed/duplicate denylist, mismatched binding and unknown session fail closed',()=>{
  const cases=[
    h=>delete h.props.PPI_PROTECTED_IDS_JSON,
    h=>h.props.PPI_PROTECTED_IDS_JSON='{}',
    h=>{const list=JSON.parse(h.props.PPI_PROTECTED_IDS_JSON);list[1]=list[0];h.props.PPI_PROTECTED_IDS_JSON=JSON.stringify(list);},
    h=>{const list=JSON.parse(h.props.PPI_PROTECTED_IDS_JSON);list[0]=h.targetId;h.props.PPI_PROTECTED_IDS_JSON=JSON.stringify(list);},
    h=>{const binding=JSON.parse(h.props.PPI_BINDING_JSON);binding.environment='QA ';h.props.PPI_BINDING_JSON=JSON.stringify(binding);},
    h=>{const binding=JSON.parse(h.props.PPI_BINDING_JSON);binding.binding_nonce='too-short';h.props.PPI_BINDING_JSON=JSON.stringify(binding);},
    h=>h.setConfig('spreadsheet_id','TEST_ANOTHER_WORKBOOK_000000000001'),
    h=>h.state.email='unauthorized@example.test'
  ];
  for(const change of cases) {
    const h=createHarness();change(h);
    assert.equal(h.call('submitActivity',h.makeSubmission()).ok,false);
    assert.equal(h.state.writes.length,0);
  }
});

test('C4 independent: current allowlist and roster revocation also deny an exact replay',()=>{
  for(const revoke of [
    h=>{const identities=JSON.parse(h.props.PPI_IDENTITIES_JSON);identities['alfa@example.test'].active=false;h.props.PPI_IDENTITIES_JSON=JSON.stringify(identities);},
    h=>changeCell(h.sheets.Participantes,'participant_id','EST-ALFA-01','status','INATIVA'),
    h=>changeCell(h.sheets.Participantes,'participant_id','EST-ALFA-01','authorship_validated',false),
    h=>changeCell(h.sheets.Equipes,'team_id','TEAM-ALFA','status','INATIVA')
  ]) {
    const h=createHarness({email:'alfa@example.test'}), req=h.makeSubmission();delete req.payload.on_behalf_of;
    const sub=ok(h.call('submitActivity',req));const writes=h.state.writes.length;
    revoke(h);
    assert.equal(h.call('submitActivity',req).ok,false);
    assert.equal(h.call('getReceipt',{submission_id:sub.submission_id}).ok,false);
    assert.equal(h.state.writes.length,writes);
    assert.equal(h.sheets.Submissoes.objects().length,1);
  }
});

test('C4 independent: same-team membership does not authorize another individual reflection',()=>{
  const h=createHarness();
  ok(h.call('registerParticipant',envelope('register-same-team-0001',{
    participant_id:'EST-ALFA-02',team_id:'TEAM-ALFA',display_name:'Pessoa sintética Alfa 02',authorship_validated:true
  })));
  const identities=JSON.parse(h.props.PPI_IDENTITIES_JSON);
  identities['alfa02@example.test']={active:true,role:'ESTUDANTE',participant_id:'EST-ALFA-02',team_id:'TEAM-ALFA'};
  h.props.PPI_IDENTITIES_JSON=JSON.stringify(identities);
  h.state.email='alfa@example.test';const req=h.makeSubmission();delete req.payload.on_behalf_of;
  const sub=ok(h.call('submitActivity',req));
  h.state.email='alfa02@example.test';
  assert.equal(h.call('getReceipt',{submission_id:sub.submission_id}).code,'NOT_FOUND_OR_FORBIDDEN');
  const progress=ok(h.call('getTeamProgress',{}));
  assert.equal(progress.team_id,'TEAM-ALFA');assert.equal(progress.items.length,1);
  assert.equal(JSON.stringify(progress).includes(req.payload.reflection),false);
  assert.equal(JSON.stringify(progress).includes(req.payload.answers[0].value),false);
});

test('C4-01 regression: an interrupted receipt cannot be audited as TRANSACTION_COMMITTED',()=>{
  const h=createHarness(), req=h.makeSubmission();
  h.state.fail={table:'Idempotencia',at:2};
  assert.equal(h.call('submitActivity',req).code,'RECOVERY_REQUIRED');
  assert.equal(h.sheets.Idempotencia.objects()[0].state,'RECOVERY_REQUIRED');
  assert.equal(h.sheets.Auditoria.objects().filter(r=>r.outcome==='SUCCESS' && r.detail_code==='TRANSACTION_COMMITTED').length,0,
    'A success/commit event must describe a durable COMMITTED ledger record.');
  ok(h.call('submitActivity',req));
  assert.equal(h.sheets.Idempotencia.objects()[0].state,'COMMITTED');
  assert.equal(h.sheets.Auditoria.objects().filter(r=>r.outcome==='SUCCESS' && r.detail_code==='TRANSACTION_COMMITTED').length,1);
  assert.equal(h.call('submitActivity',req).code,'NO_OP');
  assert.equal(h.sheets.Auditoria.objects().filter(r=>r.outcome==='SUCCESS' && r.detail_code==='TRANSACTION_COMMITTED').length,1);
});

test('C4-01 recovery: audit failure after commit is explicit and exact replay repairs one event',()=>{
  const h=createHarness(), req=h.makeSubmission();h.state.fail={table:'Auditoria',at:1};
  assert.equal(h.call('submitActivity',req).code,'RECOVERY_REQUIRED');
  assert.equal(h.sheets.Idempotencia.objects()[0].state,'COMMITTED');
  const sub=h.sheets.Submissoes.objects()[0];
  assert.equal(h.sheets.Auditoria.objects().length,0);
  assert.equal(h.call('getReceipt',{submission_id:sub.submission_id}).code,'RECOVERY_REQUIRED');
  assert.equal(h.call('submitActivity',req).code,'NO_OP');
  assert.equal(h.call('getReceipt',{submission_id:sub.submission_id}).ok,true);
  assert.equal(h.sheets.Auditoria.objects().length,1);
  assert.equal(h.sheets.Submissoes.objects().length,1);
  assert.equal(h.call('submitActivity',req).code,'NO_OP');
  assert.equal(h.sheets.Auditoria.objects().length,1);
});

test('C4 independent: editor-only initialization validates the target/admin and leaves every access gate closed',()=>{
  for(const alter of [
    h=>{const binding=JSON.parse(h.props.PPI_BINDING_JSON);binding.expected_title+=' WRONG';h.props.PPI_BINDING_JSON=JSON.stringify(binding);},
    h=>{const ids=JSON.parse(h.props.PPI_PROTECTED_IDS_JSON);ids.pop();h.props.PPI_PROTECTED_IDS_JSON=JSON.stringify(ids);},
    h=>h.state.email='alfa@example.test'
  ]) {
    const h=createHarness();alter(h);
    assert.equal(h.call('initializeBinding_').ok,false);
    assert.equal(h.state.writes.length,0);
  }
  const h=createHarness();h.setConfig('spreadsheet_id','');h.setConfig('binding_nonce','');
  const initialized=ok(h.call('initializeBinding_'));
  assert.equal(initialized.writes_enabled,false);assert.equal(initialized.student_access_enabled,false);
  assert.equal(initialized.browserRoundTrip,false);assert.equal(initialized.connected_qa,'NOT_RUN');
  assert.equal(h.props.PPI_WRITES_ENABLED,'false');
  const config=Object.fromEntries(h.sheets.Config.objects().map(r=>[r.config_key,r.config_value]));
  assert.equal(config.writes_enabled,'false');assert.equal(config.student_access_enabled,'false');
  assert.equal(config.spreadsheet_id,h.targetId);
  const count=h.state.writes.length;
  assert.equal(h.call('initializeBinding_').code,'NO_OP');assert.equal(h.state.writes.length,count);
  assert.equal(h.call('submitActivity',h.makeSubmission()).code,'WRITES_DISABLED');
});

test('C4-02 regression: official projection selects the plan-bound version before revision order',()=>{
  const h=createHarness();ok(h.approvePlan());
  const old=h.catalog.activities.find(a=>a.activity_id==='PPI1-3A');let previous;
  for(let i=1;i<=3;i++) {
    const req=officialSubmission(h,old.activity_id,'old-version-submission-'+i);
    if(previous)req.payload.previous_submission_id=previous.submission_id;
    previous=ok(h.call('submitActivity',req));
  }
  ok(h.call('reviewSubmission',h.makeReview(previous)));
  assert.equal(h.sheets.Notas_3a_Etapa.objects()[0].item_a,2);

  const activity={...old,activity_version:'1.1.0',criteria_version:'PPI1-3A-RUBRIC-1.1.0'};
  for(const field of ['status','reflection_prompt','self_assessment_criteria','xp_policy'])delete activity[field];
  const rubric=h.catalog.rubrics.filter(r=>r.activity_id===old.activity_id)
    .map(r=>({criterion_id:r.criterion_id,label:r.label,max_points:r.max_points}));
  ok(h.call('saveActivityVersion',envelope('create-official-version-0001',{
    activity,rubric,change_reason:'Independent synthetic version regression.'
  })));
  ok(h.call('approveRubric',envelope('approve-official-rubric-0001',{
    activity_id:activity.activity_id,activity_version:activity.activity_version,
    criteria_version:activity.criteria_version,approval_ref:'SYNTHETIC-APPROVAL-ONLY'
  })));
  const items=h.catalog.activities.filter(a=>a.kind==='OFICIAL').map(a=>({activity_id:a.activity_id,
    activity_version:a.activity_id===activity.activity_id?activity.activity_version:a.activity_version,
    criteria_version:a.activity_id===activity.activity_id?activity.criteria_version:a.criteria_version}));
  ok(h.call('approvePlan',envelope('approve-official-plan-0002',{
    plan_version:'QA-PLAN-SYNTHETIC-2',approval_ref:'SYNTHETIC-APPROVAL-ONLY',items
  })));
  ok(h.call('activateActivity',envelope('activate-official-version-0001',{
    activity_id:activity.activity_id,activity_version:activity.activity_version,status:'ATIVA'
  })));
  const current=ok(h.call('submitActivity',officialSubmission(h,activity.activity_id,'new-version-submission-0001',{
    activity_version:activity.activity_version,criteria_version:activity.criteria_version
  })));
  const review=h.makeReview(current,{criteria_version:activity.criteria_version});review.request_id='new-version-review-0001';
  const result=ok(h.call('reviewSubmission',review));
  assert.equal(previous.revision,3);assert.equal(current.revision,1);
  assert.equal(result.official_grade_posted,true);
  const row=h.sheets.Notas_3a_Etapa.objects()[0];
  assert.equal(row.item_a,2);assert.equal(row.decision_a,'APROVADA');
  assert.equal(row.plan_version,'QA-PLAN-SYNTHETIC-2');
  assert.deepEqual(JSON.parse(row.source_evaluation_ids),result.evaluation_ids);
});

test('C4 independent: individual official scores stay separated and cross-person review is rejected',()=>{
  const h=createHarness();ok(h.approvePlan());
  const alfa=ok(h.call('submitActivity',officialSubmission(h,'PPI1-3A','individual-alfa-0001')));
  const beta=ok(h.call('submitActivity',officialSubmission(h,'PPI1-3A','individual-beta-0001',{
    on_behalf_of:'EST-BETA-01',track_id:'PERMANENCIA'
  })));
  const wrong=h.makeReview(alfa,{participant_id:'EST-BETA-01'});wrong.request_id='individual-wrong-0001';
  assert.equal(h.call('reviewSubmission',wrong).code,'NOT_FOUND_OR_FORBIDDEN');
  ok(h.call('reviewSubmission',h.makeReview(alfa)));
  const betaReview=h.makeReview(beta);betaReview.payload.scores.forEach(s=>{s.score/=2;});
  ok(h.call('reviewSubmission',betaReview));
  const grades=h.sheets.Notas_3a_Etapa.objects();
  assert.equal(grades.length,2);
  assert.equal(grades.find(r=>r.participant_id==='EST-ALFA-01').item_a,2);
  assert.equal(grades.find(r=>r.participant_id==='EST-BETA-01').item_a,1);
  h.state.email='beta@example.test';
  assert.equal(h.call('getReceipt',{submission_id:alfa.submission_id}).code,'NOT_FOUND_OR_FORBIDDEN');
  assert.equal(ok(h.call('getReceipt',{submission_id:beta.submission_id})).participant_id,'EST-BETA-01');
});

test('C4 independent: an old admin/teacher request does not retain a revoked role',()=>{
  const h=createHarness();const plan=h.approvePlan();ok(plan);
  const identities=JSON.parse(h.props.PPI_IDENTITIES_JSON);
  identities['teacher@example.test'].role='DOCENTE';h.props.PPI_IDENTITIES_JSON=JSON.stringify(identities);
  assert.equal(h.approvePlan().code,'FORBIDDEN');
  const sub=ok(h.call('submitActivity',h.makeSubmission()));const review=h.makeReview(sub);
  ok(h.call('reviewSubmission',review));
  identities['teacher@example.test'].active=false;h.props.PPI_IDENTITIES_JSON=JSON.stringify(identities);
  const writes=h.state.writes.length;
  assert.equal(h.call('reviewSubmission',review).ok,false);
  assert.equal(h.state.writes.length,writes);
});

test('C4 independent: literal Unicode/HTML/formula content preserves canonical hash and CSV escaping',()=>{
  const h=createHarness();const req=h.makeSubmission();delete req.payload.on_behalf_of;
  const samples=['\uFEFF\t=1+1',' \n+SUM(1;2)','-1+2','@A1',"'=literal",'<img src=x onerror=alert(1)>','ação a\u0301 🐟','texto, com "aspas"\ne linha'];
  req.payload.answers.forEach((a,i)=>{a.value=samples[i];});
  req.payload_hash=L.sha256Sync(L.canonical(req.payload));
  assert.equal(req.payload_hash,h.context.lvSha_(h.context.lvCanonical_(req.payload)));
  L.validateEnvelope(req,L.ACTIVITY,false);h.state.email='alfa@example.test';
  const sub=ok(h.call('submitActivity',req));const receipt=ok(h.call('getReceipt',{submission_id:sub.submission_id}));
  assert.deepEqual(receipt.answers.map(a=>a.value),samples);
  assert.deepEqual(h.state.unsafeFormulas,[]);
  for(const text of samples) {
    const expected=/^[\s\uFEFF]*[=+\-@']/.test(text)?"'"+text:text;
    assert.equal(h.context.lvCsvCell_(text),'"'+expected.replace(/"/g,'""')+'"');
  }
});

test('C4-03 regression: browser import uses the same request ID bounds and text validity as server',()=>{
  for(const id of ['x','-validlong',':validlong','x'.repeat(129)]) {
    const h=createHarness();const req=h.makeSubmission();delete req.payload.on_behalf_of;req.request_id=id;
    req.payload_hash=L.sha256Sync(L.canonical(req.payload));
    assert.throws(()=>L.validateEnvelope(req,L.ACTIVITY,false),'Invalid request ID must be rejected before import.');
    h.state.email='alfa@example.test';assert.equal(h.call('submitActivity',req).ok,false);
  }
  const h=createHarness();const max=h.makeSubmission();delete max.payload.on_behalf_of;
  max.request_id='x'.repeat(128);max.payload_hash=L.sha256Sync(L.canonical(max.payload));
  assert.doesNotThrow(()=>L.validateEnvelope(max,L.ACTIVITY,false));
  h.state.email='alfa@example.test';ok(h.call('submitActivity',max));
  for(const text of ['\uD800','\uDC00','texto\u0000fim','texto\u000Bfim','texto\u007Ffim']) {
    const req=h.makeSubmission();delete req.payload.on_behalf_of;req.payload.answers[0].value=text;
    assert.throws(()=>{
      req.payload_hash=L.sha256Sync(L.canonical(req.payload));L.validateEnvelope(req,L.ACTIVITY,false);
    },'Malformed Unicode/control text must not enter the imported form.');
  }
});
