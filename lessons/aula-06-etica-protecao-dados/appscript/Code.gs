/**
 * PPI I Aula 06 — Google Apps Script. Vincule este projeto à planilha
 * interdisciplinary-project-2026 e publique como Aplicativo da Web:
 * executar como você; acesso público necessário apenas se a política institucional permitir.
 * Ver instruções de segurança antes de habilitar.
 */
const CFG = Object.freeze({
  spreadsheetId: '1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE',
  tab: '3º Bimestre',
  activity: 'PPI1-AULA06-2026',
  schema: 'ppi-f02-v1',
  maxBytes: 120000
});
const FIELDS = ['Aluno','Equipe','Turma','Disciplina','Etapa','Atividade','Projeto',
 'Data/hora (BRT)','Recebido UTC','Nota','Situação','Risco 1 (didático)',
 'Risco 2 (didático)','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC',
 'ID entrega','Versão rubrica','Respostas JSON','Chave interna','XP preparação / 100'];
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
  if(!names.length || names.length>30 || names.some(n=>n.length>120))throw Error('Identificação de estudantes inválida.');
  if(!['memorias','permanencia'].includes(id.projeto))throw Error('Projeto inválido.');
  const expected=['prob1','impacto1','prob2','impacto2'];
  for(const k of expected){if(snap.campos[k]!==''&&!['1','2','3'].includes(String(snap.campos[k])))throw Error('Matriz inválida.');}
  const risk=i=>Number(snap.campos['prob'+i]||0)*Number(snap.campos['impacto'+i]||0);
  const rubric=[['item',5],['finalidade',5],['fonte',5],['acesso',5],
  ['identifica',4],['sensivel',4],['estrategia',4],['minimizacao',8],
  ['autorizacao',5],['informar',5],['publicacao',5],
  ['dataVersao',5],['transformacoes',5],['restricoes',5],
  ['risco1',3],['prob1',1],['impacto1',1],['mitigacao1',3],
  ['risco2',3],['prob2',1],['impacto2',1],['mitigacao2',3],
  ['regraEquipe',4],['forca',3],['ajuste',3],['proximaAcao',4]];
  const xp=rubric.reduce((sum,[key,points])=>sum+
    (String(snap.campos[key]||'').trim()?points:0),0);
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
  const ss=SpreadsheetApp.openById(CFG.spreadsheetId);
  const grade=ss.getSheetByName('3º Bimestre'),audit=ss.getSheetByName('Auditoria');
  if(!grade||!audit)throw Error('Abas bimestrais ou Auditoria ausentes.');
  const lock=LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const oldAudit=audit.getLastRow()>1
      ?audit.getRange(2,1,audit.getLastRow()-1,15).getValues():[];
    const byKey=new Map();
    oldAudit.forEach(row=>{if(row[14])byKey.set(String(row[14]),row);});
    for(const name of names){
      const key=CFG.activity+'|'+normal(name);
      byKey.set(key,[name,normalized.identificacao.equipe,'3º Bimestre',CFG.activity,
        local,utc,deliveryId,d.pdfSha256,answerHash,signature,xp,'',
        'Avaliação pendente',data,key]);
    }
    const records=[...byKey.values()].sort((a,b)=>
      String(a[0]).localeCompare(String(b[0]),'pt-BR',{sensitivity:'base'}));
    if(audit.getMaxRows()<records.length+1)
      audit.insertRowsAfter(audit.getMaxRows(),records.length+1-audit.getMaxRows());
    if(audit.getLastRow()>1)audit.getRange(2,1,audit.getLastRow()-1,15).clearContent();
    if(records.length)audit.getRange(2,1,records.length,15).setValues(records);

    const existing=grade.getLastRow()>1
      ?grade.getRange(2,1,grade.getLastRow()-1,4).getValues():[];
    const byStudent=new Map();
    existing.forEach(row=>{if(row[0])byStudent.set(normal(row[0]),row);});
    for(const name of names){
      const key=normal(name),old=byStudent.get(key)||[name,'',0,''];
      byStudent.set(key,[name,normalized.identificacao.equipe,
        typeof old[2]==='number'?old[2]:0,'']);
    }
    const grades=[...byStudent.values()].sort((a,b)=>
      String(a[0]).localeCompare(String(b[0]),'pt-BR',{sensitivity:'base'}));
    if(grade.getMaxRows()<grades.length+1)
      grade.insertRowsAfter(grade.getMaxRows(),grades.length+1-grade.getMaxRows());
    if(grade.getLastRow()>1)grade.getRange(2,1,grade.getLastRow()-1,4).clearContent();
    if(grades.length){
      grade.getRange(2,1,grades.length,4).setValues(grades);
      const formulas=grades.map((_,i)=>['=AVERAGE(C'+(i+2)+':C'+(i+2)+')']);
      grade.getRange(2,4,grades.length,1).setFormulas(formulas);
    }
    SpreadsheetApp.flush();
  } finally {lock.releaseLock();}
  return {ok:true,deliveryId,receivedAt:utc,pdfSha256:d.pdfSha256,answersSha256:answerHash,signature,
    xp,message:'Entrega registrada. XP calculado no Apps Script; avaliação acadêmica pendente.'};
}
