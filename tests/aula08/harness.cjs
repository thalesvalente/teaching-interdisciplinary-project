'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '../..');
const FOLDER = 'lessons/aula-08-da-evidencia-ao-requisito';
const EVIDENCE = process.env.AULA08_EVIDENCE_DIR || path.join(ROOT, 'tmp/aula08-qa');
fs.mkdirSync(EVIDENCE, {recursive:true});
const moduleFile = name => path.join(ROOT,FOLDER,name);
function startServer() {
  return new Promise((resolve,reject)=>{
    const server=http.createServer((request,response)=>{
      let target;
      try {
        const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
        target=path.resolve(ROOT,'.'+pathname);
        if (target!==ROOT && !target.startsWith(ROOT+path.sep)) return response.writeHead(403).end();
        if (fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
      } catch { return response.writeHead(404).end(); }
      fs.readFile(target,(error,data)=>{
        if(error) return response.writeHead(404).end();
        const type={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'}[path.extname(target)]||'application/octet-stream';
        response.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(data);
      });
    });
    server.once('error',reject); server.listen(0,'127.0.0.1',()=>resolve(server));
  });
}
function reporter(filename='browser-report.json') {
  const sourceFiles=['index.html','package.json','package-lock.json','contracts/ppi-aula08-v1.schema.json',...['index.html','aula.css','aula.js','content.js','model.js'].map(n=>FOLDER+'/'+n),...['browser.cjs','harness.cjs','unit.test.cjs','fixtures.cjs'].map(n=>'tests/aula08/'+n)];
  const source_sha256=Object.fromEntries(sourceFiles.map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,name))).digest('hex')]));
  const report={source_sha256,started_at:new Date().toISOString(),versions:{},results:[],scope:'Automated behavior and detectable WCAG 2.2 AA criteria; not a complete human accessibility audit.'};
  const file=path.join(EVIDENCE,filename);
  const save=()=>fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
  return {report,save,async check(browser,id,label,operation){
    const started=Date.now();
    try { const evidence=await operation(); report.results.push({browser,id,label,status:'PASS',duration_ms:Date.now()-started,evidence}); process.stdout.write(`PASS ${browser} ${id}\n`); }
    catch(error){report.results.push({browser,id,label,status:'FAIL',duration_ms:Date.now()-started,error:error.stack||String(error)}); process.stdout.write(`FAIL ${browser} ${id}: ${error.message}\n`);}
    save();
  },blocked(browser,message){report.results.push({browser,id:'BROWSER-LAUNCH',status:'BLOCKED',error:message});save();process.stdout.write(`BLOCKED ${browser}: ${message}\n`);},finish(){report.completed_at=new Date().toISOString();report.counts=report.results.reduce((c,r)=>(c[r.status]=(c[r.status]||0)+1,c),{});report.status=report.results.length&&report.results.every(r=>r.status==='PASS')?'PASS':'FAIL';save();return report;}};
}
async function noOverflow(page,checkSlide=true){
  const result=await page.evaluate(checkSlide=>{
    const root=document.documentElement;
    const active=document.querySelector('.slide.active');
    const reading=document.body.classList.contains('reading')||document.documentElement.classList.contains('reading');
    const bounds=active?.getBoundingClientRect();
    const bad=[];
    const clipped=active?[...active.querySelectorAll('p,h1,h2,h3,legend,button,li')].filter(el=>{const css=getComputedStyle(el);return el.getClientRects().length&&el.clientWidth>0&&!el.closest('[hidden]')&&((['hidden','clip'].includes(css.overflowX)&&el.scrollWidth>el.clientWidth+2)||(['hidden','clip'].includes(css.overflowY)&&el.scrollHeight>el.clientHeight+2));}).map(el=>({tag:el.tagName,cls:String(el.className),text:el.textContent.slice(0,70),scroll:[el.scrollWidth,el.scrollHeight],client:[el.clientWidth,el.clientHeight]})):[];
    if(checkSlide&&!reading&&bounds){
      for(const el of active.querySelectorAll('*')) {
        const css=getComputedStyle(el), rect=el.getBoundingClientRect();
        if(!rect.width||!rect.height||css.visibility==='hidden'||css.display==='none'||el.closest('[hidden]'))continue;
        if(rect.left<bounds.left-2||rect.right>bounds.right+2||rect.top<bounds.top-2||rect.bottom>bounds.bottom+2)bad.push({tag:el.tagName,cls:String(el.className),text:(el.textContent||'').slice(0,80),bounds:{left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom}});
      }
    }
    return {viewport:{width:innerWidth,height:innerHeight},documentWidth:root.scrollWidth,reading,active:active?.id,slide:bounds?{left:bounds.left,top:bounds.top,right:bounds.right,bottom:bounds.bottom,width:bounds.width,height:bounds.height}:null,outside:bad.slice(0,15),clipped:clipped.slice(0,15)};
  },checkSlide);
  assert.deepEqual(result.clipped,[],`Clipped text at ${result.active}`);
  assert.ok(result.documentWidth<=result.viewport.width+1,`Horizontal overflow: ${JSON.stringify(result)}`);
  if(checkSlide&&!result.reading){
    assert.ok(result.slide, 'Active slide required');
    assert.ok(result.slide.left>=-2&&result.slide.right<=result.viewport.width+2&&result.slide.top>=-2&&result.slide.bottom<=result.viewport.height+2,`Canvas outside viewport: ${JSON.stringify(result)}`);
    assert.deepEqual(result.outside,[],`Content outside slide ${result.active}`);
  }
  return result;
}
async function axe(page){
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  return page.evaluate(async()=>{
    const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
    return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,checks:[...n.any,...n.all,...n.none].map(c=>({id:c.id,message:c.message,data:c.data}))}))})),passes:result.passes.length};
  });
}
async function download(page,click,name){const event=page.waitForEvent('download');await click();const item=await event;const file=path.join(EVIDENCE,name);await item.saveAs(file);assert.equal(await item.failure(),null);return {file,name:item.suggestedFilename()};}
module.exports={ROOT,FOLDER,EVIDENCE,moduleFile,startServer,reporter,noOverflow,axe,download};
