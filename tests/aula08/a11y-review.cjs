'use strict';
// Focused recheck after semantic ARIA attributes change; no redundant geometry pass.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const pw=require('playwright');
const {FOLDER,EVIDENCE,startServer,reporter,axe}=require('./harness.cjs');
const {Content}=require('./fixtures.cjs');
const output=reporter('a11y-final-report.json');
output.report.scope='Focused delta: named groups, keyboard focus and 99 axe states after adding role=group to lesson progress, mission question navigation and catalog type controls. Existing geometry/function tests remain recorded separately.';
output.report.source_sha256['tests/aula08/a11y-review.cjs']=crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex');
const requested=(process.env.AULA08_BROWSERS||'chromium,firefox,webkit').split(',').filter(Boolean);
async function nav(page,id){await page.locator('#index-btn').click();await page.locator('#index-dialog [data-slide="'+id+'"]').click();await page.waitForFunction(id=>document.querySelector('#'+id)?.classList.contains('active'),id);}
(async()=>{
  const server=await startServer();const url='http://127.0.0.1:'+server.address().port+'/'+FOLDER+'/';
  try{
    for(const engine of requested){
      let browser;
      try{browser=await pw[engine].launch({headless:true,...(engine==='webkit'&&process.env.AULA08_WEBKIT_EXECUTABLE?{executablePath:process.env.AULA08_WEBKIT_EXECUTABLE}:{})});output.report.versions[engine]=browser.version();}
      catch(error){output.blocked(engine,error.message);continue;}
      const context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(7000);
      try{
        await page.goto(url);await page.waitForFunction(()=>Boolean(window.PPI_A08_APP));
        await output.check(engine,'NAMED-GROUPS-FOCUS','All three control families expose named groups and preserve keyboard focus',async()=>{
          const selectors=['.lesson-progress','.question-nav','.catalog-tabs'];const families=[];
          for(const selector of selectors){const groups=await page.locator(selector).evaluateAll(nodes=>nodes.map(node=>({role:node.getAttribute('role'),name:node.getAttribute('aria-label'),tabindex:node.getAttribute('tabindex')})));assert.ok(groups.length>0,selector);for(const group of groups){assert.equal(group.role,'group');assert.ok(group.name?.trim());assert.ok(group.tabindex===null||group.tabindex==='-1','Grouping containers should not add tab stops');}families.push({selector,count:groups.length,names:groups.map(g=>g.name)});}
          assert.equal(await page.getByRole('group',{name:'Progresso formativo',exact:true}).count(),1);
          await page.locator('#index-btn').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#index-dialog').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'index-btn');
          await nav(page,Content.missions[0].slideId);const navGroup=page.getByRole('group',{name:'Questões da missão 1',exact:true});assert.equal(await navGroup.isVisible(),true);const step=navGroup.locator('button').first();await step.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement?.matches('[data-mission="m1"] .prompt'),null,{timeout:2000});for(const selector of ['.question-next','.question-prev','.reset-mission']){await page.locator('[data-mission="m1"] '+selector).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement?.matches('[data-mission="m1"] .prompt'),null,{timeout:2000});};
          await nav(page,Content.slides.find(s=>s.kind==='catalog').id);const types=page.getByRole('group',{name:'Tipos de requisito do catálogo',exact:true});assert.equal(await types.isVisible(),true);await types.getByRole('button',{name:'RNF',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement?.matches('[data-catalog-tab="RNF"]'),null,{timeout:2000});assert.equal(await page.locator('[data-catalog-kind="RNF"]').isVisible(),true);return{families,keyboardActivated:true,questionNavigationFocusChecked:4,dialogFocusReturned:true};
        });
        await output.check(engine,'AXE-FINAL','33 states have no WCAG violations or unresolved prohibited ARIA naming',async()=>{
          const reports=[];await page.locator('#track-select').selectOption('memorias');for(const slide of Content.slides){await nav(page,slide.id);reports.push({track:'memorias',slide:slide.id,...await axe(page)});}await page.locator('#track-select').selectOption('permanencia');for(const mission of Content.missions){await nav(page,mission.slideId);reports.push({track:'permanencia',slide:mission.slideId,...await axe(page)});}await page.locator('#index-btn').click();reports.push({state:'index-dialog',...await axe(page)});await page.keyboard.press('Escape');
          fs.writeFileSync(path.join(EVIDENCE,engine+'-axe-final.json'),JSON.stringify(reports,null,2)+'\n');
          assert.equal(reports.length,33);assert.deepEqual(reports.flatMap(r=>r.violations.map(v=>({state:r.slide||r.state,...v}))),[]);assert.deepEqual(reports.flatMap(r=>r.incomplete.filter(v=>v.id==='aria-prohibited-attr').map(v=>({state:r.slide||r.state,...v}))),[],'aria-prohibited-attr requires correction even when returned under incomplete');
          const incompleteRules={};for(const r of reports)for(const v of r.incomplete){incompleteRules[v.id]??={states:0,nodes:0};incompleteRules[v.id].states++;incompleteRules[v.id].nodes+=v.nodes.length;}return{auditedStates:33,violations:0,prohibitedARIAInconclusive:0,incompleteRules,manualReviewStillRequired:Object.keys(incompleteRules)};
        });
      }finally{await context.close();await browser.close();}
    }
  }finally{server.close();const result=output.finish();process.stdout.write(JSON.stringify(result.counts)+'\n');if(result.status!=='PASS')process.exitCode=1;}
})().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
