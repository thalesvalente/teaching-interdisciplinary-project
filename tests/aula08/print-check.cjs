'use strict';
// Focused print regression, useful when only @media print changes after the full browser suite.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const pw=require('playwright');
const {ROOT,FOLDER,EVIDENCE,moduleFile,startServer,reporter}=require('./harness.cjs');
const {Content,Model,withCatalog}=require('./fixtures.cjs');
const output=reporter('print-final-report.json');
output.report.source_sha256['tests/aula08/print-check.cjs']=crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex');
const requested=(process.env.AULA08_BROWSERS||'chromium,firefox,webkit').split(',').filter(Boolean);
(async()=>{
  const server=await startServer();const url='http://127.0.0.1:'+server.address().port+'/'+FOLDER+'/';
  try{
    for(const engine of requested){
      let browser;
      try{browser=await pw[engine].launch({headless:true,...(engine==='webkit'&&process.env.AULA08_WEBKIT_EXECUTABLE?{executablePath:process.env.AULA08_WEBKIT_EXECUTABLE}:{})});output.report.versions[engine]=browser.version();}
      catch(error){output.blocked(engine,error.message);continue;}
      await output.check(engine,'PRINT-FINAL','Current CSS prints complete and long synthetic drafts without state changes',async()=>{
        const details=[];
        for(const variant of ['filled','long']){
          const data=withCatalog('memorias');
          if(variant==='long')for(const type of ['RF','RNF','RD'])for(const field of ['text','source','criterion'])Model.setCatalog(data,type,field,(type+' '+field+' — Texto sintético de teste de impressão. ').repeat(100).slice(0,1900));
          const context=await browser.newContext({viewport:{width:1280,height:720},timezoneId:'America/Fortaleza'});
          await context.addInitScript(({key,data})=>localStorage.setItem(key,JSON.stringify(data)),{key:Model.STORAGE_KEY,data});
          const page=await context.newPage();try{
            await page.goto(url);await page.waitForFunction(()=>Boolean(window.PPI_A08_APP));await page.locator('#index-btn').click();await page.locator('#index-dialog [data-slide="'+Content.slides.find(s=>s.kind==='catalog').id+'"]').click();
            const before=await page.evaluate(()=>JSON.stringify(window.PPI_A08_APP.getState()));await page.evaluate(()=>{window.__printCount=0;window.print=()=>window.__printCount++;});await page.locator('#print-btn').click();assert.equal(await page.evaluate(()=>window.__printCount),1);
            await page.emulateMedia({media:'print'});assert.equal(await page.locator('#print-summary').isVisible(),true);assert.equal(await page.locator('.toolbar').isVisible(),false);assert.equal(await page.locator('#deck').isVisible(),false);
            const text=await page.locator('#print-summary').textContent();for(const type of ['RF','RNF','RD'])for(const field of ['text','source','criterion'])assert.ok(text.includes(data.tracks.memorias.catalog[type][field].trim()),variant+': '+type+'.'+field+' omitted from print');assert.match(text,/nota oficial/i);assert.match(text,/pendente/i);assert.equal(await page.locator('#print-summary').locator('input,textarea,select,button').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).length),0);
            const pdf=engine==='chromium'?'aula08-final-'+variant+'.pdf':null;if(pdf)await page.pdf({path:path.join(EVIDENCE,pdf),format:'A4',printBackground:true,preferCSSPageSize:true});assert.equal(await page.evaluate(()=>JSON.stringify(window.PPI_A08_APP.getState())),before);
            details.push({variant,characters:text.length,fieldsRetained:9,pdf,stateUnchanged:true});
          }finally{await context.close();}
        }
        return details;
      });
      await browser.close();
    }
  }finally{server.close();const result=output.finish();process.stdout.write(JSON.stringify(result.counts)+'\n');if(result.status!=='PASS')process.exitCode=1;}
})().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
