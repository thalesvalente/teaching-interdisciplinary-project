'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const pw=require('playwright');
const Ajv2020=require('ajv/dist/2020');
const addFormats=require('ajv-formats');
const {ROOT,FOLDER,EVIDENCE,moduleFile,startServer,reporter,noOverflow,axe,download}=require('./harness.cjs');
const {Content,Model}=require('./fixtures.cjs');
const requested=(process.env.AULA08_BROWSERS||'chromium,firefox,webkit').split(',').map(s=>s.trim()).filter(Boolean);
const output=reporter();
const ajv=new Ajv2020({allErrors:true,strict:true});addFormats(ajv);const validate=ajv.compile(JSON.parse(fs.readFileSync(path.join(ROOT,'contracts/ppi-aula08-v1.schema.json'),'utf8')));
const viewports=[[1280,720],[1280,650],[390,844],[320,568]];
const safeName=s=>s.replace(/[^a-zA-Z0-9-]/g,'-');
async function ready(page){await page.waitForFunction(()=>Boolean(window.PPI_A08_APP&&window.PPI_A08_CONTENT));await page.waitForSelector('#deck .slide.active');}
async function state(page){return page.evaluate(()=>window.PPI_A08_APP.getState());}
async function assertXP(page,xp){await page.waitForFunction(xp=>window.PPI_A08_APP.score().xp===xp,xp);assert.match(await page.locator('#xp-total').innerText(),new RegExp('(^|\\D)'+xp+'(\\D|$)'));}
async function nav(page,id){
  if(await page.locator('#index-dialog').isVisible())await page.keyboard.press('Escape');
  await page.locator('#index-btn').click();await page.locator('#index-dialog [data-slide="'+id+'"]').click();
  await page.waitForFunction(id=>document.querySelector('#'+id)?.classList.contains('active'),id);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function firstQuestion(shell){for(let n=0;n<20;n++){const prev=shell.locator('.question-prev');if(!await prev.count()||!await prev.isEnabled())return;await prev.click();}throw Error('Question stepper did not reach its first question');}
async function answerMission(page,track,mission,{wrongFirst=false}={}){
  await nav(page,mission.slideId);const shell=page.locator('[data-mission="'+mission.id+'"]');await firstQuestion(shell);
  const questions=Content.tracks[track].missions[mission.id].questions;
  for(let i=0;i<questions.length;i++){
    const q=questions[i];const field=shell.locator('[data-question="'+q.id+'"]');assert.equal(await field.isVisible(),true,q.id);
    if(wrongFirst&&i===0){const incorrect=q.options.find(o=>o.id!==q.correct);await field.locator('[data-option="'+incorrect.id+'"]').click();const feedback=await shell.locator('.feedback').innerText();assert.ok(feedback.includes(incorrect.feedback),'Wrong choice must explain this specific error');}
    await field.locator('[data-option="'+q.correct+'"]').click();const feedback=await shell.locator('.feedback').innerText();assert.ok(feedback.includes(q.explanation)||feedback.includes(q.options.find(o=>o.id===q.correct).feedback),'Correct choice must explain the answer');
    assert.equal(await field.locator('[data-option="'+q.correct+'"]').getAttribute('aria-pressed'),'true');
    if(i<questions.length-1)await shell.locator('.question-next').click();
  }
  assert.match(await shell.locator('.mission-state').innerText(),/conclu[ií]d/i);
  return {questions:questions.length,xp:mission.xp};
}
async function keyboardReach(page,selector,limit=70){for(let i=0;i<limit;i++){if(await page.evaluate(selector=>document.activeElement?.matches(selector),selector))return i;await page.keyboard.press('Tab');}throw Error('Keyboard cannot reach '+selector);}
async function fillCatalog(page,track){
  const slide=Content.slides.find(s=>s.kind==='catalog');await nav(page,slide.id);let count=0;
  for(const type of ['RF','RNF','RD']){
    const panel=page.locator('[data-catalog-kind="'+type+'"]');
    if(!await panel.isVisible()){
      const button=page.locator('[data-catalog-tab="'+type+'"]');if(await button.count())await button.click();
      else await page.getByRole('button',{name:new RegExp('^'+type+'(?:\\s|$)')}).first().click();
    }
    const example=Content.tracks[track].catalogExamples[type];
    for(const field of ['text','source','sourceStatus','criterion','priority']){
      if(example[field]===undefined)continue;
      const input=panel.locator('[data-field="'+field+'"]');
      if(await input.evaluate(el=>el.tagName==='SELECT'))await input.selectOption(String(example[field]));else await input.fill(String(example[field]));count++;
    }
  }
  return count;
}
async function printCheck(page,engine,label){
  const before=JSON.stringify(await state(page));await page.evaluate(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls++;};});
  await page.locator('#print-btn').click();assert.equal(await page.evaluate(()=>window.__printCalls),1);
  const summary=page.locator('#print-summary');const text=await summary.textContent();assert.match(text,/nota oficial/i);assert.match(text,/RF/);assert.match(text,/RNF/);assert.match(text,/dados/i);
  await page.emulateMedia({media:'print'});assert.equal(await summary.isVisible(),true);assert.equal(await page.locator('.toolbar').isVisible(),false);assert.equal(await page.locator('#deck').isVisible(),false);
  assert.equal(await summary.locator('button,input,select,textarea').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).length),0);
  if(engine==='chromium')await page.pdf({path:path.join(EVIDENCE,'aula08-'+label+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
  await page.emulateMedia({media:'screen'});assert.equal(JSON.stringify(await state(page)),before,'Printing must not mutate the learning draft');return {nativePrintCalled:true,pdf:engine==='chromium',characters:text.length};
}

(async()=>{
  const server=await startServer();const origin='http://127.0.0.1:'+server.address().port;const url=origin+'/'+FOLDER+'/';
  try{
    for(const engine of requested){
      let browser;try{assert.ok(pw[engine],'Unknown requested browser');browser=await pw[engine].launch({headless:true,...(engine==='webkit'&&process.env.AULA08_WEBKIT_EXECUTABLE?{executablePath:process.env.AULA08_WEBKIT_EXECUTABLE}:{})});output.report.versions[engine]=browser.version();}catch(error){output.blocked(engine,error.message);continue;}
      const context=await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:720},reducedMotion:'reduce',timezoneId:'America/Fortaleza'});
      const page=await context.newPage();page.setDefaultTimeout(7000);const errors=[],requests=[];page.on('pageerror',error=>errors.push(error.message));page.on('request',r=>requests.push({url:r.url(),method:r.method()}));page.on('dialog',dialog=>dialog.accept());
      async function check(id,label,operation){await output.check(engine,id,label,operation);if(output.report.results.at(-1).status!=='PASS'){try{await context.setOffline(false);await page.emulateMedia({media:'screen',forcedColors:'none'});await page.goto(url);await ready(page);}catch{}}}
      await check('BOOT','26 semantic slides, two tracks and zero formative XP without identity',async()=>{
        await page.goto(url);await ready(page);assert.equal(await page.locator('#deck .slide').count(),26);await assertXP(page,0);
        assert.equal(await page.locator('#track-select option').count(),2);assert.match(await page.locator('body').innerText(),/não é nota oficial/i);assert.match(await page.locator('body').innerText(),/sint[eé]tic/i);
        const identity=await page.locator('input,textarea').evaluateAll(nodes=>nodes.filter(n=>/matr[ií]cula|nome do aluno|student_name/i.test(n.name+' '+n.id+' '+(n.labels?.[0]?.textContent||''))).map(n=>n.id));assert.deepEqual(identity,[]);
        return{slides:26,tracks:2,xp:0,identityFields:0};
      });
      await check('DOSSIE','Progressive D0-D11 dossier is visible, cumulative and track-isolated',async()=>{
        const summaries=[];
        for(const track of ['memorias','permanencia']){
          const prefix=track==='memorias'?'M':'P';
          await page.locator('#track-select').selectOption(track);
          await nav(page,'s03');
          assert.match(await page.locator('#s03 .kicker').innerText(),/Dossiê D0/);
          await page.locator('#notes-btn').click();
          assert.match(await page.locator('#notes-content').innerText(),new RegExp('EV-'+prefix+'01'));
          assert.equal(await page.locator('#notes-content .dossier-history li').count(),1);
          await page.keyboard.press('Escape');
          await nav(page,'s21');
          assert.match(await page.locator('#s21 .kicker').innerText(),/Dossiê D9/);
          await page.locator('#notes-btn').click();
          const history=page.locator('#notes-content .dossier-history');
          assert.equal(await history.locator('li').count(),10);
          assert.match(await history.innerText(),new RegExp('RF-'+prefix+'01'));
          assert.match(await history.innerText(),new RegExp('CA-'+prefix+'01'));
          await page.keyboard.press('Escape');
          summaries.push({track,stagesShown:10,source:'EV-'+prefix+'01'});
        }
        await page.locator('#track-select').selectOption('memorias');
        return {summaries};
      });
      for(const track of ['memorias','permanencia'])await check('MISSIONS-'+track,'All six missions through visible controls, error feedback and retry: '+track,async()=>{
        await page.locator('#track-select').selectOption(track);await assertXP(page,0);const details=[];let sum=0;
        for(const m of Content.missions){details.push(await answerMission(page,track,m,{wrongFirst:m.id==='m1'}));sum+=m.xp;await assertXP(page,sum);}
        const current=await state(page);assert.equal(Model.score(current,track).xp,100);return{track,missions:details,xp:100};
      });
      await check('RESET-ISOLATION','Reset one mission, preserve other missions and isolate tracks',async()=>{
        await page.locator('#track-select').selectOption('memorias');await assertXP(page,100);await nav(page,Content.missions[0].slideId);await page.locator('[data-mission="m1"] .reset-mission').click();await assertXP(page,90);assert.equal(Object.keys((await state(page)).tracks.memorias.answers).length,13);
        await page.locator('#track-select').selectOption('permanencia');await assertXP(page,100);await page.locator('#track-select').selectOption('memorias');await assertXP(page,90);await answerMission(page,'memorias',Content.missions[0]);await assertXP(page,100);return{resetXP:90,otherTrackXP:100,restoredXP:100};
      });
      await check('PERSISTENCE','Immediate reload restores answers and recalculates XP from their choices',async()=>{
        const before=await state(page);await page.reload();await ready(page);assert.deepEqual(await state(page),before);await assertXP(page,100);return{roundTrip:true};
      });
      await check('CATALOG-EXPORT','Catalog editing, explicit JSON export, valid contract and separate grading domains',async()=>{
        const count=await fillCatalog(page,'memorias');await assertXP(page,100);const file=await download(page,()=>page.locator('#export-json').click(),engine+'-memorias.json');const data=JSON.parse(fs.readFileSync(file.file,'utf8'));assert.equal(validate(data),true,JSON.stringify(validate.errors));assert.equal(data.track_id,'memorias');assert.equal(data.xp_formativo,100);assert.equal(data.teacher_assessment.status,'pending');assert.equal(data.official_grade.status,'not_applicable');assert.equal(data.official_grade.value,null);for(const type of ['RF','RNF','RD'])assert.ok((await state(page)).tracks.memorias.catalog[type].text.length>0);
        await page.locator('#track-select').selectOption('permanencia');assert.equal((await state(page)).tracks.permanencia.catalog.RF.text,'');await fillCatalog(page,'permanencia');const other=await download(page,()=>page.locator('#export-json').click(),engine+'-permanencia.json');assert.equal(validate(JSON.parse(fs.readFileSync(other.file,'utf8'))),true);await page.locator('#track-select').selectOption('memorias');return{fieldsFilled:count,contractValid:true,officialGrade:null};
      });
      await check('PRINT','Printable local synthesis retains catalog text and does not change state',async()=>{await nav(page,Content.slides.find(s=>s.kind==='catalog').id);return printCheck(page,engine,'filled');});
      await check('LAYOUT','Every slide fits projector, short window and mobile at 390/320 CSS pixels',async()=>{
        const geometries=[];for(const [width,height]of viewports){await page.setViewportSize({width,height});if(width>900&&await page.locator('#mode-btn').getAttribute('aria-pressed')==='true')await page.locator('#mode-btn').click();for(const track of ['memorias','permanencia']){await page.locator('#track-select').selectOption(track);for(const slide of Content.slides){await nav(page,slide.id);geometries.push({track,...await noOverflow(page)});if(engine==='chromium'&&width===1280&&height===720)await page.screenshot({path:path.join(EVIDENCE,`${track}-${slide.id}-1280x720.png`)});}
          if(engine==='chromium'&&track==='memorias'){await nav(page,Content.missions[2].slideId);await page.screenshot({path:path.join(EVIDENCE,`${engine}-${width}x${height}-mission3.png`),fullPage:false});}}
        }fs.writeFileSync(path.join(EVIDENCE,engine+'-geometry.json'),JSON.stringify(geometries,null,2));await page.setViewportSize({width:1280,height:720});return{states:geometries.length,viewports,horizontalOverflow:0,contentOutsideCanvas:0};
      });
      await check('A11Y','Automatable WCAG 2.2 AA checks on all slides and the two mission contexts',async()=>{
        const reports=[];await page.locator('#track-select').selectOption('memorias');for(const slide of Content.slides){await nav(page,slide.id);reports.push({track:'memorias',slide:slide.id,...await axe(page)});}await page.locator('#track-select').selectOption('permanencia');for(const mission of Content.missions){await nav(page,mission.slideId);reports.push({track:'permanencia',slide:mission.slideId,...await axe(page)});}
        await page.locator('#index-btn').click();reports.push({state:'index-dialog',...await axe(page)});await page.keyboard.press('Escape');
        fs.writeFileSync(path.join(EVIDENCE,engine+'-axe.json'),JSON.stringify(reports,null,2));assert.deepEqual(reports.flatMap(r=>r.violations.map(v=>({state:r.slide||r.state,...v}))),[]);assert.deepEqual(reports.flatMap(r=>r.incomplete.filter(v=>v.id==='aria-prohibited-attr').map(v=>({state:r.slide||r.state,...v}))),[],'ARIA names on generic elements require a supported semantic role');return{auditedStates:reports.length,violations:0,prohibitedARIAInconclusive:0,incompleteChecks:reports.reduce((sum,r)=>sum+r.incomplete.length,0)};
      });
      await check('KEYBOARD','Keyboard navigation, focused slide titles, option selection and dialog focus return',async()=>{
        await nav(page,'s01');await page.locator('#index-btn').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#index-dialog').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'index-btn');
        await page.locator('#next-btn').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#s02').getAttribute('class').then(s=>s.includes('active')),true);
        await nav(page,Content.missions[0].slideId);const shell=page.locator('[data-mission="m1"]');await firstQuestion(shell);await shell.locator('.question-step').first().focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement?.matches('[data-mission="m1"] .prompt'),null,{timeout:2000});const q=Content.tracks.permanencia.missions.m1.questions[0];const option=shell.locator('[data-option="'+q.correct+'"]');await option.focus();await page.keyboard.press('Enter');assert.equal(await option.getAttribute('aria-pressed'),'true');const focus=await option.evaluate(el=>({outline:getComputedStyle(el).outlineStyle,outlineWidth:parseFloat(getComputedStyle(el).outlineWidth)}));assert.notEqual(focus.outline,'none');assert.ok(focus.outlineWidth>=2);
        await page.locator('#index-btn').focus();await keyboardReach(page,'#mode-btn',25);return{optionActivatedByKeyboard:true,dialogReturnedFocus:true,focusOutline:focus};
      });
      await check('DISPLAY-PREFERENCES','Reading mode, high contrast and reduced motion preserve access',async()=>{
        await page.setViewportSize({width:1280,height:720});const before=await page.locator('#mode-btn').getAttribute('aria-pressed');await page.locator('#mode-btn').click();assert.notEqual(await page.locator('#mode-btn').getAttribute('aria-pressed'),before);await noOverflow(page,false);await page.locator('#mode-btn').click();
        await page.locator('#contrast-btn').click();assert.equal(await page.locator('#contrast-btn').getAttribute('aria-pressed'),'true');await noOverflow(page);const result=await axe(page);assert.deepEqual(result.violations,[]);await page.locator('#contrast-btn').click();assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);await page.emulateMedia({forcedColors:'active'});await noOverflow(page);await page.emulateMedia({forcedColors:'none'});return{contrastViolations:0,reducedMotion:true,forcedColorsUsable:true};
      });
      await check('SAFE-TEXT','A draft containing HTML-like text stays text in UI, export and print',async()=>{
        await nav(page,Content.slides.find(s=>s.kind==='catalog').id);const panel=page.locator('[data-catalog-kind="RF"]');if(!await panel.isVisible()){const tab=page.locator('[data-catalog-tab="RF"]');if(await tab.count())await tab.click();else await page.getByRole('button',{name:/^RF(?:\s|$)/}).first().click();}const payload='<img src=x onerror="window.__a08Injected=true">';await panel.locator('[data-field="text"]').fill(payload);assert.equal(await page.evaluate(()=>window.__a08Injected),undefined);const exported=await page.evaluate(()=>window.PPI_A08_APP.exportData());assert.ok(JSON.stringify(exported).includes('<img'));await printCheck(page,engine,'partial-safe-text');assert.equal(await page.locator('#print-summary img').count(),0);assert.equal(await page.evaluate(()=>window.__a08Injected),undefined);return{textPreserved:true,executed:false};
      });
      await check('NETWORK','Loaded lesson uses only local resources and works after network removal',async()=>{
        await context.setOffline(true);await nav(page,'s01');await nav(page,Content.missions[0].slideId);await page.locator('[data-mission="m1"] .reset-mission').click();await answerMission(page,'permanencia',Content.missions[0]);await context.setOffline(false);assert.deepEqual(requests.filter(r=>/^https?:/.test(r.url)&&!r.url.startsWith(origin+'/')),[]);assert.deepEqual(requests.filter(r=>r.method!=='GET'),[]);return{requests:requests.length,externalRequests:0,nonGET:0};
      });
      await check('FILE-OFFLINE','Downloaded lesson runs from file:// with network disabled or HTTP(S) blocked',async()=>{
        const local=await browser.newContext({offline:engine!=='webkit',viewport:{width:1280,height:720},acceptDownloads:true});await local.route(/^https?:\/\//,route=>route.abort());const p=await local.newPage();const localErrors=[],remote=[];p.on('pageerror',e=>localErrors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});p.on('dialog',d=>d.accept());try{await p.goto(pathToFileURL(moduleFile('index.html')).href);await ready(p);await answerMission(p,'memorias',Content.missions[0]);await assertXP(p,10);assert.deepEqual(remote,[]);assert.deepEqual(localErrors,[]);return{fileProtocol:true,playwrightOfflineMode:engine!=='webkit',httpRequestsBlocked:true,networkMode:engine==='webkit'?'HTTP(S) routes aborted; WebKit offline emulation blocks even a minimal file document':'Playwright offline emulation plus HTTP(S) routes aborted',xp:10,remoteRequests:0};}finally{await local.close();}
      });
      await check('STORAGE-FAILURE','Unavailable localStorage keeps the session usable and announces unsaved state',async()=>{
        const limited=await browser.newContext({viewport:{width:1280,height:720}});await limited.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota reached for test','QuotaExceededError');};});const p=await limited.newPage();p.on('dialog',d=>d.accept());try{await p.goto(url);await ready(p);await answerMission(p,'memorias',Content.missions[0]);await assertXP(p,10);assert.match(await p.locator('#storage-status').innerText(),/mem[oó]ria|salv|armazen|rascunho|baix/i);return{usable:true,xp:10,status:await p.locator('#storage-status').innerText()};}finally{await limited.close();}
      });
      await check('STORAGE-CORRUPT','Corrupted local draft does not crash or get silently replaced',async()=>{
        const key=await page.evaluate(()=>Object.keys(localStorage).find(key=>key.includes('aula08')&&!key.endsWith('-ui')));assert.ok(key,'Lesson storage key should be observable');const isolated=await browser.newContext({viewport:{width:1280,height:720}});await isolated.addInitScript(key=>{localStorage.setItem(key,'{broken stored JSON');},key);const p=await isolated.newPage();try{await p.goto(url);await ready(p);await assertXP(p,0);assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),'{broken stored JSON');assert.match(await p.locator('#storage-status').innerText(),/inv[aá]lid|corromp|preserv|recuper|rascunho/i);return{originalBytesPreserved:true,xp:0};}finally{await isolated.close();}
      });
      await check('ERRORS','No unhandled JavaScript errors in the executed flow',async()=>{assert.deepEqual(errors,[]);return{unhandledErrors:0};});
      await context.close();await browser.close();
    }
  }finally{server.close();const result=output.finish();process.stdout.write(JSON.stringify(result.counts)+'\n');if(result.status!=='PASS')process.exitCode=1;}
})().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
