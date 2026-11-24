'use strict';
/* Author/CI browser evidence only. Apps Script is stubbed here; this is NOT connected QA. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {once}=require('node:events');
const playwright=require('playwright');
const axeSource=require('axe-core').source;
const L=require('../frontend/lib.js');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.env.PPI_LAB_BROWSER_OUTPUT||path.join(root,'test-results','browser'));
const browsers=(process.env.PPI_LAB_BROWSERS||'chromium,firefox,webkit').split(',').map(x=>x.trim()).filter(Boolean);
const viewports=[{width:1280,height:720},{width:1280,height:650},{width:390,height:844},{width:320,height:700}];
const results=[];
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
  const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '');
  let file=path.resolve(root,relative||'index.html');
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain; charset=utf-8','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
});
function record(name,details){results.push({name,status:'PASS',...details});process.stdout.write('PASS '+name+'\n');}
async function audit(page,name){
  await page.addScriptTag({content:axeSource});
  const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
  fs.writeFileSync(path.join(output,name+'-axe.json'),JSON.stringify({violations:result.violations,passes:result.passes.map(x=>x.id),incomplete:result.incomplete.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)}))},null,2));
  assert.deepEqual(result.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),[],'Axe WCAG violation in '+name);return {axe_violations:0,axe_incomplete:result.incomplete.length};
}
async function assertNoOverflow(page,name){
  const widths=await page.evaluate(()=>({viewport:window.innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));assert.ok(widths.document<=widths.viewport&&widths.body<=widths.viewport,'Horizontal overflow in '+name+': '+JSON.stringify(widths));
}
async function setStep(page,step){await page.locator('[data-step="'+step+'"]').click();await page.locator('#step-'+step).waitFor({state:'visible'});}
async function checkOffline(browser,name,base){
  for(const viewport of viewports){
    const context=await browser.newContext({viewport,acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',dialog=>dialog.accept());const label=name+'-'+viewport.width+'x'+viewport.height;
    await page.goto(base+'/frontend/index.html');await page.locator('#q_problema').waitFor({state:'attached'});assert.equal(await page.locator('#submit-server').isDisabled(),true);assert.equal(await page.locator('#open-lab').isDisabled(),true);
    await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link','Skip link must be first keyboard stop');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'workspace','Skip link must move focus to the activity workspace');
    await assertNoOverflow(page,label);const guideAudit=await audit(page,label+'-guide');await page.screenshot({path:path.join(output,label+'-guide.png'),fullPage:true});
    await page.locator('#sample-button').click();assert.match(await page.locator('#q_problema').inputValue(),/FICTÍCIO/);await assertNoOverflow(page,label+'-investigate');await audit(page,label+'-investigate');
    await setStep(page,'reflect');for(const key of L.SELF.map(x=>x.key))await page.locator('#self-'+key).check();assert.equal(await page.locator('#xp-value').innerText(),'100');await assertNoOverflow(page,label+'-reflect');await audit(page,label+'-reflect');
    await setStep(page,'deliver');assert.match(await page.locator('#delivery-completion').innerText(),/9 de 9/);await assertNoOverflow(page,label+'-deliver');await audit(page,label+'-deliver');
    await page.locator('#save-local').click();assert.match(await page.locator('#notice').innerText(),/Nenhum dado foi enviado/);assert.equal(await page.evaluate(()=>!!localStorage.getItem('ppi-lv:offline-draft:1.0.0')),true);
    const downloadPromise=page.waitForEvent('download');await page.locator('#export-json').click();const download=await downloadPromise;const downloadFile=path.join(output,label+'-draft.json');await download.saveAs(downloadFile);const exported=JSON.parse(fs.readFileSync(downloadFile,'utf8'));L.validateEnvelope(exported,L.ACTIVITY,false);
    const original=await page.locator('#q_problema').inputValue();const tampered=JSON.parse(JSON.stringify(exported));tampered.payload.answers[0].value='Conteúdo adulterado';await page.locator('#import-file').setInputFiles({name:'alterado.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(tampered))});await page.locator('#error-summary').waitFor({state:'visible'});assert.match(await page.locator('#error-summary').innerText(),/hash/);assert.equal(await page.locator('#q_problema').inputValue(),original);assert.equal(await page.evaluate(()=>document.activeElement.id),'error-summary');
    await page.locator('#import-file').setInputFiles({name:'valido.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.locator('#step-investigate').waitFor({state:'visible'});assert.match(await page.locator('#notice').innerText(),/Nenhuma escrita/);assert.equal(await page.locator('#q_problema').inputValue(),original);
    if(name==='chromium'&&viewport.width===1280&&viewport.height===720){await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await page.pdf({path:path.join(output,'filled-report.pdf'),format:'A4',printBackground:true});assert.match(await page.locator('#print-report').innerText(),/RASCUNHO LOCAL/);assert.match(await page.locator('#print-report').innerText(),/100 \/ 100 XP/);assert.match(await page.locator('#print-report').innerText(),/CENÁRIO FICTÍCIO/);}
    await setStep(page,'deliver');await page.locator('#delete-local').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ppi-lv:offline-draft:1.0.0')),null);await page.locator('#clear-form').click();assert.equal(await page.locator('#q_problema').inputValue(),'');
    if(name==='chromium'&&viewport.width===1280&&viewport.height===720){await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await page.pdf({path:path.join(output,'blank-form.pdf'),format:'A4',printBackground:true});assert.match(await page.locator('#print-report').innerText(),/Campo em branco/);}
    assert.deepEqual(errors,[]);record(label,{...guideAudit,steps:4,offline_roundtrip:'PASS',tampered_import:'REJECTED',console_errors:0,connected_qa:'NOT_RUN'});await context.close();
  }
}
async function checkAdapter(browser,name,base){
  const activity=JSON.parse(JSON.stringify(L.ACTIVITY));activity.status='ATIVA';activity.questions=activity.questions.map(q=>({...q,maxLength:q.max_length}));activity.rubric=[{criterion_id:'qa-evidence',label:'Clareza da evidência',max_points:10}];
  const context=await browser.newContext({viewport:{width:1280,height:720}});const page=await context.newPage();page.on('dialog',d=>d.accept());const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({activity})=>{
    window.__adapter={calls:[],ledger:{},firstFailure:true,reviews:0};
    const receipts={};const activities=[activity];
    const makeRunner=(success,failure)=>new Proxy({}, {get(_,key){if(key==='withSuccessHandler')return f=>makeRunner(f,failure);if(key==='withFailureHandler')return f=>makeRunner(success,f);return arg=>{
      const s=window.__adapter;s.calls.push({method:key,arg:arg===undefined?null:JSON.parse(JSON.stringify(arg))});
      setTimeout(()=>{
        if(key==='getBootstrap')return success({ok:true,code:'OK',data:{schema_version:'1.0.0',environment:'QA',timezone:'America/Fortaleza',writes_enabled:true,student_access_enabled:false,plan:{version:'PLANO-RASCUNHO-1.0.0',status:'RASCUNHO'},viewer:{role:'DOCENTE',participant_id:'QA-DOCENTE',team_id:'',display_name:'Docente fictício'},activities:[activity],capabilities:{submit:true,review:true,admin:true,export:true}}});
        if(key==='getActivityCatalog')return success({ok:true,code:'OK',data:{activities}});
        if(key==='getTeamProgress')return success({ok:true,code:'OK',data:{team_id:'QA-ALFA',items:[],total_formative_xp:0}});
        if(key==='saveDraft'||key==='submitActivity'){
          if(s.ledger[arg.request_id])return success({ok:true,code:'NO_OP',data:s.ledger[arg.request_id]});
          const receipt={submission_id:'QA-SUBMISSION-001',request_id:arg.request_id,status:key==='submitActivity'?'ENVIADA':'RASCUNHO',revision:1,created_at:'2026-11-10T22:00:00-03:00',updated_at:'2026-11-10T22:00:00-03:00',formative_xp:0,payload_hash:arg.payload_hash,activity_id:activity.activity_id,activity_version:activity.activity_version,criteria_version:activity.criteria_version,participant_id:'QA-ALFA-01',team_id:'QA-ALFA',review_revision:0,answers:arg.payload.answers,reflection:arg.payload.reflection,self_assessment:arg.payload.self_assessment};s.ledger[arg.request_id]=receipt;receipts[receipt.submission_id]=receipt;
          if(s.firstFailure){s.firstFailure=false;return failure(new Error('Simulated ambiguous network failure after commit.'));}return success({ok:true,code:'CREATED',data:receipt});
        }
        if(key==='getReceipt'){const receipt=receipts[arg.submission_id];if(!receipt)return success({ok:false,code:'NOT_FOUND',error:{message:'Não encontrada.'}});return success({ok:true,code:'OK',data:receipt});}
        if(key==='reviewSubmission'){s.reviews+=1;return success({ok:true,code:'CREATED',data:{submission_id:arg.payload.submission_id,decision:arg.payload.decision,evaluation_ids:['QA-EVAL-001'],official_grade_posted:false,review_revision:1}});}
        if(key==='saveActivityVersion'){activities.push({...arg.payload.activity,status:'RASCUNHO',rubric:arg.payload.rubric});return success({ok:true,code:'CREATED',data:{activity_id:arg.payload.activity.activity_id,activity_version:arg.payload.activity.activity_version,status:'RASCUNHO'}});}
        if(key==='approveRubric'){const selected=activities.find(a=>a.activity_id===arg.payload.activity_id&&a.activity_version===arg.payload.activity_version);selected.rubric.forEach(c=>{c.status='APROVADA';});return success({ok:true,code:'CREATED',data:{activity_id:selected.activity_id,status:'APROVADA'}});}
        if(key==='activateActivity'){const selected=activities.find(a=>a.activity_id===arg.payload.activity_id&&a.activity_version===arg.payload.activity_version);selected.status=arg.payload.status;return success({ok:true,code:'CREATED',data:{activity_id:selected.activity_id,status:selected.status}});}
        if(key==='exportReport')return success({ok:true,code:'OK',data:{filename:'qa-report.json',mime_type:'application/json',content:'{"synthetic":true}'}});
        return success({ok:false,code:'UNKNOWN',error:{message:'Método desconhecido.'}});
      },1);
    };}});window.google={script:{run:makeRunner(()=>{},()=>{})}};
  },{activity});
  await page.goto(base+'/frontend/index.html');await page.locator('#catalog-manager').waitFor({state:'visible'});await page.waitForFunction(()=>document.getElementById('mode-title').textContent.includes('Laboratório QA'));await page.locator('#sample-button').click();await page.locator('#on-behalf-of').fill('QA-ALFA-01');await setStep(page,'deliver');assert.equal(await page.locator('#submit-server').isDisabled(),false);await page.locator('#submit-server').click();await page.locator('#retry-box').waitFor({state:'visible'});assert.equal(await page.locator('#receipt-panel').isVisible(),false,'A failed call must not create a receipt');await page.locator('#retry-request').click();await page.locator('#receipt-panel').waitFor({state:'visible'});assert.match(await page.locator('#notice').innerText(),/NO_OP/);
  const calls=await page.evaluate(()=>window.__adapter.calls.filter(c=>c.method==='submitActivity'));assert.equal(calls.length,2);assert.deepEqual(calls[0].arg,calls[1].arg,'Retry must preserve the exact request envelope');assert.equal(await page.evaluate(()=>Object.keys(window.__adapter.ledger).length),1);assert.equal(calls[0].arg.payload.on_behalf_of,'QA-ALFA-01');assert.equal(Object.hasOwn(calls[0].arg.payload,'role'),false);
  await page.locator('#review-submission').fill('QA-SUBMISSION-001');await page.locator('#review-load').click();await page.locator('#review-score-qa-evidence').waitFor({state:'visible'});assert.equal(await page.locator('#review-participant').inputValue(),'QA-ALFA-01');await page.locator('#review-score-qa-evidence').fill('8');await page.locator('#review-justification').fill('Revisão fictícia: origem da evidência identificada; aprofundar limites.');await page.locator('#review-submit').click();await page.waitForFunction(()=>document.getElementById('review-result').textContent.includes('Revisão registrada'));const review=await page.evaluate(()=>window.__adapter.calls.find(c=>c.method==='reviewSubmission').arg);assert.equal(review.payload.expected_revision,0);assert.equal(review.payload.participant_id,'QA-ALFA-01');assert.equal(review.payload.criteria_version,'FORM-1.0.0');assert.equal(review.payload.decision,'PROPOSTA');assert.equal(review.payload.scores[0].score,8);assert.equal(review.payload_hash,L.sha256Sync(L.canonical(review.payload)));
  await page.locator('#catalog-manager>summary').click();await page.locator('.catalog-creator>summary').click();const values={'new-activity-id':'AULA08-FORMATIVA','new-activity-title':'Nova versão fictícia','new-activity-version':'1.1.0','new-lesson-id':'AULA08','new-criteria-version':'FORM-1.1.0','new-change-reason':'QA sintética de versionamento'};for(const [id,value] of Object.entries(values))await page.locator('#'+id).fill(value);await page.locator('#catalog-create').click();await page.waitForFunction(()=>document.querySelectorAll('#activity option').length===2);await page.selectOption('#activity','AULA08-FORMATIVA@1.1.0');assert.equal(await page.locator('#submit-server').isDisabled(),true);await page.locator('#catalog-approval-ref').fill('QA-SYNTHETIC-APPROVAL-001');await page.locator('#approve-rubric').click();await page.waitForFunction(()=>document.getElementById('catalog-result').textContent.includes('APROVADA'));await page.locator('#activate-activity').click();await page.waitForFunction(()=>document.getElementById('catalog-selected').textContent.includes('ATIVA')&&!document.getElementById('submit-server').disabled);assert.equal(await page.locator('#submit-server').isDisabled(),false);const create=await page.evaluate(()=>window.__adapter.calls.find(c=>c.method==='saveActivityVersion').arg);assert.equal(create.payload.activity.kind,'FORMATIVA');assert.equal(create.payload.activity.official_max,null);assert.equal(create.payload.activity.activity_version,'1.1.0');assert.equal(create.payload.rubric.reduce((sum,c)=>sum+c.max_points,0),100);assert.equal(create.payload_hash,L.sha256Sync(L.canonical(create.payload)));await audit(page,name+'-teacher-mock');assert.deepEqual(errors,[]);record(name+'-adapter-mock',{scope:'LOCAL_BROWSER_MOCK',exact_retry:'PASS',teacher_review:'PASS',catalog_creation_and_activation:'PASS',real_google_writes:0,connected_qa:'NOT_RUN'});await context.close();
}
(async()=>{
  server.listen(0,'127.0.0.1');await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;
  try{for(const name of browsers){assert.ok(['chromium','firefox','webkit'].includes(name),'Unknown browser: '+name);const browser=await playwright[name].launch({headless:true});try{await checkOffline(browser,name,base);await checkAdapter(browser,name,base);}finally{await browser.close();}}fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({scope:'AUTHOR_BROWSER_TESTS_AND_LOCAL_ADAPTER_MOCKS',connected_qa:'NOT_RUN',results},null,2));process.stdout.write('Browser evidence: '+output+'\n');}
  catch(error){fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify({message:error.message,stack:error.stack,completed:results},null,2));throw error;}finally{server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
