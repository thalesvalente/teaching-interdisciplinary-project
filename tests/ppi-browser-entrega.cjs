/**
 * E2E da entrega da Aula 06, sem chamar Google de verdade.
 * Browser => PDF bytes => SHA-256 => POST interceptado => recibo no browser.
 * npm ci && npx playwright install chromium && node tests/ppi-browser-entrega.cjs
 */
'use strict';
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const dir='/lessons/aula-06-etica-protecao-dados/';
const cases=[];
const server=http.createServer((req,res)=>{
  let url;
  try {url=new URL(req.url,'http://localhost');}catch{return res.writeHead(400).end();}
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
    '.css':'text/css; charset=utf-8'};
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'text/plain'});
  fs.createReadStream(file).pipe(res);
});
function receiptHtml(data) {
  return '<!doctype html><meta charset="utf-8"><script>top.postMessage('+
    JSON.stringify(data)+', "*");</scr'+'ipt>';
}
async function run() {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+dir;
  const browser=await chromium.launch({headless:true});
  const ctx=await browser.newContext({acceptDownloads:true,viewport:{width:390,height:844}});
  const received=[];
  let alterHash=false;
  await ctx.route('https://script.google.com/**',async route=>{
    const req=route.request();
    if(req.method()!=='POST')return route.fulfill({status:405,body:'GET blocked in mocked endpoint'});
    const body=new URLSearchParams(req.postData()||'');
    const data=JSON.parse(body.get('payload'));
    assert.equal(data.activity,'PPI1-AULA06-2026');
    assert.equal(data.snapshot.schema,'ppi-f02-v1');
    received.push({nonce:body.get('nonce'),data});
    return route.fulfill({
      status:200,contentType:'text/html',
      body:receiptHtml({
        channel:'ppi-entrega-aula06',nonce:body.get('nonce'),ok:true,
        deliveryId:'E2E-TESTE-'+received.length,
        receivedAt:'2026-10-21T12:00:00.000Z',
        pdfSha256:alterHash?'f'.repeat(64):data.pdfSha256,
        xp:24
      })
    });
  });
  try {
    const page=await ctx.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'Ficha_Equipe_Aula_06_PPI.html');
    await page.locator('.member-name').first().fill('Ana Teste');
    await page.locator('.member-name').nth(1).fill('Bruno Teste');
    await page.locator('#equipe').fill('Equipe Teste');
    await page.locator('#projeto').selectOption('memorias');
    await page.locator('#item').fill('Fonte pública e dados sintéticos de teste.');

    const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ppi-browser-'));
    const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

    // Exportar o PDF sem enviar à planilha.
    const [download1]=await Promise.all([
      page.waitForEvent('download'),page.locator('#exportPdf').click()
    ]);
    const p1=path.join(temp,'local.pdf');
    await download1.saveAs(p1);
    assert.equal(received.length,0);
    assert.ok(fs.readFileSync(p1).subarray(0,8).toString().startsWith('%PDF-1.4'));
    cases.push('PDF local não envia dados');

    // Entrega aceita: o hash reportado deve pertencer ao PDF baixado.
    const [download2]=await Promise.all([
      page.waitForEvent('download'),page.locator('#submitActivity').click()
    ]);
    const p2=path.join(temp,'entrega.pdf');
    await download2.saveAs(p2);
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Entrega CONFIRMADA'));
    assert.equal(received.length,1);
    assert.equal(received[0].data.pdfSha256,hash(fs.readFileSync(p2)));
    assert.deepEqual(received[0].data.snapshot.identificacao.componentes,['Ana Teste','Bruno Teste']);
    assert.match(await page.locator('#status').textContent(),/E2E-TESTE-1/);
    cases.push('PDF real + hash do POST + recibo no navegador');

    // Resposta adulterada não confirma entrega.
    alterHash=true;
    const [download3]=await Promise.all([
      page.waitForEvent('download'),page.locator('#submitActivity').click()
    ]);
    await download3.saveAs(path.join(temp,'hash-invalido.pdf'));
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('ENTREGA NÃO CONFIRMADA'));
    assert.match(await page.locator('#status').textContent(),/Hash não corresponde/);
    assert.equal(received.length,2);
    cases.push('Recusa de confirmação por hash divergente');

    // Alterar para equipe vazia não pode enviar, mesmo que o PDF seja permitido.
    await page.locator('.member-name').first().fill('');
    await page.locator('.member-name').nth(1).fill('');
    await page.locator('#submitActivity').click();
    assert.equal(received.length,2);
    assert.match(await page.locator('#status').textContent(),/informe o nome completo/);
    cases.push('Envio sem identificação é bloqueado');
    assert.deepEqual(errors,[]);
    cases.push('Sem exceções JavaScript');

    fs.rmSync(temp,{recursive:true,force:true});
    console.log(JSON.stringify({status:'PASS',scenarios:cases.length,items:cases},null,2));
  } finally {
    await ctx.close();
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
run().catch(e=>{console.error(e);process.exitCode=1;server.close();});
