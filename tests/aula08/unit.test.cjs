'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Ajv2020=require('ajv/dist/2020');
const addFormats=require('ajv-formats');
const {ROOT,moduleFile}=require('./harness.cjs');
const {Content,Model,complete,withCatalog}=require('./fixtures.cjs');
const schema=JSON.parse(fs.readFileSync(path.join(ROOT,'contracts/ppi-aula08-v1.schema.json'),'utf8'));
const ajv=new Ajv2020({allErrors:true,strict:true});addFormats(ajv);const validate=ajv.compile(schema);
const clone=x=>JSON.parse(JSON.stringify(x));
const tracks=['memorias','permanencia'];
const weights=[10,15,20,15,20,20];

function valid(data){assert.equal(validate(data),true,JSON.stringify(validate.errors,null,2));}
function invalid(data){assert.equal(validate(data),false,'Schema must reject invalid example');}
function allFiles(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allFiles(path.join(dir,e.name)):[path.join(dir,e.name)]);}

test('CONTENT-01: 26 unique slides, six linked missions and the requested 100 XP',()=>{
  assert.equal(Content.slides.length,26);assert.equal(new Set(Content.slides.map(s=>s.id)).size,26);
  assert.deepEqual(Content.missions.map(m=>m.xp),weights);
  assert.equal(Content.missions.reduce((sum,m)=>sum+m.xp,0),100);
  for(const m of Content.missions){const s=Content.slides.find(s=>s.id===m.slideId);assert.ok(s);assert.equal(s.missionId,m.id);}
});
for(const track of tracks){
  test(`CONTENT-02-${track}: all questions have unique versioned IDs and justified choices`,()=>{
    const qs=Content.missions.flatMap(m=>Content.tracks[track].missions[m.id].questions);
    assert.equal(qs.length,17);assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
    for(const q of qs){assert.match(q.id,/\.v\d+$/);assert.ok(q.prompt.length>15);assert.ok(q.explanation.length>20);assert.ok(q.objective);assert.ok(q.evidence);assert.ok(q.criterion);assert.ok(q.options.length>=2);assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);assert.equal(q.options.filter(o=>o.id===q.correct).length,1);for(const o of q.options){assert.ok(o.text.trim());assert.ok(o.feedback.length>15);}}
  });
  test(`SCORE-01-${track}: zero before practice, 100 after all six missions, no official grade`,()=>{
    const empty=Model.createState();Model.switchTrack(empty,track);assert.equal(Model.score(empty).xp,0);assert.equal(Model.score(empty).completed,0);
    const state=complete(track),score=Model.score(state);assert.equal(score.xp,100);assert.equal(score.max,100);assert.equal(score.completed,6);assert.equal(score.total,6);assert.deepEqual(score.missions.map(m=>m.xp),weights);assert.equal('grade' in score,false);
  });
  test(`SCORE-02-${track}: a mission awards its XP only after every answer is correct`,()=>{
    const state=Model.createState();Model.switchTrack(state,track);
    for(const mission of Content.missions){const questions=Content.tracks[track].missions[mission.id].questions;for(let n=0;n<questions.length;n++){Model.answer(state,mission.id,questions[n].id,questions[n].correct);const scored=Model.score(state).missions.find(m=>m.id===mission.id);assert.equal(scored.xp,n===questions.length-1?mission.xp:0);assert.equal(scored.correct,n+1);}}
  });
  test(`SCORE-03-${track}: retry never duplicates XP and changing a correct choice recalculates`,()=>{
    const state=complete(track),m=Content.missions[0],q=Content.tracks[track].missions[m.id].questions[0];
    for(let i=0;i<10;i++)Model.answer(state,m.id,q.id,q.correct);assert.equal(Model.score(state).xp,100);
    Model.answer(state,m.id,q.id,q.options.find(o=>o.id!==q.correct).id);assert.equal(Model.score(state).xp,90);Model.answer(state,m.id,q.id,q.correct);assert.equal(Model.score(state).xp,100);
  });
}
for(const mission of ['m1','m2','m3','m4','m5','m6'])test(`RESET-${mission}: reset removes only this mission's answers and XP`,()=>{
  const state=complete('memorias');const before=clone(state.tracks.memorias.answers);Model.resetMission(state,mission);const weight=Content.missions.find(m=>m.id===mission).xp;assert.equal(Model.score(state).xp,100-weight);const removed=Content.tracks.memorias.missions[mission].questions.map(q=>q.id);for(const [id,value]of Object.entries(before)){if(removed.includes(id))assert.equal(state.tracks.memorias.answers[id],undefined);else assert.equal(state.tracks.memorias.answers[id],value);}
});
test('ISOLATION-01: toggling tracks preserves separate answers, catalog and completion',()=>{
  const state=withCatalog('memorias'),saved=clone(state.tracks.memorias);Model.switchTrack(state,'permanencia');assert.equal(Model.score(state).xp,0);assert.equal(state.tracks.permanencia.catalog.RF.text,'');
  const m=Content.missions[0],questions=Content.tracks.permanencia.missions[m.id].questions;for(const q of questions)Model.answer(state,m.id,q.id,q.correct);assert.equal(Model.score(state).xp,10);Model.setCatalog(state,'RF','text','RF da trilha sintética de permanência.');Model.resetMission(state,'m1');assert.equal(Model.score(state).xp,0);Model.switchTrack(state,'memorias');assert.deepEqual(state.tracks.memorias,saved);assert.equal(Model.score(state).xp,100);
});
test('OPEN-01: free text and self-review do not award mission XP or teacher approval',()=>{
  const state=Model.createState();for(const type of ['RF','RNF','RD']){Model.setCatalog(state,type,'text','QUALQUER TEXTO NÃO É AVALIAÇÃO SEMÂNTICA');Model.setCatalog(state,type,'source','HIP-SINTETICA-01');Model.setCatalog(state,type,'sourceStatus','pending_hypothesis');Model.setCatalog(state,type,'criterion','Dado um caso sintético, Quando testado, Então conferir manualmente.');}
  for(const key of ['source','measurable','scope','ethics'])Model.setReview(state,key,true);Model.setExit(state,'Autoavaliação não é correção docente.');assert.equal(Model.score(state).xp,0);const data=Model.exportData(state);assert.equal(data.teacher_assessment.status,'pending');assert.equal(data.official_grade.status,'not_applicable');valid(data);
});
test('STATE-01: serialization and validation round-trip preserve answers and timestamps',()=>{
  const state=withCatalog('memorias');const restored=Model.validateState(JSON.stringify(state));assert.deepEqual(restored,state);assert.equal(Model.score(restored).xp,100);assert.equal(Object.prototype.hasOwnProperty.call(restored,'xp'),false);
});
test('STATE-02: malformed, unknown-version and hostile prototype payloads are rejected',()=>{
  assert.throws(()=>Model.validateState('{not JSON}'));for(const field of ['schema_version','activeTrack']){const state=Model.createState();state[field]='unknown';assert.throws(()=>Model.validateState(JSON.stringify(state)));}
  const state=Model.createState();const hostile=JSON.stringify(state).replace('"schema_version"','"__proto__":{"polluted":true},"schema_version"');assert.throws(()=>Model.validateState(hostile));assert.equal({}.polluted,undefined);
});
test('STATE-03: unrecognized question/choice and injected scoring are rejected',()=>{
  const state=Model.createState();state.tracks.memorias.answers['a08.unknown.q1.v1']='a';assert.throws(()=>Model.validateState(JSON.stringify(state)));
  const state2=Model.createState(),q=Content.tracks.memorias.missions.m1.questions[0];state2.tracks.memorias.answers[q.id]='unknown';assert.throws(()=>Model.validateState(JSON.stringify(state2)));
  const state3=Model.createState();state3.xp=100;state3.official_grade={value:10};assert.throws(()=>Model.validateState(JSON.stringify(state3)));
});
for(const track of tracks)test(`SCHEMA-01-${track}: empty and complete exports meet the 2020-12 contract`,()=>{
  const state=Model.createState();Model.switchTrack(state,track);valid(Model.exportData(state));const data=Model.exportData(withCatalog(track));valid(data);assert.equal(data.track_id,track);assert.equal(data.xp_formativo,100);assert.equal(data.lesson_id,'ppi-aula08');assert.equal(data.answer_kind,'lesson_draft');assert.equal(data.question_id,null);assert.equal(data.teacher_assessment.status,'pending');assert.equal(data.official_grade.status,'not_applicable');assert.equal(data.teacher_assessment.value,null);assert.equal(data.official_grade.value,null);assert.ok(data.completeness);assert.ok(data.training);assert.ok(data.criteria_version);assert.ok(data.answer_key_version);
});
test('SCHEMA-02: score, identity, assessment and kind corruption is rejected',()=>{
  const good=Model.exportData(withCatalog());for(const field of ['schema_version','lesson_id','answer_kind','criteria_version']){const item=clone(good);item[field]='unknown';invalid(item);}
  for(const amount of [-1,101,'100']){const item=clone(good);item.xp_formativo=amount;invalid(item);}
  const personal=clone(good);personal.student_name='Não solicitado';invalid(personal);const official=clone(good);official.official_grade.value=10;invalid(official);const teacher=clone(good);teacher.teacher_assessment.status='approved';invalid(teacher);
});
test('SCHEMA-03: two committed synthetic examples validate and cover both tracks',()=>{
  const examples=allFiles(path.join(ROOT,'contracts')).filter(p=>p.endsWith('.json')&&!p.endsWith('.schema.json')).map(p=>({file:p,data:JSON.parse(fs.readFileSync(p,'utf8'))})).filter(x=>x.data.lesson_id==='ppi-aula08');
  assert.ok(examples.length>=2,'At least two synthetic export fixtures required');assert.deepEqual([...new Set(examples.map(x=>x.data.track_id))].sort(),tracks.slice().sort());for(const e of examples)valid(e.data);
});
test('STATIC-01: lesson uses only local runtime files and contains no transport or telemetry',()=>{
  const html=fs.readFileSync(moduleFile('index.html'),'utf8');assert.doesNotMatch(html,/<(?:script|link)\b[^>]*(?:src|href)=["'](?:https?:)?\/\//i);
  for(const filename of ['aula.js','model.js','content.js']){const js=fs.readFileSync(moduleFile(filename),'utf8');assert.doesNotMatch(js,/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/,filename);}
  assert.match(html,/lang=["']pt-BR["']/);assert.match(html,/name=["']viewport["']/);
});
