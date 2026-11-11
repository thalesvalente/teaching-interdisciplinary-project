'use strict';
/* Independent local integration: real .gs functions in the VM service harness.
 * No Google login, deployment, permissions, network call or real Sheet is proved here.
 */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {once}=require('node:events');
const {chromium}=require('playwright');
const {createHarness}=require('./backend-harness.cjs');
const ROOT=path.resolve(__dirname,'..');

test('C4 independent Chromium: frontend uses actual backend DTOs for submit, exact replay and criterion review',async()=>{
  const h=createHarness({email:'alfa@example.test'});
  const rpcCalls=[],pageErrors=[];let loseFirstSubmissionReply=true;
  const server=http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()) {
      response.writeHead(404);response.end();return;
    }
    const type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
    response.writeHead(200,{'Content-Type':type[path.extname(file)]||'text/plain; charset=utf-8'});
    fs.createReadStream(file).pipe(response);
  });
  server.listen(0,'127.0.0.1');await once(server,'listening');
  let browser;
  try {
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width:1280,height:720}});
    page.on('pageerror',error=>pageErrors.push(error.message));
    page.on('dialog',dialog=>dialog.accept());
    await page.exposeFunction('__independentRpc',(method,input)=>{
      rpcCalls.push({method,input});
      const result=h.call(method,input);
      if(method==='submitActivity'&&loseFirstSubmissionReply&&result.ok) {
        loseFirstSubmissionReply=false;
        return {simulatedTransportFailure:true};
      }
      return {result};
    });
    await page.addInitScript(()=>{
      const makeRunner=(success,failure)=>new Proxy({}, {get(_,method){
        if(method==='withSuccessHandler')return callback=>makeRunner(callback,failure);
        if(method==='withFailureHandler')return callback=>makeRunner(success,callback);
        return payload=>{
          window.__independentRpc(method,payload).then(reply=>{
            if(reply.simulatedTransportFailure)failure(new Error('Synthetic lost reply after commit.'));
            else success(reply.result);
          },failure);
        };
      }});
      window.google={script:{run:makeRunner(()=>{},()=>{})}};
    });
    const url='http://127.0.0.1:'+server.address().port+'/frontend/index.html';
    await page.goto(url);
    await page.waitForFunction(()=>document.getElementById('mode-title').textContent.includes('Laboratório QA'));
    await page.locator('#sample-button').click();
    await page.locator('[data-step="reflect"]').click();
    for(const key of ['understood','evidence_checked','authorship_declared'])await page.locator('#self-'+key).check();
    await page.locator('[data-step="deliver"]').click();
    await page.locator('#submit-server').click();
    await page.locator('#retry-box').waitFor({state:'visible'});
    assert.equal(await page.locator('#receipt-panel').isVisible(),false);
    assert.equal(h.sheets.Submissoes.objects().length,1);
    await page.locator('#retry-request').click();
    await page.locator('#receipt-panel').waitFor({state:'visible'});
    assert.match(await page.locator('#notice').innerText(),/NO_OP/);
    assert.match(await page.locator('#receipt-details').innerText(),/100/);
    const submits=rpcCalls.filter(call=>call.method==='submitActivity');
    assert.equal(submits.length,2);assert.deepEqual(submits[0].input,submits[1].input);
    assert.equal(h.sheets.Submissoes.objects().length,1);
    const submission=h.sheets.Submissoes.objects()[0];
    assert.equal(submission.participant_id,'EST-ALFA-01');
    assert.equal(h.sheets.Avaliacoes_Docente.objects().length,0);

    // Reload changes the mocked Session identity; the browser is not allowed to claim its role.
    h.state.email='teacher@example.test';await page.reload();
    await page.locator('#teacher-panel').waitFor({state:'visible'});
    await page.locator('#review-submission').fill(submission.submission_id);
    await page.locator('#review-load').click();
    await page.locator('#review-score-understood').waitFor({state:'visible'});
    assert.equal(await page.locator('#review-participant').inputValue(),'EST-ALFA-01');
    const scores={understood:30,evidence_checked:40,authorship_declared:30};
    for(const [criterion,score] of Object.entries(scores))await page.locator('#review-score-'+criterion).fill(String(score));
    await page.locator('#review-decision').selectOption('APROVADA');
    await page.locator('#review-justification').fill('Independent synthetic review of actual backend criteria.');
    await page.locator('#review-submit').click();
    await page.waitForFunction(()=>document.getElementById('review-result').textContent.includes('Revisão registrada'));
    assert.match(await page.locator('#review-result').innerText(),/Nenhum lançamento oficial/);
    assert.equal(h.sheets.Avaliacoes_Docente.objects().length,3);
    assert.equal(h.sheets.Notas_3a_Etapa.objects().length,0);
    assert.equal(h.sheets.Notas_4a_Etapa.objects().length,0);
    const review=rpcCalls.find(call=>call.method==='reviewSubmission').input;
    assert.equal(review.payload.participant_id,'EST-ALFA-01');
    assert.equal(review.payload.expected_revision,0);assert.equal(review.payload.scores.length,3);
    assert.equal(h.call('getReceipt',{submission_id:submission.submission_id}).data.review_revision,1);
    assert.deepEqual(pageErrors,[]);
    if(process.env.PPI_LAB_INDEPENDENT_SCREENSHOT)await page.screenshot({path:process.env.PPI_LAB_INDEPENDENT_SCREENSHOT,fullPage:true});
  } finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
