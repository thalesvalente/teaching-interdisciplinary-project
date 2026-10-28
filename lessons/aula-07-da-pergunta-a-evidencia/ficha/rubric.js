(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./content.js'):root.PPIContent,typeof module==='object'&&module.exports?require('./model.js'):root.PPIModel);if(typeof module==='object'&&module.exports)module.exports=api;else root.PPIRubric=api;})(typeof globalThis!=='undefined'?globalThis:this,function(C,M){'use strict';
const present=x=>typeof x==='string'&&x.trim().length>0;
const all=(obj,keys)=>keys.every(k=>present(obj[k]));
const core=['entrevista','observacao','documental'];
const members=s=>s.members;
const validMember=(s,id)=>s.members.some(m=>m.id===id&&present(m.name));
const main=s=>s.m2.techniques.find(t=>t.role==='principal');
const complements=s=>s.m2.techniques.filter(t=>t.role==='complementar');
const techniqueComplete=(s,t)=>!!t&&all(t,['source','purpose','evidence','limitation'])&&validMember(s,t.responsible);
const questionComplete=q=>present(q.text)&&present(q.purpose)&&C.CATEGORIES.some(([k])=>k===q.category);
const ethicsComplete=(s,keys)=>keys.every(k=>['yes','no','pending','na'].includes(s.m4[k].answer)&&present(s.m4[k].decision));
const recordComplete=e=>all(e,C.FIELDS.evidence.map(x=>x[0]))&&['alta','media','baixa'].includes(e.confidence)&&['achado','evidencia','hipotese','pendencia'].includes(e.classification);
const authorFraction=(s,key)=>members(s).length?members(s).filter(m=>key==='reviewed'?m.reviewed===true:present(m[key])).length/members(s).length:0;
const criterion=(id,label,weight,test)=>({id,label,weight,test});
const RUBRIC=[
{id:1,title:C.TITLES[1],max:10,criteria:C.FIELDS.m1.map(([key,label])=>criterion('m1-'+key,label,2,s=>present(s.m1[key])))},
{id:2,title:C.TITLES[2],max:15,criteria:[
criterion('m2-main','Técnica principal central, com fonte, finalidade, evidência, limitação e responsável.',5,s=>core.includes(main(s)?.kind)&&techniqueComplete(s,main(s))),
criterion('m2-complement','Ao menos uma técnica complementar diferente; todos os complementos com fonte, finalidade, evidência, limitação e responsável.',5,s=>complements(s).length>=1&&complements(s).every(t=>C.TECHNIQUES.some(([k])=>k===t.kind)&&t.kind!==main(s)?.kind&&techniqueComplete(s,t))&&new Set(s.m2.techniques.map(t=>t.kind)).size===s.m2.techniques.length),
criterion('m2-reasons','Justificativas registradas para a técnica principal e todos os complementos.',5,s=>core.includes(main(s)?.kind)&&complements(s).length>0&&complements(s).every(t=>C.TECHNIQUES.some(([k])=>k===t.kind)&&t.kind!==main(s)?.kind)&&new Set(s.m2.techniques.map(t=>t.kind)).size===s.m2.techniques.length&&s.m2.techniques.every(t=>present(t.justification)))]},
{id:3,title:C.TITLES[3],max:20,criteria:[
criterion('m3-interview','Seis a oito perguntas no total, todas com texto, categoria e finalidade.',6,s=>s.m3.questions.length>=6&&s.m3.questions.length<=8&&s.m3.questions.every(questionComplete)),
criterion('m3-categories','As seis famílias aparecem em perguntas completas: contexto, pessoas, processo, problema, resultado e validação.',1,s=>C.CATEGORIES.slice(0,6).every(([key])=>s.m3.questions.some(q=>q.category===key&&questionComplete(q)))),
criterion('m3-closing','Última pergunta aberta “Há algo importante que não perguntamos?” com finalidade registrada pela equipe.',1,s=>{const q=s.m3.questions.at(-1);return q?.category==='fechamento'&&q.text.trim()===C.CLOSING&&present(q.purpose);}),
criterion('m3-observation','Os oito campos de observação estão preenchidos.',6,s=>all(s.m3.observation,C.FIELDS.observation.map(x=>x[0]))),
criterion('m3-document','Os nove campos de análise documental estão preenchidos.',6,s=>all(s.m3.document,C.FIELDS.document.map(x=>x[0])))]},
{id:4,title:C.TITLES[4],max:15,criteria:[
criterion('m4-consent','Autorização, explicação do objetivo e direito de recusa com decisões justificadas.',3,s=>ethicsComplete(s,['authorization','explained','refusal'])),
criterion('m4-minimize','Necessidade de gravação, dados pessoais e substituição segura com decisões/mitigação.',3,s=>ethicsComplete(s,['recording','personal','substitution'])),
criterion('m4-access','Quem pode acessar e quem valida a interpretação registrados.',3,s=>all(s.m4,['access','validator'])),
criterion('m4-provenance','Como citar a fonte e o que não pode ser publicado registrados.',3,s=>all(s.m4,['citation','publication'])),
criterion('m4-ai-risk','Decisão justificada sobre IA, riscos e mitigação registrados.',3,s=>ethicsComplete(s,['ai'])&&all(s.m4,['risks','mitigation']))]},
{id:5,title:C.TITLES[5],max:20,criteria:[
criterion('m5-scenario','Cenário sintético ou cartão autorizado descrito, com participantes e papéis.',4,s=>['synthetic','authorized'].includes(s.m5.type)&&all(s.m5,['scenario','roles'])&&s.m5.participants.length>0&&s.m5.participants.every(id=>validMember(s,id))),
criterion('m5-questions','Perguntas que funcionaram, confundiram e induziram registradas (ou ausência explicitada).',4,s=>all(s.m5,['worked','confusing','leading'])),
criterion('m5-findings','Informação sensível e contradição registradas (ou ausência explicitada).',4,s=>all(s.m5,['sensitive','contradiction'])),
criterion('m5-difficulty','Dificuldade de tempo ou compreensão registrada (ou ausência explicitada).',4,s=>present(s.m5.difficulty)),
criterion('m5-revision','Revisão após o teste: alteração, justificativa e antes/depois ou síntese explícita.',4,s=>all(s.m5,['change','reason'])&&(all(s.m5,['before','after'])||present(s.m5.summary)))]},
{id:6,title:C.TITLES[6],max:10,criteria:[
criterion('m6-finding','Um achado completo sustentado por fonte identificada.',2,s=>s.m6.records.some(e=>e.classification==='achado'&&recordComplete(e))),
criterion('m6-hypothesis','Uma hipótese não confirmada registrada com todos os campos.',2,s=>s.m6.records.some(e=>e.classification==='hipotese'&&recordComplete(e))),
criterion('m6-pending','Uma pendência registrada com todos os campos.',2,s=>s.m6.records.some(e=>e.classification==='pendencia'&&recordComplete(e))),
criterion('m6-limit','Divergência/limitação ou justificativa explícita da ausência registrada.',2,s=>present(s.m6.limitation)),
criterion('m6-needs','Necessidades candidatas registradas como pendentes de validação.',2,s=>present(s.m6.needs))]},
{id:7,title:C.TITLES[7],max:10,criteria:[
criterion('m7-contribution','Contribuição de cada integrante (2 XP proporcionais à completude da equipe).',2,s=>authorFraction(s,'contribution')),
criterion('m7-improvement','Pergunta ou decisão melhorada por cada integrante (2 XP proporcionais).',2,s=>authorFraction(s,'improvement')),
criterion('m7-risk','Risco identificado por cada integrante (2 XP proporcionais).',2,s=>authorFraction(s,'risk')),
criterion('m7-learning','Aprendizagem pendente de cada integrante (2 XP proporcionais).',2,s=>authorFraction(s,'learning')),
criterion('m7-reviewed','Confirmação de revisão de cada integrante (2 XP proporcionais).',2,s=>authorFraction(s,'reviewed'))]}
];
if(RUBRIC.reduce((a,m)=>a+m.max,0)!==100||RUBRIC.some(m=>m.criteria.reduce((a,c)=>a+c.weight,0)!==m.max))throw Error('Rubrica inválida: os pesos devem totalizar exatamente 100 XP.');
function score(state){const missions=RUBRIC.map(m=>{const criteria=m.criteria.map(c=>{const v=c.test(state),fraction=typeof v==='number'?v:v?1:0;return {id:c.id,label:c.label,weight:c.weight,complete:fraction===1,fraction,earned:c.weight*fraction};});return {id:m.id,title:m.title,max:m.max,xp:criteria.reduce((a,c)=>a+c.earned,0),criteria};});const xp=missions.reduce((a,m)=>a+m.xp,0),pending=missions.flatMap(m=>m.criteria.filter(c=>!c.complete).map(c=>({...c,mission:m.id}))),identification=M.identificationPending(state);const touched=xp>0||Object.values(state.team).some(v=>v===true||present(v))||state.members.length>0||Object.values(state.m1).some(present)||state.m2.techniques.some(t=>Object.entries(t).some(([k,v])=>!['id','role'].includes(k)&&present(v)))||state.m3.questions.some(q=>present(q.purpose)||(q.category!=='fechamento'&&(present(q.text)||present(q.category))))||Object.values(state.m3.observation).some(present)||Object.values(state.m3.document).some(present)||Object.values(state.m3.ai).some(present)||Object.values(state.m4).some(v=>typeof v==='object'?Object.values(v).some(present):present(v))||Object.values(state.m5).some(present)||state.m6.records.some(r=>Object.entries(r).some(([k,v])=>k!=='id'&&present(v)))||present(state.m6.limitation)||present(state.m6.needs);const status=xp===100&&!identification.length?'Completa para revisão':touched?'Em andamento':'Não iniciada';return {xp,grade:Number((xp/10).toFixed(1)),progress:xp,status,missions,pending,identification,authors:state.members.map(m=>({id:m.id,name:m.name,complete:C.FIELDS.author.filter(([k])=>present(m[k])).length+(m.reviewed?1:0),total:5}))};}
return {VERSION:C.VERSION,RUBRIC,score,present,recordComplete,questionComplete};
});
