/* Integração da Aula 06: fluxo real no navegador, acessibilidade e exportação.
 * Execução: npm install; npx playwright install chromium firefox; npm run test:aula06
 * Evidências temporárias: AULA06_EVIDENCE_DIR (padrão: tmp/aula06-qa).
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const pw = require('playwright');
const axePath = require.resolve('axe-core/axe.min.js');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(process.env.AULA06_EVIDENCE_DIR || path.join(root, 'tmp/aula06-qa'));
fs.mkdirSync(evidence, {recursive: true});
const folder = '/lessons/aula-06-etica-protecao-dados/';
const reports = [], versions = {};
let failures = 0;
async function check(browser, name, work) {
  try { const detail = await work(); reports.push({browser, name, status: 'PASS', ...(detail ? {detail} : {})}); }
  catch (error) { failures++; reports.push({browser, name, status: 'FAIL', error: error.stack}); console.log('FAIL', browser, name, error.message); }
  fs.writeFileSync(path.join(evidence, 'qa-checkpoint.json'), JSON.stringify({versions, reports}, null, 2));
}
async function score(page, lesson = false) { return page.evaluate(kind => kind ? window.ppiAula06Lesson.documentModel().scoring : window.ppiAula06.scoring(), lesson); }
async function axe(page) {
  await page.addScriptTag({path: axePath});
  return page.evaluate(async () => (await window.axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v => ({id:v.id, impact:v.impact, description:v.description, nodes:v.nodes.map(n=>({target:n.target, summary:n.failureSummary}))})));
}
async function noOverflow(page) {
  const result = await page.evaluate(() => ({viewport:innerWidth, document:document.documentElement.scrollWidth, body:document.body.scrollWidth}));
  assert.ok(result.document <= result.viewport + 1, JSON.stringify(result)); return result;
}
async function saveDownload(page, trigger, name) {
  const [download] = await Promise.all([page.waitForEvent('download', {timeout:10000}), trigger()]);
  const file = path.join(evidence,name); await download.saveAs(file); assert.equal(await download.failure(), null); return file;
}
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (name.split('/').some(p=>p.startsWith('.'))) {res.writeHead(403).end(); return;}
  const resolved = path.resolve(root, '.'+name);
  if (!resolved.startsWith(root+path.sep) && resolved!==root) {res.writeHead(403).end();return;}
  let file=resolved; try {if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');}catch{res.writeHead(404).end();return;}
  const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.pdf':'application/pdf','.md':'text/plain; charset=utf-8'};
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+folder;
  for(const engine of (process.env.AULA06_BROWSERS||'chromium,firefox').split(',')) {
    let browser;
    try {browser=await pw[engine].launch({headless:true}); versions[engine]=browser.version();}
    catch(error) {reports.push({browser:engine,name:'Disponibilidade do motor',status:'BLOCKED',error:error.message});failures++;continue;}
    const context=await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:720},reducedMotion:'reduce'});
    const page=await context.newPage();page.setDefaultTimeout(6000);
    const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
    const externalRequests=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:')&&!r.url().startsWith('file:')&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:'))externalRequests.push(r.url());});
    for(const file of ['index.html','Ficha_Equipe_Aula_06_PPI.html','exemplo-preenchido.html']) {
      await check(engine,'Reflow '+file,async()=>{
        const results=[];
        for(const [width,height] of [[320,568],[360,800],[390,844],[768,1024],[1024,768],[1280,720],[1440,900],[1920,1080],[844,390]]) {
          await page.setViewportSize({width,height});await page.goto(base+file);
          if(file.includes('Ficha_'))await page.waitForFunction(()=>window.ppiAula06);
          if(file==='index.html')await page.waitForFunction(()=>window.ppiAula06Lesson);
          results.push({width,height,...await noOverflow(page)});
          if(engine==='chromium'&&[390,1280].includes(width))await page.screenshot({path:path.join(evidence,engine+'-'+file.replace('.html','')+'-'+width+'.png'),fullPage:false});
        }
        return results;
      });
      await check(engine,'WCAG automatizável '+file,async()=>{
        await page.setViewportSize({width:390,height:844});await page.goto(base+file);const violations=await axe(page);assert.deepEqual(violations,[]);return {violations:0,viewport:390};
      });
      await check(engine,'Texto200 e espaçamento '+file,async()=>{
        await page.setViewportSize({width:640,height:480});await page.goto(base+file);
        await page.addStyleTag({content:'*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}html{font-size:200%!important}'});
        const spacing=await noOverflow(page);
        // Amplia também fontes declaradas em px, que html{font-size:200%} não altera.
        await page.setViewportSize({width:1280,height:720});await page.goto(base+file);
        const changedFonts=await page.evaluate(()=>{
          const sizes=[...document.querySelectorAll('body *')].filter(n=>!['SCRIPT','STYLE','BR'].includes(n.tagName)).map(n=>[n,parseFloat(getComputedStyle(n).fontSize)]);
          for(const [node,size]of sizes)node.style.setProperty('font-size',size*2+'px','important');
          window.dispatchEvent(new Event('resize'));return sizes.length;
        });
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        return {spacing,doubledFonts:{changedFonts,...await noOverflow(page)}};
      });
    }
    await page.setViewportSize({width:1280,height:720});await page.goto(base+'index.html');
    await check(engine,'24 slides sem conteúdo sob rodapé',async()=>{
      const overflows=[];
      for(let i=1;i<=24;i++){
        const id='s'+String(i).padStart(2,'0');await page.evaluate(id=>{location.hash=id},id);await page.waitForFunction(id=>document.getElementById(id).classList.contains('active'),id);
        const result=await page.evaluate(id=>{
          const s=document.getElementById(id),body=s.querySelector('.body'),source=s.querySelector('.source');const r=body.getBoundingClientRect();const limit=source.getBoundingClientRect().top;
          const children=[...body.querySelectorAll('*')].filter(n=>n.getClientRects().length && !n.closest('[hidden]'));
          const hits=children.filter(n=>n.getBoundingClientRect().bottom>limit+1).map(n=>({tag:n.tagName,text:n.textContent.slice(0,60),bottom:Math.round(n.getBoundingClientRect().bottom)}));
          return {id,reading:document.body.classList.contains('reading'),hits};
        },id);
        if(result.hits.length)overflows.push(result);
      }
      assert.deepEqual(overflows,[]);return {slides:24};
    });
    await page.goto(base+'index.html');
    await check(engine,'Aula vazia gera PDF0/100 com5 pendentes',async()=>{
      const s=await score(page,true);assert.equal(s.earned,0);assert.equal(s.pending,5);assert.equal(s.max,100);
      await saveDownload(page,()=>page.locator('#pdf-btn').click(),engine+'-aula-vazia.pdf');
    });
    await check(engine,'Aula: acerto, erro, revisão e limpar sem acumular',async()=>{
      await page.locator('#missions-btn').click();await page.locator('#mission-1-option-2').check();assert.equal((await score(page,true)).earned,20);
      await page.locator('#mission-1-option-0').check();assert.equal((await score(page,true)).earned,0);
      await page.locator('#mission-1-option-2').check();await page.locator('#mission-2-option-0').check();
      let s=await score(page,true);assert.equal(s.earned,20);assert.equal(s.answered,2);assert.equal(s.pending,3);
      await saveDownload(page,()=>page.locator('#missions-pdf').click(),engine+'-aula-parcial.pdf');
      await page.locator('#mission-1 .mission-clear').click();s=await score(page,true);assert.equal(s.earned,0);assert.equal(s.answered,1);assert.equal(s.pending,4);
      for(const [mission,choice]of [[1,2],[2,1],[3,0],[4,2],[5,0]])await page.locator('#mission-'+mission+'-option-'+choice).check();
      s=await score(page,true);assert.equal(s.earned,100);assert.equal(s.pending,0);
      await saveDownload(page,()=>page.locator('#missions-pdf').click(),engine+'-aula-completa.pdf');
    });
    await check(engine,'Diálogo: teclado não muda slide; foco retorna',async()=>{
      const before=await page.locator('#counter').textContent();await page.locator('#lesson-team').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#counter').textContent(),before);
      const violations=await axe(page);assert.deepEqual(violations,[]);
      await page.keyboard.press('Escape');assert.equal(await page.locator('#missions-dialog').evaluate(n=>n.open),false);
      assert.equal(await page.evaluate(()=>document.activeElement.id),'missions-btn');
    });
    await check(engine,'Reiniciar slide remove só XP da sua missão',async()=>{
      await page.evaluate(()=>{location.hash='s08'});await page.waitForFunction(()=>document.querySelector('#s08.active'));await page.locator('#reset-btn').click();const s=await score(page,true);assert.equal(s.earned,80);assert.equal(s.pending,1);
    });
    await check(engine,'Índice de risco2 baixo,6 alto e sem alterar XP',async()=>{
      await page.evaluate(()=>{location.hash='s15'});await page.waitForFunction(()=>document.querySelector('#s15.active'));const before=await score(page,true);
      await page.locator('#risk-prob').selectOption('1');await page.locator('#risk-impact').selectOption('2');assert.match(await page.locator('#risk-score').textContent(),/2.*Baixo/);
      await page.locator('#risk-prob').selectOption('3');assert.match(await page.locator('#risk-score').textContent(),/6.*Alto/);assert.equal((await score(page,true)).earned,before.earned);
    });

    await check(engine,'RISK-REFLOW-01: slide sem resultado estreito e tabela navegável',async()=>{
      const values=[];
      for(const [width,height] of [[320,568],[390,844],[640,480],[1280,720]]) {
        await page.setViewportSize({width,height});await page.goto(base+'index.html');
        await page.evaluate(()=>{location.hash='s15'});await page.waitForFunction(()=>document.querySelector('#s15.active'));
        const geometry=await page.evaluate(()=>{
          const rect=q=>document.querySelector(q).getBoundingClientRect();
          const grid=rect('#s15 .risk-demo'),score=rect('#risk-score'),chance=rect('#risk-prob'),impact=rect('#risk-impact');
          const region=document.querySelector('#s15 .risk-matrix-scroll');
          return {reading:document.body.classList.contains('reading'),
            row:Math.round(grid.width),result:Math.round(score.width),
            chance:Math.round(chance.width),impact:Math.round(impact.width),
            scrollable:region.scrollWidth>region.clientWidth+1,
            focusable:region.tabIndex===0};
        });
        assert.ok(geometry.result>=geometry.row-3,JSON.stringify({width,geometry}));
        assert.ok(geometry.chance>=150&&geometry.impact>=150,JSON.stringify({width,geometry}));
        assert.equal(geometry.focusable,true);
        if(width===320)assert.equal(geometry.scrollable,true);
        await noOverflow(page);
        values.push({width,...geometry});
      }
      return values;
    });
    await check(engine,'Impressão da aula preserva resultado atual',async()=>{
      await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await page.emulateMedia({media:'print'});
      assert.match(await page.locator('#lesson-report').textContent(),/80 \/ 100 XP/);assert.equal(await page.locator('#lesson-report').isVisible(),true);
      if(engine==='chromium')await page.pdf({path:path.join(evidence,'aula-impressao-parcial.pdf'),format:'A4',printBackground:true});
      await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    });
    await page.goto(base+'Ficha_Equipe_Aula_06_PPI.html');await page.waitForFunction(()=>window.ppiAula06);

    await check(engine,'RISK-REFLOW-01: ficha com campos, índice e mitigação legíveis',async()=>{
      const values=[];
      for(const [width,height] of [[320,568],[390,844],[640,480],[768,1024],[1280,720]]) {
        await page.setViewportSize({width,height});await page.goto(base+'Ficha_Equipe_Aula_06_PPI.html');
        await page.waitForFunction(()=>window.ppiAula06);
        const geometry=await page.evaluate(()=>{
          const block=document.querySelector('#part-5 .risk-block');
          const rect=q=>block.querySelector(q).getBoundingClientRect();
          const description=rect('.grid>.field-card'),row=rect('.risk-row'),
            chance=rect('.risk-row #prob1'),impact=rect('.risk-row #impacto1'),
            result=rect('.score-box'),mitigation=rect('.grid>.field-card:last-child');
          return {row:Math.round(row.width),description:Math.round(description.width),
            chance:Math.round(chance.width),impact:Math.round(impact.width),
            result:Math.round(result.width),mitigation:Math.round(mitigation.width),
            resultBeneathFields:result.top>=Math.max(chance.bottom,impact.bottom)};
        });
        assert.ok(geometry.description>=geometry.row-3,JSON.stringify({width,geometry}));
        assert.ok(geometry.mitigation>=geometry.row-3,JSON.stringify({width,geometry}));
        assert.ok(geometry.result>=geometry.row-3&&geometry.resultBeneathFields,JSON.stringify({width,geometry}));
        assert.ok(geometry.chance>=150&&geometry.impact>=150,JSON.stringify({width,geometry}));
        await noOverflow(page);
        values.push({width,...geometry});
      }
      return values;
    });
    await check(engine,'Ficha vazia exporta PDF e MD com0/100',async()=>{
      const s=await score(page);assert.equal(s.earned,0);assert.equal(s.total,26);assert.equal(s.pending,26);
      await saveDownload(page,()=>page.locator('#exportPdf').click(),engine+'-ficha-vazia.pdf');
      const md=await saveDownload(page,()=>page.locator('#exportMd').click(),engine+'-ficha-vazia.md');assert.match(fs.readFileSync(md,'utf8'),/0 \/ 100 XP/);
    });
    await check(engine,'Ficha parcial: pontos exatos, risco separado e compromisso sem XP',async()=>{
      await page.locator('#equipe').fill('Equipe teste');await page.locator('#projeto').selectOption('permanencia');await page.locator('#item').fill('Dados sintéticos de frequência.');await page.locator('#finalidade').fill('Testar o filtro sem expor estudantes reais.');await page.locator('#identifica').selectOption({index:1});await page.locator('#prob1').selectOption('1');await page.locator('#impacto1').selectOption('2');
      let s=await score(page);assert.equal(s.earned,16);assert.equal(s.answered,5);assert.equal(s.pending,21);assert.match(await page.locator('#score1').textContent(),/2.*Baixo/);
      await page.locator('#protocol-0').check();assert.equal((await score(page)).earned,16);
      await saveDownload(page,()=>page.locator('#exportPdf').click(),engine+'-ficha-parcial.pdf');
      await page.locator('#item').fill('   ');s=await score(page);assert.equal(s.earned,11);assert.equal(s.pending,22);await page.locator('#item').fill('Dados sintéticos de frequência.');
    });
    await check(engine,'Ctrl+P ficha parcial inclui valores,XP e pendências',async()=>{
      await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await page.emulateMedia({media:'print'});
      assert.equal(await page.locator('#document-content').isVisible(),true);const text=await page.locator('#document-content').textContent();assert.match(text,/16 \/ 100 XP/);assert.match(text,/Dados sintéticos de frequência/);assert.match(text,/21 pendentes/);
      if(engine==='chromium')await page.pdf({path:path.join(evidence,'ficha-impressao-parcial.pdf'),format:'A4',printBackground:true});
      await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));assert.equal(await page.locator('#worksheet').isVisible(),true);
    });
    await check(engine,'JSON exportado reabre e recalcula XP adulterado',async()=>{
      const file=await saveDownload(page,()=>page.locator('#exportJson').click(),engine+'-rascunho.json');const draft=JSON.parse(fs.readFileSync(file,'utf8'));draft.scoring.earned=999;draft.campos.score1='999';
      page.once('dialog',dialog=>dialog.accept());await page.locator('#importFile').setInputFiles({name:'rascunho.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(draft))});
      await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('recalculados'));
      assert.equal((await score(page)).earned,16);assert.equal(await page.locator('#item').inputValue(),draft.campos.item);assert.match(await page.locator('#score1').textContent(),/2.*Baixo/);
    });
    await check(engine,'JSON inválido preserva preenchimento atomicamente',async()=>{
      const before=await page.evaluate(()=>JSON.stringify(window.ppiAula06.snapshot()));
      const bad=await page.evaluate(()=>{const d=window.ppiAula06.snapshot();d.identificacao.equipe='NÃO DEVE MUDAR';d.campos.impacto2='4';return d});
      await page.locator('#importFile').setInputFiles({name:'invalido.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('preservado'));
      assert.equal(await page.evaluate(()=>JSON.stringify(window.ppiAula06.snapshot())),before);
    });
    await check(engine,'Ficha completa100/100 e apagar reduz pontuação',async()=>{
      await page.evaluate(()=>{for(const node of document.querySelectorAll('textarea')){node.value='Resposta de teste sintética para verificar preenchimento.';node.dispatchEvent(new Event('input',{bubbles:true}));}for(const sel of document.querySelectorAll('#activity-sections select')){sel.selectedIndex=1;sel.dispatchEvent(new Event('change',{bubbles:true}));}});
      let s=await score(page);assert.equal(s.earned,100);assert.equal(s.pending,0);
      await saveDownload(page,()=>page.locator('#exportPdf').click(),engine+'-ficha-completa.pdf');await page.locator('#regraEquipe').fill('');s=await score(page);assert.equal(s.earned,96);assert.equal(s.pending,1);
    });
    await check(engine,'Texto longo preservado em PDF e impressão',async()=>{
      const long='Texto sintético com finalidade e proveniência. '.repeat(55)+' MARCADOR_FINAL_LONGO';await page.locator('#item').fill(long);
      await saveDownload(page,()=>page.locator('#exportPdf').click(),engine+'-ficha-longa.pdf');await page.locator('#printView').click();assert.match(await page.locator('#document-content').textContent(),/MARCADOR_FINAL_LONGO/);
      await page.setViewportSize({width:320,height:568});await noOverflow(page);assert.deepEqual(await axe(page),[]);
      await page.locator('#backToForm').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'printView');assert.equal(await page.locator('#item').inputValue(),long);
    });
    await check(engine,'Símbolos Unicode levam à impressão sem perder resposta',async()=>{
      await page.locator('#item').fill('Dados sintéticos 🌱 — sem pessoas reais');await page.locator('#exportPdf').click();assert.equal(await page.locator('#document-view').isVisible(),true);assert.match(await page.locator('#document-content').textContent(),/🌱/);assert.match(await page.locator('#document-content').textContent(),/96 \/ 100 XP/);await page.locator('#backToForm').click();
    });
    await check(engine,'Operação offline após carregar, sem coleta externa',async()=>{
      await context.setOffline(true);await page.locator('#item').fill('Registro offline de teste.');assert.equal((await score(page)).earned,96);await saveDownload(page,()=>page.locator('#exportPdf').click(),engine+'-ficha-offline.pdf');await context.setOffline(false);assert.deepEqual(externalRequests,[]);
    });
    await check(engine,'Sem erros JavaScript',async()=>assert.deepEqual(pageErrors,[]));
    await context.close();await browser.close();
  }
  server.close();
  const summary={generatedAt:new Date().toISOString(),versions,summary:{pass:reports.filter(r=>r.status==='PASS').length,fail:reports.filter(r=>r.status==='FAIL').length,blocked:reports.filter(r=>r.status==='BLOCKED').length},reports};
  fs.writeFileSync(path.join(evidence,'qa-results.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({versions,summary:summary.summary,results:path.join(evidence,'qa-results.json')},null,2));if(failures)process.exitCode=1;
})().catch(error=>{server.close();console.error(error);process.exitCode=1});
