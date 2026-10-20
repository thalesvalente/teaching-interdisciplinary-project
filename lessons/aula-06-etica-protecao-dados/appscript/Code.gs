/**
 * PPI I Aula 06 — Google Apps Script. Vincule este projeto à planilha
 * interdisciplinary-project-2026 e publique como Aplicativo da Web:
 * executar como você; acesso público necessário apenas se a política institucional permitir.
 * Ver instruções de segurança antes de habilitar.
 */
const CFG = Object.freeze({
  spreadsheetId: '1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE',
  tab: 'Entregas',
  activity: 'PPI1-AULA06-2026',
  schema: 'ppi-f02-v1',
  maxBytes: 120000
});
const FIELDS = ['Aluno','Equipe','Turma','Disciplina','Etapa','Atividade','Projeto',
 'Data/hora (BRT)','Recebido UTC','Nota','Situação','Risco 1 (didático)',
 'Risco 2 (didático)','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC',
 'ID entrega','Versão rubrica','Respostas JSON','Chave interna'];
const sha = s => Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8)
  .map(x=>(x<0?x+256:x).toString(16).padStart(2,'0')).join('');
const hmac = (message,secret) => Utilities.computeHmacSha256Signature(message,secret)
  .map(x=>(x<0?x+256:x).toString(16).padStart(2,'0')).join('');
const normal = s => String(s||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
function doPost(e) {
  let nonce=String(e?.parameter?.nonce||'');
  let response;
  try { response=processDelivery(String(e?.parameter?.payload||'')); }
  catch(err) { response={ok:false,error:String(err?.message||'Falha ao registrar entrega.')}; }
  // Retorno via iframe, dispensando CORS e sem inclusão de dados sensíveis na URL.
  const safe=JSON.stringify({channel:'ppi-entrega-aula06',nonce,...response}).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>top.postMessage('+safe+', "*");</scr'+'ipt>')
    .setTitle('Confirmação de entrega');
}
function processDelivery(body) {
  if(!body || body.length>CFG.maxBytes)throw Error('Envio ausente ou acima do limite.');
  const d=JSON.parse(body);
  if(d.schema!==CFG.schema || d.activity!==CFG.activity)throw Error('Atividade incompatível.');
  if(!/^[a-f0-9]{64}$/.test(String(d.pdfSha256||'')))throw Error('Hash PDF inválido.');
  const snap=d.snapshot;
  if(!snap || snap.schema!==CFG.schema || typeof snap.campos!=='object')throw Error('Ficha inválida.');
  const id=snap.identificacao||{};
  const names=[...new Set((id.componentes||[]).map(x=>String(x).trim()).filter(Boolean))];
  if(!names.length || names.length>12 || names.some(n=>n.length>120))throw Error('Identificação de estudantes inválida.');
  if(!['memorias','permanencia'].includes(id.projeto))throw Error('Projeto inválido.');
  const expected=['prob1','impacto1','prob2','impacto2'];
  for(const k of expected){if(snap.campos[k]!==''&&!['1','2','3'].includes(String(snap.campos[k])))throw Error('Matriz inválida.');}
  const risk=i=>Number(snap.campos['prob'+i]||0)*Number(snap.campos['impacto'+i]||0);
  const normalized={schema:CFG.schema,identificacao:{
    equipe:String(id.equipe||'').slice(0,120),componentes:names,projeto:id.projeto,data:String(id.data||'')
  },campos:snap.campos,protocolo:snap.protocolo};
  const data=JSON.stringify(normalized), answerHash=sha(data);
  const now=new Date(), utc=now.toISOString(), local=Utilities.formatDate(now,'America/Fortaleza','dd/MM/yyyy HH:mm:ss');
  const deliveryId=Utilities.getUuid();
  const properties=PropertiesService.getScriptProperties();
  let secret=properties.getProperty('RECEIPT_HMAC_SECRET');
  if(!secret){secret=Utilities.getUuid()+Utilities.getUuid();properties.setProperty('RECEIPT_HMAC_SECRET',secret);}
  const signed=JSON.stringify([deliveryId,utc,d.pdfSha256,answerHash,CFG.activity,names.map(normal), 'SEM_NOTA']);
  const signature=hmac(signed,secret);
  const ss=SpreadsheetApp.openById(CFG.spreadsheetId),sh=ss.getSheetByName(CFG.tab);
  if(!sh)throw Error('Aba Entregas ausente.');
  const lock=LockService.getScriptLock();
  lock.waitLock(20000);
  try{
    const all=sh.getDataRange().getValues();
    const old=new Map();
    all.slice(1).forEach(row=>{
      const key=String(row[19]||'');
      if(key)old.set(key,row);
    });
    for(const name of names){
      const key=CFG.activity+'|'+normal(name);
      old.set(key,[name,normalized.identificacao.equipe,'','Prática Profissional Integrada I','3ª etapa',
        CFG.activity,id.projeto,local,utc,'','Recebida — avaliação pendente',
        risk(1)||'',risk(2)||'',d.pdfSha256,answerHash,signature,deliveryId,
        'não configurada',data,key]);
    }
    const records=[...old.values()].sort((a,b)=>String(a[0]).localeCompare(String(b[0]),'pt-BR',{sensitivity:'base'}));
    const required=records.length+1;
    if(sh.getMaxRows()<required)sh.insertRowsAfter(sh.getMaxRows(),required-sh.getMaxRows());
    if(sh.getLastRow()>1)sh.getRange(2,1,sh.getLastRow()-1,FIELDS.length).clearContent();
    if(records.length)sh.getRange(2,1,records.length,FIELDS.length).setValues(records);
    SpreadsheetApp.flush();
  } finally {lock.releaseLock();}
  return {ok:true,deliveryId,receivedAt:utc,pdfSha256:d.pdfSha256,answersSha256:answerHash,signature,
    message:'Entrega registrada. A avaliação acadêmica depende de rubrica docente.'};
}
