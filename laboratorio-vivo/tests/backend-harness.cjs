'use strict';
// Local deterministic Apps Script service doubles. This is NOT connected Google QA.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT,'contracts/sheets-schema.json'),'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT,'fixtures/catalogo.json'),'utf8'));
const identities = JSON.parse(fs.readFileSync(path.join(ROOT,'fixtures/qa-identidades.json'),'utf8'));

function createHarness(options={}) {
  const state = {email:'teacher@example.test',lockBusy:false,locked:false,locks:0,unlock:0,writes:[],fail:null,
    unsafeFormulas:[],openIds:[],timeZone:'America/Fortaleza',locale:'pt_BR'};
  const targetId = 'TEST_NEW_QA_WORKBOOK_0000000000000001';
  const scriptId = 'TEST_SCRIPT_QA_000000000000001';
  const nonce = 'TEST_BINDING_NONCE_123456789012345678901234';
  const title='PPI I — Laboratório Vivo 2026.2 — QA — DADOS FICTÍCIOS';
  const props = {
    PPI_BINDING_JSON:JSON.stringify({spreadsheet_id:targetId,environment:'QA',script_id:scriptId,binding_nonce:nonce,expected_title:title}),
    PPI_PROTECTED_IDS_JSON:JSON.stringify(['TEST_OLD_PPI_PROTECTED_000000000001','TEST_WEB_QA_PROTECTED_000000000002','TEST_OTHER_ENV_PROTECTED_0000000003']),
    PPI_WRITES_ENABLED:'true',
    PPI_IDENTITIES_JSON:JSON.stringify({
      'teacher@example.test':{active:true,role:'ADMIN',participant_id:'DOCENTE-QA',display_name:'Docente fictício'},
      'alfa@example.test':{active:true,role:'ESTUDANTE',participant_id:'EST-ALFA-01',team_id:'TEAM-ALFA'},
      'beta@example.test':{active:true,role:'ESTUDANTE',participant_id:'EST-BETA-01',team_id:'TEAM-BETA'}
    })
  };
  function maybeFail(table,kind) {
    if(state.fail && state.fail.table===table && (!state.fail.kind || state.fail.kind===kind)) {
      state.fail.count=(state.fail.count||0)+1;
      if(state.fail.count===(state.fail.at||1)) {state.fail=null;throw new Error('Simulated Sheets failure');}
    }
  }
  function ingest(value,table) {
    if(typeof value==='string' && value.startsWith("'"))return {value:value.slice(1)};
    if(typeof value==='string' && value.startsWith('=')) {state.unsafeFormulas.push({table,value});return {value:'MOCK_FORMULA',formula:value};}
    return {value};
  }
  class Range {
    constructor(sheet,row,col,numRows=1,numCols=1) {Object.assign(this,{sheet,row,col,numRows,numCols});}
    getValues(){return Array.from({length:this.numRows},(_,i)=>Array.from({length:this.numCols},(_,j)=>
      this.sheet.grid[this.row+i-1]?.[this.col+j-1]?.value??''));}
    getFormula(){return this.sheet.grid[this.row-1]?.[this.col-1]?.formula||'';}
    setValues(values){
      if(!state.locked)throw new Error('Mock detected unlocked write');
      maybeFail(this.sheet.name,'setValues');
      for(let i=0;i<this.numRows;i++) for(let j=0;j<this.numCols;j++) {
        this.sheet.grid[this.row+i-1]??=[];
        this.sheet.grid[this.row+i-1][this.col+j-1]=ingest(values[i][j],this.sheet.name);
      }
      state.writes.push({table:this.sheet.name,row:this.row,col:this.col,kind:'setValues'});return this;
    }
    setValue(value){return this.setValues([[value]]);}
    setFormula(formula){
      if(!state.locked)throw new Error('Mock detected unlocked formula write');
      maybeFail(this.sheet.name,'setFormula');
      this.sheet.grid[this.row-1]??=[];
      this.sheet.grid[this.row-1][this.col-1]={value:'',formula};
      state.writes.push({table:this.sheet.name,row:this.row,col:this.col,kind:'setFormula'});return this;
    }
  }
  class Sheet {
    constructor(name,headers){this.name=name;this.headers=headers;this.grid=[headers.map(value=>({value}))];}
    getRange(...args){return new Range(this,...args);}
    getLastRow(){let last=this.grid.length;while(last>0 && !(this.grid[last-1]||[]).some(c=>c&&(c.value!==''||c.formula)))last--;return last;}
    seed(obj){this.grid.push(this.headers.map(h=>({value:obj[h]??''})));}
    objects(){return this.grid.slice(1).map(row=>Object.fromEntries(this.headers.map((h,i)=>[h,row[i]?.value??'']))).filter(o=>o[this.headers[0]]!=='');}
  }
  const sheets=Object.fromEntries(schema.tables.map(t=>[t.name,new Sheet(t.name,t.headers)]));
  const config={schema_version:'1.0.0',environment:'QA',spreadsheet_id:targetId,binding_nonce:nonce,
    period:'2026.2',timezone:'America/Fortaleza',writes_enabled:'true',plan_version:'DRAFT-2026.2',
    plan_status:'RASCUNHO',plan_approval_ref:'',student_access_enabled:'true',retention_days:'180'};
  for(const [key,value] of Object.entries(config))sheets.Config.seed({config_key:key,config_value:value,value_type:'string',version:'1.0.0',approval_status:'RASCUNHO'});
  for(const activity of catalog.activities)sheets.Atividades.seed({...activity,status:'ATIVA',questions_json:JSON.stringify(activity.questions)});
  for(const rubric of catalog.rubrics)sheets.Rubricas.seed({...rubric,status:'APROVADA',approved_by:'DOCENTE-QA',approved_at:'2026-11-10T12:00:00.000Z'});
  for(const team of identities.teams)sheets.Equipes.seed({...team,created_at:'2026-11-10T12:00:00.000Z'});
  for(const participant of identities.participants)sheets.Participantes.seed({...participant,created_at:'2026-11-10T12:00:00.000Z'});
  const book={getId:()=>targetId,getName:()=>title,getSheetByName:name=>sheets[name]||null,getSpreadsheetTimeZone:()=>state.timeZone,
    getSpreadsheetLocale:()=>state.locale};
  const context=vm.createContext({
    Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},
      computeDigest:(_,str)=>Array.from(crypto.createHash('sha256').update(str,'utf8').digest()),
      newBlob:str=>({getBytes:()=>Array.from(Buffer.from(str,'utf8'))}),getUuid:()=>crypto.randomUUID()},
    Session:{getActiveUser:()=>({getEmail:()=>state.email})},
    ScriptApp:{getScriptId:()=>scriptId},
    PropertiesService:{getScriptProperties:()=>({getProperty:key=>props[key]??null,setProperty:(key,value)=>{props[key]=value;}})},
    SpreadsheetApp:{openById:id=>{state.openIds.push(id);if(id!==targetId)throw new Error('No such mock target');return book;},flush:()=>{}},
    LockService:{getScriptLock:()=>({tryLock:()=>{if(state.lockBusy)return false;state.locked=true;state.locks++;return true;},
      hasLock:()=>state.locked,releaseLock:()=>{state.locked=false;state.unlock++;}})},
    HtmlService:{createTemplateFromFile:()=>({evaluate:()=>({setTitle(){return this;},addMetaTag(){return this;}})}),
      createHtmlOutputFromFile:()=>({getContent:()=>''})}
  });
  for(const file of fs.readdirSync(path.join(ROOT,'apps-script')).filter(f=>f.endsWith('.gs')).sort())
    vm.runInContext(fs.readFileSync(path.join(ROOT,'apps-script',file),'utf8'),context,{filename:file});
  function call(method,payload){return JSON.parse(JSON.stringify(context[method](payload===undefined?undefined:JSON.parse(JSON.stringify(payload)))));}
  function setConfig(key,value){const row=sheets.Config.grid.find(r=>r[0]?.value===key);if(row)row[1]={value};else sheets.Config.seed({config_key:key,config_value:value,value_type:'string'});}
  function makeSubmission(overrides={}){
    const activity=catalog.activities.find(a=>a.activity_id==='AULA08-FORMATIVA');
    return {schema_version:'1.0.0',request_id:'request-00000001',payload:{lesson_id:activity.lesson_id,
      activity_id:activity.activity_id,activity_version:activity.activity_version,criteria_version:activity.criteria_version,
      track_id:'QUILOMBOLA',answers:activity.questions.map(q=>({question_id:q.question_id,answer_kind:q.answer_kind,
        value:'Conteúdo sintético com acentos: Itapecuru-Mirim, ação e hipótese 🐟.'})),
      reflection:'Reflexão individual fictícia; IA declarada e conteúdo conferido.',
      self_assessment:{understood:true,evidence_checked:true,authorship_declared:true},on_behalf_of:'EST-ALFA-01',...overrides}};
  }
  function approvePlan(){
    const items=catalog.activities.filter(a=>a.kind==='OFICIAL').map(a=>({activity_id:a.activity_id,
      activity_version:a.activity_version,criteria_version:a.criteria_version}));
    return call('approvePlan',{schema_version:'1.0.0',request_id:'plan-qa-approval-0001',payload:{
      plan_version:'QA-PLAN-SYNTHETIC-1',approval_ref:'SYNTHETIC-QA-ONLY-APPROVAL',items}});
  }
  function makeReview(submission,overrides={}){
    const activity=catalog.activities.find(a=>a.activity_id===submission.activity_id);
    const rubric=catalog.rubrics.filter(r=>r.activity_id===activity.activity_id && r.criteria_version===activity.criteria_version);
    return {schema_version:'1.0.0',request_id:'review-'+submission.submission_id,payload:{submission_id:submission.submission_id,
      participant_id:submission.participant_id,decision:'APROVADA',criteria_version:activity.criteria_version,
      scores:rubric.map(r=>({criterion_id:r.criterion_id,score:r.max_points})),justification:'Revisão docente inteiramente fictícia.',expected_revision:0,...overrides}};
  }
  Object.assign(state,options);
  return {state,props,sheets,context,call,setConfig,makeSubmission,makeReview,approvePlan,catalog,targetId,scriptId};
}
module.exports={createHarness};
