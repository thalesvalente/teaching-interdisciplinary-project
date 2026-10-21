/**
 * PPI I — Sistema de Entregas e Avaliações (2026)
 * Planilha privada por disciplina; uma aba por bimestre e uma aba Auditoria.
 * O PDF permanece com o aluno. A aba Auditoria guarda apenas respostas e hashes.
 *
 * Segurança: acesso público NÃO deve ser habilitado enquanto não houver
 * autenticação de estudantes e liberação institucional. O nome, sozinho,
 * não é prova de identidade. O SHA-256 informado pelo navegador não
 * comprova, isoladamente, que o PDF corresponde às respostas recebidas.
 */
const CFG = Object.freeze({
  spreadsheetId: '1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE',
  maxBytes: 120000,
  version: 'ppi-entregas-1.2.0',
  activities: Object.freeze({
    'PPI1-AULA06-2026': Object.freeze({
      sheet: '3º Bimestre', column: 'Aula 06',
      schema: 'ppi-f02-v1', rubric: 'aula06-xp-2.0',
      gradeMode: 'manual'
    })
    // Para outras aulas: adicionar código, bimestre, coluna, schema e rubrica.
  })
});
const AUDIT_HEADERS = Object.freeze([
  'Aluno','Equipe','Atividade','Data/hora BRT','Recebido UTC',
  'ID entrega','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC',
  'XP / 100','Nota / 10','Situação','Respostas JSON','Chave interna'
]);
const RUBRIC_AULA06 = Object.freeze([
  ['item',5],['finalidade',5],['fonte',5],['acesso',5],
  ['identifica',4],['sensivel',4],['estrategia',4],['minimizacao',8],
  ['autorizacao',5],['informar',5],['publicacao',5],
  ['dataVersao',5],['transformacoes',5],['restricoes',5],
  ['risco1',3],['prob1',1],['impacto1',1],['mitigacao1',3],
  ['risco2',3],['prob2',1],['impacto2',1],['mitigacao2',3],
  ['regraEquipe',4],['forca',3],['ajuste',3],['proximaAcao',4]
]);
const CHOICES = Object.freeze({
  identifica: ['Não identifica pessoa','Pode identificar por combinação','Identifica uma pessoa','Ainda não sabemos'],
  sensivel: ['Não parece envolver dado sensível','Pode envolver dado sensível','Envolve dado sensível','Ainda não sabemos'],
  estrategia: ['Sintético','Agregado','Anonimizado — a confirmar','Identificado — precisa de procedimento','Não se aplica']
});
function sha256Utf8(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8)
    .map(b=>(b<0?b+256:b).toString(16).padStart(2,'0')).join('');
}
function hmac256(s,key) {
  return Utilities.computeHmacSha256Signature(s,key)
    .map(b=>(b<0?b+256:b).toString(16).padStart(2,'0')).join('');
}
function normal(s) {
  return String(s||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
}
function literalText(s) {
  // Strings começando com =,+,-,@ nunca são enviadas como fórmulas ao Sheets.
  const value=String(s||'').trim();
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}
function verifyHeaders(sheet,expected) {
  const header=sheet.getRange(1,1,1,expected.length).getValues()[0];
  if(expected.some((v,i)=>header[i]!==v))
    throw Error('Cabeçalhos incompatíveis na aba ' + sheet.getName() + '.');
}
function getActivity(code) {
  const activity=CFG.activities[code];
  if(!activity)throw Error('Código de atividade não habilitado.');
  return activity;
}
function sanitizeSnapshot(snapshot,activity) {
  if(!snapshot || snapshot.schema!==activity.schema ||
     !snapshot.campos || typeof snapshot.campos!=='object' ||
     Array.isArray(snapshot.campos))throw Error('Ficha ou versão incompatível.');
  const id=snapshot.identificacao||{};
  if(!Array.isArray(id.componentes) || id.componentes.length>30)
    throw Error('Quantidade de integrantes inválida.');
  const names=id.componentes.map(x=>String(x||'').trim()).filter(Boolean);
  if(!names.length)throw Error('Informe pelo menos um integrante.');
  const seen=new Set();
  for(const name of names){
    if(name.length<3 || name.length>120 ||
       !/^[\p{L}][\p{L}\p{M} .'\-]{2,119}$/u.test(name))
      throw Error('Nome de aluno inválido; informe o nome completo.');
    const n=normal(name);
    if(seen.has(n))throw Error('Integrante duplicado após normalização.');
    seen.add(n);
  }
  const team=String(id.equipe||'').trim();
  if(team.length>120 || /[\x00-\x1f\x7f]/.test(team))
    throw Error('Equipe inválida.');
  if(!['memorias','permanencia'].includes(id.projeto))
    throw Error('Projeto inválido.');

  const allowed=new Set([...RUBRIC_AULA06.map(([k])=>k),'score1','score2']);
  const fields={};
  for(const key of Object.keys(snapshot.campos)) {
    if(!allowed.has(key))throw Error('Campo não reconhecido: '+key);
  }
  for(const [key] of RUBRIC_AULA06) {
    const value=snapshot.campos[key]===undefined?'':String(snapshot.campos[key]).trim();
    if(value.length>3000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))
      throw Error('Resposta inválida: '+key);
    if(CHOICES[key] && value && !CHOICES[key].includes(value))
      throw Error('Escolha inválida: '+key);
    if(/^(prob|impacto)[12]$/.test(key) && value && !/^[123]$/.test(value))
      throw Error('Valor de risco inválido: '+key);
    fields[key]=value;
  }
  // O risco (chance × impacto) é calculado aqui; o valor do navegador não é confiável.
  for(let i=1;i<=2;i++) {
    fields['score'+i]=(Number(fields['prob'+i]||0)*Number(fields['impacto'+i]||0))||'';
  }
  let protocol=[];
  if(snapshot.protocolo!==undefined){
    if(!Array.isArray(snapshot.protocolo) || snapshot.protocolo.length>8)
      throw Error('Protocolo inválido.');
    protocol=snapshot.protocolo.map(p=>({
      texto:String(p?.texto||'').slice(0,320),
      marcado:p?.marcado===true
    }));
  }
  const normalized={
    schema:activity.schema,version:'2.0.0',
    identificacao:{
      equipe:team,componentes:names,projeto:id.projeto,
      data:String(id.data||'').slice(0,10)
    },
    campos:fields,protocolo:protocol
  };
  const xp=RUBRIC_AULA06.reduce((sum,[key,p])=>
    sum+(String(fields[key]||'').trim()?p:0),0);
  return {names,team,normalized,xp};
}
function doGet() {
  // Diagnóstico sem informações pessoais, planilha ou segredo.
  return ContentService.createTextOutput('PPI I — endpoint de entrega ativo. Versão: '+CFG.version);
}
function doPost(e) {
  const nonce=String(e?.parameter?.nonce||'').slice(0,100);
  let response;
  try {response=processDelivery(String(e?.parameter?.payload||''));}
  catch(err){response={ok:false,error:String(err?.message||'Entrega recusada.')};}
  const data=JSON.stringify({channel:'ppi-entrega-aula06',nonce,...response})
    .replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><script>top.postMessage('+
    data+', "*");</scr'+'ipt>'
  ).setTitle('Recibo da entrega');
}
function ensureActivityColumn(sheet,activity) {
  const last=sheet.getLastColumn();
  const headers=sheet.getRange(1,1,1,last).getValues()[0];
  if(headers[0]!=='Aluno' || headers[1]!=='Equipe')
    throw Error('Cabeçalhos de alunos incorretos: '+sheet.getName());
  let media=headers.indexOf('Média')+1;
  if(!media || media<3)throw Error('Coluna Média não encontrada.');
  let col=headers.indexOf(activity.column)+1;
  if(!col) {
    sheet.insertColumnBefore(media);
    col=media;media++;
    sheet.getRange(1,col).setValue(activity.column);
    // Quem já está matriculado começa com zero na nova atividade.
    const n=sheet.getLastRow()-1;
    if(n>0)sheet.getRange(2,col,n,1).setValues(Array.from({length:n},()=>[0]));
  }
  if(col<3 || col>=media)throw Error('Coluna da atividade fora do intervalo de notas.');
  return {col,media};
}
function refreshAverages(sheet,media) {
  const last=sheet.getLastRow();
  if(last<2)return;
  const count=media-3;
  const lastAct=columnLetter(media-1);
  const formulas=Array.from({length:last-1},(_,i)=>{
    const row=i+2;
    return [count ? '=SUM(C'+row+':'+lastAct+row+')/'+count : '=0'];
  });
  sheet.getRange(2,media,last-1,1).setFormulas(formulas);
  sheet.getRange(2,3,last-1,media-2).setNumberFormat('0.0');
}
function columnLetter(n) {
  let out='';
  while(n>0){out=String.fromCharCode(65+(n-1)%26)+out;n=Math.floor((n-1)/26);}
  return out;
}
function upsertGrade(sheet,name,team,activity) {
  const {col,media}=ensureActivityColumn(sheet,activity);
  const last=sheet.getLastRow();
  const data=last>1?sheet.getRange(2,1,last-1,2).getValues():[];
  let row=0;
  for(let i=0;i<data.length;i++) {
    if(normal(data[i][0])===normal(name)){
      if(row)throw Error('Aluno duplicado na aba '+sheet.getName()+'.');
      row=i+2;
      // Homônimos em equipes diferentes exigem uma decisão humana.
      if(data[i][1] && team && normal(data[i][1])!==normal(team))
        throw Error('Aluno já pertence a outra equipe; conferir identificação.');
    }
  }
  if(!row) {
    row=sheet.getLastRow()+1;
    sheet.getRange(row,1,1,media).setValues([
      [literalText(name),literalText(team),...Array(media-3).fill(0),'']
    ]);
  } else {
    sheet.getRange(row,2).setValue(literalText(team));
    // Somente a atividade reenviada é reiniciada até correção docente.
    sheet.getRange(row,col).setValue(0);
  }
  return media;
}
function upsertAudit(sheet,rowData,key) {
  verifyHeaders(sheet,AUDIT_HEADERS);
  const last=sheet.getLastRow();
  const keys=last>1?sheet.getRange(2,14,last-1,1).getValues():[];
  let row=0;
  keys.forEach((r,i)=>{if(r[0]===key){if(row)throw Error('Recibo duplicado na auditoria.');row=i+2;}});
  const to= row || last+1;
  sheet.getRange(to,1,1,AUDIT_HEADERS.length).setValues([rowData]);
}
function getReceiptKey() {
  const properties=PropertiesService.getScriptProperties();
  let secret=properties.getProperty('RECEIPT_HMAC_SECRET');
  if(!secret){
    secret=Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid();
    properties.setProperty('RECEIPT_HMAC_SECRET',secret);
  }
  return secret;
}
function processDelivery(body) {
  if(!body || body.length>CFG.maxBytes)throw Error('Envio ausente ou acima do limite.');
  const delivery=JSON.parse(body);
  const activity=getActivity(delivery.activity);
  if(delivery.schema!==activity.schema)throw Error('Esquema incompatível.');
  const pdfHash=String(delivery.pdfSha256||'');
  if(!/^[a-f0-9]{64}$/.test(pdfHash))throw Error('SHA-256 do PDF inválido.');
  const {names,team,normalized,xp}=sanitizeSnapshot(delivery.snapshot,activity);
  const answerJson=JSON.stringify(normalized);
  const answerHash=sha256Utf8(answerJson);
  const ss=SpreadsheetApp.openById(CFG.spreadsheetId);
  const grade=ss.getSheetByName(activity.sheet);
  const audit=ss.getSheetByName('Auditoria');
  if(!grade||!audit)throw Error('Abas necessárias não encontradas.');
  // Aplique o último recebimento dentro do lock: nenhuma operação cruza outra entrega.
  const lock=LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    verifyHeaders(audit,AUDIT_HEADERS);
    // Validar todos os integrantes ANTES de qualquer escrita.
    for(const name of names) {
      const rows=grade.getLastRow()>1
        ?grade.getRange(2,1,grade.getLastRow()-1,2).getValues():[];
      const same=rows.filter(r=>normal(r[0])===normal(name));
      if(same.length>1)throw Error('Nome duplicado no boletim.');
      if(same[0] && same[0][1] && team &&
         normal(same[0][1])!==normal(team))throw Error('Conflito de equipe/identidade.');
    }
    const time=new Date(),receivedAt=time.toISOString();
    const local=Utilities.formatDate(time,'America/Fortaleza','dd/MM/yyyy HH:mm:ss');
    const deliveryId=Utilities.getUuid();
    const signText=JSON.stringify([
      deliveryId,receivedAt,delivery.activity,pdfHash,answerHash,
      names.map(normal),xp,activity.rubric,'SEM_NOTA'
    ]);
    const signature=hmac256(signText,getReceiptKey());

    for(const name of names){
      const key=delivery.activity+'|'+normal(name);
      const rowData=[literalText(name),literalText(team),delivery.activity,local,
        receivedAt,deliveryId,pdfHash,answerHash,signature,xp,'',
        'Avaliação pendente',answerJson,key];
      upsertAudit(audit,rowData,key);
    }
    let media=0;
    for(const name of names)media=upsertGrade(grade,name,team,activity);
    if(grade.getLastRow()>1) {
      grade.getRange(2,1,grade.getLastRow()-1,media).sort(1);
      refreshAverages(grade,media);
    }
    if(audit.getLastRow()>1)
      audit.getRange(2,1,audit.getLastRow()-1,AUDIT_HEADERS.length)
        .sort([{column:1,ascending:true},{column:3,ascending:true}]);
    SpreadsheetApp.flush();
    return {ok:true,deliveryId,receivedAt,pdfSha256:pdfHash,
      answersSha256:answerHash,signature,xp,gradeStatus:'pendente',
      message:'Entrega registrada. XP formativo calculado; nota acadêmica pendente.'};
  } finally {lock.releaseLock();}
}
function testarConexao() {
  const ss=SpreadsheetApp.openById(CFG.spreadsheetId);
  const audit=ss.getSheetByName('Auditoria');
  if(!audit)throw Error('Auditoria ausente.');
  verifyHeaders(audit,AUDIT_HEADERS);
  Object.values(CFG.activities).forEach(activity=>{
    const sheet=ss.getSheetByName(activity.sheet);
    if(!sheet)throw Error('Bimestre ausente: '+activity.sheet);
    const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    if(!headers.includes('Aluno')||!headers.includes('Equipe')||
       !headers.includes('Média'))throw Error('Cabeçalhos inválidos: '+activity.sheet);
  });
  console.log('Planilha: '+ss.getName());
  console.log('Atividades: '+Object.keys(CFG.activities).join(', '));
  console.log('Diagnóstico estrutural: PASS');
}
