
(()=>{'use strict';
function init(){
if(window.ppiAula06)return;
const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;},val=id=>$(id)?.value.trim()||'';
const PROFESSOR='Prof. Dr. Thales Levi Azevedo Valente',INSTITUICAO='Instituto Federal do Maranhão — Campus Itapecuru-Mirim',CURSO='Técnico em Informática Integrado ao Ensino Médio',DISCIPLINA='Prática Profissional Integrada I — PPI I';
const PROJETOS={memorias:'Mapa de Memórias Quilombolas',permanencia:'Permanência e Evasão Escolar'};
const CASES={
memorias:{title:'Mapa de Memórias Quilombolas',kind:'Fato histórico documentado + planejamento ético simulado',source:{label:'MuseusBr · Associação de Mulheres de Itamatatiua',url:'https://cadastro.museus.gov.br/pontos-de-memoria/associacao-de-mulheres-de-itamatatiua/'},records:[
['Fonte histórica pública','O cadastro MuseusBr informa que a Associação de Mulheres de Itamatatiua foi fundada em 1989 e teve origem na união das mulheres no então chamado clube de mães.'],
['Planejamento fictício','A equipe considera que uma entrevista futura poderia complementar a memória com um depoimento. Nesta aula, ninguém é contatado ou gravado; a equipe apenas planeja os cuidados necessários.'],
['Alternativa segura para protótipo','Para desenvolver a estrutura do mapa, a equipe pode usar a fonte pública e dados sintéticos até existir um procedimento autorizado para eventual atividade de campo.']],
limit:'A página pública não substitui autorização para entrevistar, gravar, fotografar ou publicar depoimentos de pessoas. O procedimento de campo precisa ser definido pelo professor/instituição antes de qualquer coleta.'},
permanencia:{title:'Permanência e Evasão Escolar',kind:'Situação fictícia + dados sintéticos',records:[
['Tabela sintética para teste','A equipe cria registros fictícios como E01, E02 e E03, com valores inventados de frequência e faixa de rendimento. Esses registros não correspondem a estudantes reais.'],
['Situação de risco fictícia','Uma planilha real com nome, faltas, notas e motivo de saúde permitiria identificar estudantes e incluiria dado sensível de saúde. A turma não deve copiar uma planilha assim para o projeto.'],
['Alternativa segura','Para protótipos e testes, a equipe trabalha com dados sintéticos ou, quando adequado, indicadores agregados previamente fornecidos/autorizados pela instituição.']],
limit:'Os estudantes não têm autorização automática para acessar registros pessoais acadêmicos. Se dados reais forem necessários futuramente, o procedimento deve ser definido e autorizado institucionalmente.'}
};
const TEXT_FIELDS=[
['item','Que dado ou informação o projeto pretende usar?'],
['finalidade','Para que esse dado/informação é necessário?'],
['fonte','De onde ele vem? Qual é a fonte?'],
['acesso','Quem precisa acessar e onde os dados serão guardados?'],
['minimizacao','Qual é o menor conjunto de informações necessário?'],
['autorizacao','Que autorização, consentimento ou validação precisa ser confirmada?'],
['informar','O que precisa ser explicado a quem participa ou fornece dados?'],
['publicacao','Em que condições essa informação poderia ser publicada ou compartilhada?'],
['dataVersao','Qual data, versão ou momento da fonte deve ficar registrado?'],
['transformacoes','O que será transformado, por quem e com qual apoio de IA?'],
['restricoes','Que limites, prazo de guarda e descarte precisam ser definidos?'],
['risco1','Risco 1 — o que pode dar errado?'],
['mitigacao1','Como reduzir o Risco 1?'],
['risco2','Risco 2 — o que pode dar errado?'],
['mitigacao2','Como reduzir o Risco 2?'],
['regraEquipe','Escreva uma regra ética específica da sua equipe.'],
['forca','O que ficou claro na revisão por outra equipe?'],
['ajuste','O que precisa ser melhorado?'],
['proximaAcao','Qual é a próxima ação antes de qualquer coleta ou uso real?']
];
const GUIDES={
memorias:{
item:'Escolha um item concreto. Ex.: fato histórico da fonte pública; ou, apenas como planejamento futuro, nome/voz/depoimento de uma pessoa entrevistada.',
finalidade:'Explique por que o mapa precisa disso. Ex.: documentar um evento histórico com fonte; não “coletar o máximo possível”.',
fonte:'Se usar o evento histórico, identifique MuseusBr. Se falar de entrevista futura, escreva que a fonte ainda seria uma pessoa participante e que a coleta não foi realizada.',
acesso:'Defina pessoas com acesso, local de guarda institucional e proteção do arquivo. Um depoimento identificável não precisa estar público para testar o mapa.',
minimizacao:'Pergunte o que pode ser retirado. Para registrar um evento histórico talvez bastem evento, ano, comunidade, síntese e fonte.',
autorizacao:'Para uma fonte pública, registre a necessidade de respeitar finalidade/fonte. Para entrevista/gravação, escreva “procedimento a confirmar com professor/instituição antes da coleta”.',
informar:'Em uma entrevista futura, a pessoa precisaria entender finalidade, o que seria registrado, quem teria acesso e se algo seria publicado. Nesta aula isso é apenas planejamento.',
publicacao:'Não presuma que depoimento, foto ou áudio poderão ser publicados. Registre condições e dúvidas; a fonte pública pode ser citada sem acrescentar fatos que ela não sustenta.',
dataVersao:'Registre a data de consulta e, quando houver, versão/atualização da fonte. Para entrevista futura, a data seria a da coleta autorizada.',
transformacoes:'Ex.: resumir sem alterar o sentido; registrar quem revisou a transformação. Se houver IA, informe ferramenta, data, finalidade e como a saída foi conferida; se não, registre não utilizada. Não atribua fala inventada a uma pessoa real nem envie dados pessoais à IA.',
restricoes:'Registre limites da fonte, dúvidas e o prazo ou critério de guarda e descarte a confirmar com professor/instituição. Não invente uma autorização nem um prazo legal.',
risco1:'Escolha um risco concreto. Ex.: publicar voz/nome sem procedimento definido; ou perder a referência da fonte.',
mitigacao1:'Ex.: usar dado sintético enquanto não houver autorização; limitar acesso; registrar fonte/data; revisar antes de publicar.',
risco2:'Escolha um segundo risco diferente. Ex.: resumir a fonte e criar uma afirmação que ela não sustenta.',
mitigacao2:'Ex.: revisão por outra pessoa da equipe comparando texto e fonte original.',
regraEquipe:'Ex.: “Nenhum depoimento real entra no protótipo antes de autorização e registro de finalidade”.',
forca:'A equipe revisora deve apontar uma proteção ou decisão que ficou bem explicada.',
ajuste:'Peça uma melhoria verificável, como esclarecer fonte, finalidade, acesso, risco ou autorização pendente.',
proximaAcao:'Ex.: revisar o roteiro com o professor e confirmar quais dados podem ser usados antes de qualquer contato externo.'
},
permanencia:{
item:'Escolha algo que possa ser testado com segurança. Ex.: frequência fictícia, faixa fictícia de rendimento ou indicador agregado. Não use nome/nota/falta real de colega.',
finalidade:'Ligue o dado ao problema. Ex.: testar se o protótipo consegue resumir padrões sem identificar estudantes.',
fonte:'Para dados sintéticos, escreva “criados pela equipe para teste”. Se um indicador agregado vier da instituição no futuro, a fonte deverá ser registrada.',
acesso:'Defina quem acessa, o local de guarda institucional e como evitar compartilhamento indevido. Dados reais não devem circular entre alunos sem procedimento institucional.',
minimizacao:'Retire nomes, contatos e detalhes que não sejam necessários. Prefira faixas, contagens ou valores sintéticos para o protótipo.',
autorizacao:'Escreva que qualquer uso de dado real deve ser confirmado com professor/instituição. A equipe não escolhe sozinha uma base legal.',
informar:'Se houver atividade futura com participantes, registre o que precisaria ser explicado. Para dados sintéticos, escreva que não há participante real.',
publicacao:'Protótipos podem usar dados sintéticos. Não publique planilhas acadêmicas reais ou informações que permitam identificar estudantes.',
dataVersao:'Para sintéticos, registre a versão do conjunto de teste. Para dados institucionais futuros, registre data/competência e fonte.',
transformacoes:'Ex.: calcular faixas com valores inventados e registrar quem conferiu. Se houver IA, informe ferramenta, data, finalidade e verificação; se não, registre não utilizada. Não envie dados pessoais à IA e não trate a saída como evidência por si só.',
restricoes:'Ex.: conjunto apenas para teste, sem representar estudantes reais. Defina prazo ou critério de guarda/descarte conforme orientação institucional e registre dúvidas pendentes.',
risco1:'Ex.: alguém interpretar dado sintético como registro real; ou um protótipo exibir campos pessoais desnecessários.',
mitigacao1:'Ex.: rotular claramente como sintético; remover campos pessoais; usar apenas valores fictícios.',
risco2:'Ex.: grupo agregado muito pequeno permitir inferir uma pessoa; ou arquivo real ser copiado por engano.',
mitigacao2:'Ex.: aumentar agregação, limitar acesso e manter dados reais fora do ambiente da turma.',
regraEquipe:'Ex.: “Todo teste do protótipo será feito com dados sintéticos claramente identificados”.',
forca:'A revisão deve apontar algo concreto: minimização, proveniência, mitigação ou limite de acesso.',
ajuste:'Registre uma melhoria verificável. Ex.: remover campo sem finalidade ou deixar mais claro que o conjunto é sintético.',
proximaAcao:'Ex.: gerar a versão sintética do conjunto e pedir ao professor validação do protocolo antes da próxima aula.'
}
};
const PROTOCOL=[
'Usaremos somente informações necessárias para a finalidade definida.',
'Não copiaremos dados pessoais reais de colegas ou terceiros sem procedimento autorizado.',
'Preferiremos dados sintéticos ou agregados para protótipos e testes quando possível.',
'Registraremos fonte, data/versão e transformações relevantes.',
'Limitaremos o acesso ao que cada pessoa realmente precisa para a atividade.',
'Não publicaremos depoimento, imagem, voz ou registro pessoal sem procedimento e autorização definidos.',
'Antes de publicar, outra pessoa da equipe conferirá fonte, contexto e riscos.',
'Seguiremos a orientação institucional sobre armazenamento, guarda e descarte dos dados.'
];
const SELECTS={
identifica:['Selecione','Não identifica pessoa','Pode identificar por combinação','Identifica uma pessoa','Ainda não sabemos'],
sensivel:['Selecione','Não parece envolver dado sensível','Pode envolver dado sensível','Envolve dado sensível','Ainda não sabemos'],
estrategia:['Selecione','Sintético','Agregado','Anonimizado — a confirmar','Identificado — precisa de procedimento','Não se aplica']
};
// XP registra o preenchimento atual. Não avalia a correção nem concede autorização.
const MISSIONS = [
  {id:'part-1',label:'Informação',fields:[['item',5],['finalidade',5],['fonte',5],['acesso',5]]},
  {id:'part-2',label:'Classificação',fields:[['identifica',4],['sensivel',4],['estrategia',4],['minimizacao',8]]},
  {id:'part-3',label:'Autorização',fields:[['autorizacao',5],['informar',5],['publicacao',5]]},
  {id:'part-4',label:'Proveniência',fields:[['dataVersao',5],['transformacoes',5],['restricoes',5]]},
  {id:'part-5',label:'Riscos',fields:[['risco1',3],['prob1',1],['impacto1',1],['mitigacao1',3],['risco2',3],['prob2',1],['impacto2',1],['mitigacao2',3]]},
  {id:'part-6',label:'Protocolo',fields:[['regraEquipe',4]]},
  {id:'part-7',label:'Revisão',fields:[['forca',3],['ajuste',3],['proximaAcao',4]]}
];
const LABELS = Object.fromEntries(TEXT_FIELDS);
Object.assign(LABELS, {identifica:'A informação identifica alguém?',sensivel:'Pode envolver dado sensível?',estrategia:'Estratégia de dados',prob1:'Chance do risco 1',impacto1:'Impacto do risco 1',prob2:'Chance do risco 2',impacto2:'Impacto do risco 2'});
const SCORED_FIELDS = MISSIONS.flatMap(m=>m.fields);
const XP_DESCRIPTION = 'XP de preparação: registra respostas preenchidas, sem avaliar sua correção. Campos em branco valem zero; o máximo permanece 100 XP. Identificação e compromissos não pontuam. A nota automática desta atividade é XP / 10 (0 a 10), mede preenchimento e não a correção conceitual. A ficha não autoriza coleta, uso ou publicação de dados.';
const EMPTY = '[Não respondido]';
const MAX_MEMBERS = 30;
let memberId=0, previousProject='', previousFormScroll=0, lastAnnouncedScore='';
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dateOK(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number),x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d;}
const prettyDate=d=>dateOK(d)?d.split('-').reverse().join('/'):'Não informada';
function status(t){$('status').textContent=t;}
function focusElement(node){if(node){node.focus({preventScroll:true});node.scrollIntoView({block:'nearest'});}}
function addMember(v='',focus=false){
  if(document.querySelectorAll('.member-name').length>=MAX_MEMBERS){status('Limite de '+MAX_MEMBERS+' componentes por ficha.');return;}
  const row=el('div',undefined,'member-row'),lab=el('label'),inp=el('input'),btn=el('button','Remover','secondary');
  inp.type='text';inp.maxLength=120;inp.className='member-name';inp.id='componente-'+(++memberId);inp.value=v;inp.autocomplete='off';
  lab.htmlFor=inp.id;lab.append(el('span'),inp);btn.type='button';
  btn.addEventListener('click',()=>{
    const rows=[...document.querySelectorAll('.member-row')],index=rows.indexOf(row);
    row.remove();if(!document.querySelector('.member-name'))addMember();renumber();
    const remaining=[...document.querySelectorAll('.member-name')];focusElement(remaining[Math.min(index,remaining.length-1)]);
  });
  row.append(lab,btn);$('members-list').append(row);renumber();if(focus)focusElement(inp);
}
function renumber(){
  const rows=[...document.querySelectorAll('.member-row')];
  rows.forEach((r,i)=>{r.querySelector('label span').textContent='Componente '+(i+1)+' (opcional)';r.querySelector('button').setAttribute('aria-label','Remover componente '+(i+1));});
  $('members-status').textContent=rows.length+' campo(s). Podem ficar em branco.';
  $('addMember').disabled=rows.length>=MAX_MEMBERS;
}
function members(){return [...document.querySelectorAll('.member-name')].map(x=>x.value.trim()).filter(Boolean);}
function caseView(){
  const root=$('caseMaterial'),p=val('projeto');root.replaceChildren();
  if(!CASES[p]){root.append(el('h3','Uma situação para apoiar a análise'),el('p','Escolha um projeto na identificação para ver as dicas específicas. Você pode responder e exportar mesmo sem escolher um projeto.'));updateHints();return;}
  const c=CASES[p];root.append(el('h3',c.title),el('p',c.kind,'case-kind'));
  for(const [k,t]of c.records){const para=el('p');para.append(el('b',k+' — '),document.createTextNode(t));root.append(para);}
  if(c.source){const para=el('p');const a=el('a',c.source.label+' (nova aba)');a.href=c.source.url;a.target='_blank';a.rel='noopener noreferrer';a.className='source-link';para.append(el('b','Fonte pública — '),a);root.append(para);}
  root.append(el('p','Limite importante — '+c.limit));updateHints();
}
function fieldPoints(id){return SCORED_FIELDS.find(([key])=>key===id)?.[1]||0;}
function fieldCard(id,label){
  const card=el('div',undefined,'field-card');card.id='field-'+id;
  const lab=el('label',label);lab.htmlFor=id;
  const meta=el('p',fieldPoints(id)+' XP ao registrar uma resposta · pode deixar em branco','field-meta');meta.id=id+'-points';
  const hint=el('p','Escolha o projeto para receber uma dica específica.','project-hint');hint.id=id+'-hint';
  const ta=el('textarea');ta.id=id;ta.name=id;ta.rows=3;ta.maxLength=3000;ta.placeholder='Escreva com suas palavras ou registre uma dúvida concreta.';ta.setAttribute('aria-describedby',hint.id+' '+meta.id);
  card.append(lab,meta,hint,ta);return card;
}
function selectField(id,label){
  const box=el('div',undefined,'field'),lab=el('label',label),sel=el('select');
  lab.htmlFor=id;sel.id=id;sel.name=id;
  for(const [i,o] of SELECTS[id].entries()){const op=el('option',i?o:'Não respondido');op.value=i?o:'';sel.append(op);}
  const note=el('small',fieldPoints(id)+' XP ao registrar uma opção; uma dúvida também é uma resposta.');note.id=id+'-hint';sel.setAttribute('aria-describedby',note.id);box.append(lab,sel,note);return box;
}
function section(id,title,note){const s=el('section',undefined,'panel mission-panel');s.id=id;const heading=el('h2',title);heading.id=id+'-title';heading.tabIndex=-1;s.setAttribute('aria-labelledby',heading.id);const head=el('div',undefined,'section-head');const badge=el('span','0 XP','mission-badge');badge.id=id+'-badge';head.append(heading,badge);s.append(head);if(note)s.append(el('p',note,'section-note'));return s;}
function buildForm(){
  const host=$('activity-sections');
  const s1=section('part-1','1 · Escolham a informação','Registrem o que será usado, a finalidade, a fonte e o acesso.');const details=el('details',undefined,'case-details');details.append(el('summary','Consultar a situação de análise'));const c=el('div',undefined,'case');c.id='caseMaterial';details.append(c);s1.append(details);const g1=el('div',undefined,'grid');['item','finalidade','fonte','acesso'].forEach(id=>g1.append(fieldCard(id,LABELS[id])));s1.append(g1);host.append(s1);
  const s2=section('part-2','2 · Classifiquem antes de usar','Trocar nomes por códigos é pseudonimização quando ainda é possível relacionar o registro a alguém. Dados agregados também podem identificar pessoas em grupos pequenos. Registrem dúvidas.');const cg=el('div',undefined,'classification-grid');cg.append(selectField('identifica',LABELS.identifica),selectField('sensivel',LABELS.sensivel),selectField('estrategia','Qual estratégia de dados será usada?'));s2.append(cg,fieldCard('minimizacao',LABELS.minimizacao));host.append(s2);
  const s3=section('part-3','3 · Definam autorização e limites','Consentimento é uma das bases legais possíveis e não elimina outros cuidados. A turma não define sozinha a base legal. Crianças e adolescentes exigem atenção ao melhor interesse; antes de uma atividade real, confirmem o procedimento institucional.');const g3=el('div',undefined,'grid');['autorizacao','informar','publicacao'].forEach(id=>g3.append(fieldCard(id,LABELS[id])));s3.append(g3);host.append(s3);
  const s4=section('part-4','4 · Registrem a proveniência','Guardem o caminho da informação: fonte, data/versão, mudanças, responsáveis e limites. Se usarem IA, declarem o apoio e confiram a saída.');const g4=el('div',undefined,'grid');['dataVersao','transformacoes','restricoes'].forEach(id=>g4.append(fieldCard(id,LABELS[id])));s4.append(g4);host.append(s4);
  const s5=section('part-5','5 · Analisem dois riscos','O índice de risco é chance × impacto: 1–2 baixo, 3–4 moderado e 6–9 alto. É uma prioridade didática, separada dos XP. Um índice baixo não autoriza a prática.');
  for(let n=1;n<=2;n++){
    const wrap=el('fieldset',undefined,'risk-block');wrap.append(el('legend','Risco '+n));
    const grid=el('div',undefined,'grid');grid.append(fieldCard('risco'+n,LABELS['risco'+n]));
    const row=el('div',undefined,'risk-row');
    for(const [prefix,label,options]of [['prob','Chance',['1 · Baixa','2 · Média','3 · Alta']],['impacto','Impacto',['1 · Baixo','2 · Médio','3 · Alto']]]){
      const box=el('div',undefined,'field'),lab=el('label',label),sel=el('select');sel.id=prefix+n;sel.name=sel.id;lab.htmlFor=sel.id;
      const empty=el('option','Não respondido');empty.value='';sel.append(empty);options.forEach((t,i)=>{const o=el('option',t);o.value=String(i+1);sel.append(o);});
      const hint=el('small','1 XP ao registrar');hint.id=sel.id+'-hint';sel.setAttribute('aria-describedby',hint.id);box.append(lab,sel,hint);row.append(box);
      sel.addEventListener('change',()=>scoreRisk(n));
    }
    const score=el('p','Índice pendente: escolha chance e impacto.','score-box');score.id='score'+n;score.setAttribute('role','status');row.append(score);
    grid.append(row,fieldCard('mitigacao'+n,LABELS['mitigacao'+n]));wrap.append(grid);s5.append(wrap);
  }
  host.append(s5);
  const s6=section('part-6','6 · Definam o protocolo da equipe','Marquem apenas compromissos que a equipe realmente assume. Esses compromissos não dão XP: deixá-los em aberto não impede exportar.');const checks=el('fieldset',undefined,'protocol-checks');checks.append(el('legend','Compromissos da equipe (sem pontuação)'));PROTOCOL.forEach((t,i)=>{const lab=el('label'),inp=el('input');inp.type='checkbox';inp.id='protocol-'+i;lab.append(inp,el('span',t));checks.append(lab);});s6.append(checks,fieldCard('regraEquipe',LABELS.regraEquipe));host.append(s6);
  const s7=section('part-7','7 · Revisem e planejem a próxima ação','A revisão por pares aponta clareza e melhorias; não aprova juridicamente o projeto. Se a revisão ainda não ocorreu, vocês podem deixar os campos pendentes.');const g7=el('div',undefined,'grid');['forca','ajuste','proximaAcao'].forEach(id=>g7.append(fieldCard(id,LABELS[id])));s7.append(g7);host.append(s7);
}
function updateHints(){const g=GUIDES[val('projeto')];document.querySelectorAll('.field-card').forEach(card=>{const id=card.id.replace('field-',''),hint=$(id+'-hint');if(hint)hint.textContent=g?.[id]||'Registre uma resposta específica. Se houver dúvida, diga o que falta confirmar e com quem.';});}
function riskValue(n){const p=val('prob'+n),i=val('impacto'+n);return /^[123]$/.test(p)&&/^[123]$/.test(i)?Number(p)*Number(i):0;}
function scoreRisk(n){const score=riskValue(n),box=$('score'+n);box.className='score-box';if(!score){box.textContent='Índice pendente: escolha chance e impacto.';return 0;}const level=score<=2?'Baixo':score<=4?'Moderado':'Alto';box.textContent='Índice de risco: '+score+' · '+level+' (não é XP)';box.classList.add(level==='Alto'?'high':level==='Moderado'?'medium':'low');return score;}
function isAnswered(id){const value=val(id);if(SELECTS[id])return SELECTS[id].slice(1).includes(value);if(/^(prob|impacto)[12]$/.test(id))return /^[123]$/.test(value);return value.length>0;}
function scoring(){
  const missions=MISSIONS.map(m=>{const answered=m.fields.filter(([id])=>isAnswered(id)).length;return {label:m.label,earned:m.fields.reduce((sum,[id,points])=>sum+(isAnswered(id)?points:0),0),max:m.fields.reduce((sum,[,points])=>sum+points,0),answered,total:m.fields.length,status:answered===m.fields.length?'Registrada':answered?'Em andamento':'Não iniciada'};});
  const answered=missions.reduce((sum,m)=>sum+m.answered,0),pending=SCORED_FIELDS.length-answered;
  const earned=missions.reduce((sum,m)=>sum+m.earned,0);
  return {label:'XP e nota automática da ficha',earned,grade:earned/10,max:100,answered,total:SCORED_FIELDS.length,pending,status:pending?'Em andamento':'Registros completos',description:XP_DESCRIPTION,missions};
}
function pendingFields(){return SCORED_FIELDS.filter(([id])=>!isAnswered(id)).map(([id,points])=>({id,label:LABELS[id],points}));}
function pendingText(){const missing=pendingFields();return missing.length?missing.map(x=>x.label+' — não respondido; 0 de '+x.points+' XP.').join('\n'):'Todos os campos pontuáveis possuem uma resposta. A qualidade das respostas ainda depende de revisão.';}
function updateProgress(announce=false){
  const s=scoring();$('xp-value').textContent=s.earned+' / '+s.max+' XP · Nota '+s.grade.toFixed(1).replace('.',',')+'/10';$('xp-count').textContent=s.answered+' de '+s.total+' respostas registradas · '+s.pending+' pendentes';$('xp-status').textContent=s.status;
  $('xp-progress').value=s.earned;$('xp-progress').setAttribute('aria-valuetext',s.earned+' de 100 XP de preparação; '+s.pending+' respostas pendentes');
  MISSIONS.forEach((m,i)=>{$(m.id+'-badge').textContent=s.missions[i].earned+' / '+s.missions[i].max+' XP';const nav=$('nav-'+m.id);nav.querySelector('.mission-points').textContent=s.missions[i].earned+' / '+s.missions[i].max+' XP';nav.dataset.complete=String(s.missions[i].answered===s.missions[i].total);nav.removeAttribute('aria-label');});
  $('save-progress').textContent=s.earned+' / 100 XP · Nota '+s.grade.toFixed(1).replace('.',',')+'/10 · '+s.pending+' resposta(s) pendente(s). O PDF e a impressão preservam esta pontuação.';
  const list=$('pending-list');list.replaceChildren();for(const x of pendingFields()){const li=el('li'),a=el('a',x.label+' · '+x.points+' XP possíveis');a.href='#'+x.id;a.addEventListener('click',()=>focusElement($(x.id)));li.append(a);list.append(li);}
  if(!list.childNodes.length)list.append(el('li','Nenhuma resposta em branco. Revisem a coerência antes da entrega.'));
  const summary=s.earned+' XP; nota '+s.grade.toFixed(1).replace('.',',')+' de 10; '+s.answered+' respostas registradas e '+s.pending+' pendentes.';
  if(announce&&summary!==lastAnnouncedScore){$('progress-announcement').textContent=summary;lastAnnouncedScore=summary;}
}
function buildRubric(){
  const list=$('rubric-list');MISSIONS.forEach((m,i)=>{const li=el('li'),b=el('strong',(i+1)+'. '+m.label+' · '+m.fields.reduce((a,[,p])=>a+p,0)+' XP'),p=el('p',m.fields.map(([id,points])=>LABELS[id]+' ('+points+' XP)').join('; ')+'.');li.append(b,p);list.append(li);});
}
function snapshot(){
  const campos={};TEXT_FIELDS.forEach(([id])=>campos[id]=val(id));Object.keys(SELECTS).forEach(id=>campos[id]=val(id));
  for(let n=1;n<=2;n++){campos['prob'+n]=val('prob'+n);campos['impacto'+n]=val('impacto'+n);campos['score'+n]=String(riskValue(n)||'');}
  return {schema:'ppi-f02-v1',version:'2.0.0',identificacao:{instituicao:INSTITUICAO,curso:CURSO,disciplina:DISCIPLINA,professor:PROFESSOR,equipe:val('equipe'),componentes:members(),projeto:val('projeto'),data:val('dataAtividade')},campos,protocolo:PROTOCOL.map((t,i)=>({texto:t,marcado:$('protocol-'+i).checked})),scoring:scoring(),pendencias:pendingFields().map(x=>x.label)};
}
function riskText(s,n){const c=s.campos,p=c['prob'+n],i=c['impacto'+n],score=c['score'+n];return (c['risco'+n]||EMPTY)+'\nChance: '+(p||EMPTY)+' | Impacto: '+(i||EMPTY)+'\nÍndice de risco (não é XP): '+(score||'Pendente: faltam chance e/ou impacto.')+'\nMitigação: '+(c['mitigacao'+n]||EMPTY);}
function documentModel(){
  const s=snapshot(),id=s.identificacao;
  return {title:'Protocolo Ético e Matriz de Riscos',institution:INSTITUICAO,course:CURSO,discipline:DISCIPLINA,lesson:'Aula 06 — Ética e Proteção de Dados',professor:PROFESSOR,team:id.equipe||'Não informada',members:id.componentes,project:PROJETOS[id.projeto]||'Não informado',date:prettyDate(id.data),version:'2.0',scoring:s.scoring,sections:[
    {title:'1. Informação planejada',items:[['Dado ou informação',s.campos.item||EMPTY],['Finalidade',s.campos.finalidade||EMPTY],['Fonte/origem',s.campos.fonte||EMPTY],['Acesso e local de guarda',s.campos.acesso||EMPTY]]},
    {title:'2. Classificação e minimização',items:[['Identificação',s.campos.identifica||EMPTY],['Sensibilidade',s.campos.sensivel||EMPTY],['Estratégia de dados',s.campos.estrategia||EMPTY],['Minimização',s.campos.minimizacao||EMPTY]]},
    {title:'3. Autorização e limites',items:[['Autorização/consentimento/validação',s.campos.autorizacao||EMPTY],['O que precisa ser explicado',s.campos.informar||EMPTY],['Publicação/compartilhamento',s.campos.publicacao||EMPTY]]},
    {title:'4. Proveniência',items:[['Data/versão',s.campos.dataVersao||EMPTY],['Transformações, responsável e uso de IA',s.campos.transformacoes||EMPTY],['Restrições, guarda, descarte e dúvidas',s.campos.restricoes||EMPTY]]},
    {title:'5. Matriz de riscos',items:[['Risco 1',riskText(s,1)],['Risco 2',riskText(s,2)]]},
    {title:'6. Protocolo ético (compromissos sem XP)',items:[...s.protocolo.map((x,i)=>['Regra '+(i+1),x.texto+'\nSituação: '+(x.marcado?'assumida pela equipe.':'decisão ainda não registrada; precisa ser discutida pela equipe.')]),['Regra específica',s.campos.regraEquipe||EMPTY]]},
    {title:'7. Revisão e próxima ação',items:[['Ponto claro',s.campos.forca||EMPTY],['Melhoria necessária',s.campos.ajuste||EMPTY],['Próxima ação',s.campos.proximaAcao||EMPTY]]},
    {title:'8. Pendências registradas',items:[['Campos sem resposta (não impedem exportar)',pendingText()],['Identificação opcional',(!id.equipe?'Equipe não informada.\n':'')+(!id.componentes.length?'Componentes não informados.\n':'')+(!id.projeto?'Projeto não informado.\n':'')+(!id.data?'Data não informada.':'')||'Identificação preenchida.'],['Limite da atividade','A nota automática é XP / 10 e mede preenchimento, não correção conceitual, conformidade ou autorização institucional.']]}
  ]};
}
function md(){
  const m=documentModel(),s=m.scoring;let out='# '+m.title+'\n\n'+m.institution+'\n\n**Curso:** '+m.course+'\n\n**Disciplina:** '+m.discipline+'\n\n**Aula:** '+m.lesson+'\n\n**Professor:** '+m.professor+'\n\n**Equipe:** '+m.team+'\n\n**Componentes:**\n'+(m.members.length?m.members.map(x=>'- '+x).join('\n'):'Não informados')+'\n\n**Projeto:** '+m.project+'\n\n**Data:** '+m.date+'\n\n## Pontuação atual\n\n**'+s.label+': '+s.earned+' / '+s.max+' XP**\n\n'+'Nota automática: '+s.grade.toFixed(1).replace('.',',')+' / 10\n\n'+s.answered+' de '+s.total+' respostas registradas; '+s.pending+' pendentes.\n\n'+s.description+'\n\n';
  for(const mission of s.missions)out+='- '+mission.label+': '+mission.earned+' / '+mission.max+' XP — '+mission.status+'.\n';out+='\n';
  for(const sec of m.sections){out+='## '+sec.title+'\n\n';for(const [l,t]of sec.items)out+='### '+l+'\n\n'+t+'\n\n';}return out;
}
function download(data,type,name){const b=data instanceof Blob?data:new Blob([data],{type}),u=URL.createObjectURL(b),a=el('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}
function prefix(){const team=(val('equipe')||'equipe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40)||'equipe';return 'ppi1_aula06_'+team+'_protocolo_etico';}
function renderDocument(){
  const m=documentModel(),s=m.scoring,root=$('document-content');root.replaceChildren();
  const head=el('header',undefined,'doc-cover');head.append(el('p','IFMA · Campus Itapecuru-Mirim','doc-brand'));const title=el('h1',m.title);title.id='document-title';title.tabIndex=-1;head.append(title,el('p',m.lesson,'doc-subtitle'));
  const meta=el('dl',undefined,'doc-meta');for(const [label,value]of [['Projeto',m.project],['Equipe',m.team],['Componentes',m.members.join('; ')||'Não informados'],['Data',m.date],['Professor',m.professor]]){const div=el('div');div.append(el('dt',label),el('dd',value));meta.append(div);}head.append(meta);
  const score=el('section',undefined,'doc-score');score.append(el('h2',s.label),el('p',s.earned+' / '+s.max+' XP','doc-score-value'),el('p','Nota automática (XP / 10): '+s.grade.toFixed(1).replace('.',',')+' / 10'),el('p',s.answered+' de '+s.total+' respostas registradas · '+s.pending+' pendentes'),el('p',s.description,'doc-note'));const missions=el('ul');for(const x of s.missions)missions.append(el('li',x.label+': '+x.earned+' / '+x.max+' XP · '+x.status));score.append(missions);head.append(score);root.append(head);
  const body=el('div',undefined,'doc-body');for(const sec of m.sections){const block=el('section',undefined,'doc-section');block.append(el('h2',sec.title));for(const [label,value]of sec.items){const field=el('div',undefined,'doc-field');field.append(el('h3',label),el('p',value));block.append(field);}body.append(block);}root.append(body,el('footer','PPI I · Aula 06 · Registro local · Versão '+m.version,'doc-footer'));
}
function showDocument(message=''){previousFormScroll=scrollY;renderDocument();document.body.classList.add('document-mode');$('document-view').hidden=false;$('document-status').textContent=message||'Documento parcial permitido. Confira a pontuação e as pendências antes de imprimir.';window.scrollTo(0,0);focusElement($('document-title'));}
function normalizeDraft(d){
  const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  if(!record(d)||d.schema!=='ppi-f02-v1')throw Error('Arquivo não reconhecido como rascunho da Aula 06.');
  if(!record(d.identificacao)||!record(d.campos))throw Error('O rascunho deve conter identificação e campos válidos.');
  const read=(obj,key,max=3000)=>{const value=obj[key];if(value===undefined)return '';if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))throw Error('Valor inválido no campo '+key+'.');return value;};
  const id=d.identificacao,c=d.campos,normalized={identificacao:{equipe:read(id,'equipe',120),data:read(id,'data',10),projeto:read(id,'projeto',30),componentes:[]},campos:{},protocolo:[]};
  if(normalized.identificacao.data&&!dateOK(normalized.identificacao.data))throw Error('Data inválida no rascunho.');
  if(normalized.identificacao.projeto&&!Object.hasOwn(PROJETOS,normalized.identificacao.projeto))throw Error('Projeto desconhecido no rascunho.');
  const components=id.componentes===undefined?[]:id.componentes;
  if(!Array.isArray(components)||components.length>MAX_MEMBERS)throw Error('A lista de componentes é inválida.');
  normalized.identificacao.componentes=components.map((v,i)=>read({value:v},'value',120));
  TEXT_FIELDS.forEach(([key])=>normalized.campos[key]=read(c,key));
  for(const key of Object.keys(SELECTS)){const value=read(c,key,100);if(value&&!SELECTS[key].slice(1).includes(value))throw Error('Opção inválida no campo '+key+'.');normalized.campos[key]=value;}
  for(const key of ['prob1','impacto1','prob2','impacto2']){const value=read(c,key,1);if(value&&!/^[123]$/.test(value))throw Error('Chance/impacto fora da escala de 1 a 3.');normalized.campos[key]=value;}
  const protocol=d.protocolo===undefined?[]:d.protocolo;if(!Array.isArray(protocol)||protocol.length>PROTOCOL.length)throw Error('Lista de compromissos inválida.');
  PROTOCOL.forEach((_,i)=>{const item=protocol[i];if(item!==undefined&&(!record(item)||typeof item.marcado!=='boolean'))throw Error('Compromisso inválido no rascunho.');normalized.protocolo.push({marcado:item?.marcado||false});});
  return normalized;
}
function applyDraft(d){
  const id=d.identificacao,c=d.campos;$('equipe').value=id.equipe;$('dataAtividade').value=id.data;$('projeto').value=id.projeto;
  $('members-list').replaceChildren();(id.componentes.length?id.componentes:['','','']).forEach(x=>addMember(x));
  [...TEXT_FIELDS.map(([key])=>key),...Object.keys(SELECTS),'prob1','impacto1','prob2','impacto2'].forEach(key=>$(key).value=c[key]);
  PROTOCOL.forEach((_,i)=>$('protocol-'+i).checked=d.protocolo[i].marcado);previousProject=id.projeto;caseView();scoreRisk(1);scoreRisk(2);updateProgress(true);
  status('Rascunho reaberto. Os XP foram recalculados pelas respostas atuais; valores de pontuação do arquivo não são usados.');
}
function restore(d){applyDraft(normalizeDraft(d));}
function clearAll(){if(!confirm('Apagar todas as respostas e a identificação desta ficha? Os arquivos que você já baixou não serão alterados.'))return;$('worksheet').reset();$('members-list').replaceChildren();for(let i=0;i<3;i++)addMember();$('dataAtividade').value=today();previousProject='';caseView();scoreRisk(1);scoreRisk(2);updateProgress(true);status('Ficha limpa. Pontuação atual: 0 / 100 XP.');focusElement($('equipe'));}
buildForm();buildRubric();for(let i=0;i<3;i++)addMember();$('dataAtividade').value=today();caseView();updateProgress();
$('worksheet').addEventListener('submit',e=>e.preventDefault());
$('worksheet').addEventListener('input',()=>updateProgress(false));
$('worksheet').addEventListener('change',()=>updateProgress(true));
$('worksheet').addEventListener('focusout',e=>{if(e.target.matches('textarea,input,select'))updateProgress(true);});
$('addMember').addEventListener('click',()=>addMember('',true));
$('projeto').addEventListener('change',()=>{const p=val('projeto'),has=TEXT_FIELDS.some(([id])=>val(id));if(previousProject&&p!==previousProject&&has&&!confirm('Trocar o projeto? As respostas serão preservadas, mas precisarão ser revisadas com as novas dicas.')){$('projeto').value=previousProject;return;}previousProject=p;caseView();});
$('exportPdf').addEventListener('click',()=>{
  try{
    const model=documentModel(),bytes=window.PpiPdf.generate(model);
    download(bytes,'application/pdf',prefix()+'.pdf');
    status('PDF gerado localmente com '+model.scoring.earned+
      ' / 100 XP; nota '+model.scoring.grade.toFixed(1).replace('.',',')+'/10. Nenhuma informação foi enviada ao professor.');
  }catch(err){
    const msg='Não foi possível gerar o PDF direto. '+
      (err?.message||'')+' Use a versão de impressão para preservar a atividade.';
    status(msg);showDocument(msg);
  }
});
$('submitActivity').addEventListener('click',async()=>{
  const btn=$('submitActivity');
  if(!members().length){
    status('Para entregar, informe o nome completo dos integrantes. '+
      'A exportação local continua disponível.');
    return;
  }
  btn.disabled=true;
  try{
    const responses=snapshot(),model=documentModel();
    const bytes=window.PpiPdf.generate(model);
    download(bytes,'application/pdf',prefix()+'.pdf');
    status('PDF baixado. Registrando respostas e SHA-256 da entrega...');
    const receipt=await window.PpiEntrega.enviar(responses,bytes);
    status('Entrega CONFIRMADA. ID: '+receipt.deliveryId+
      '\nHorário UTC: '+receipt.receivedAt+
      '\nSHA-256 PDF: '+receipt.pdfSha256+
      '\nXP: '+receipt.xp+'/100. Nota automática: '+Number(receipt.grade).toFixed(1).replace('.',',')+'/10. '+
      'Guarde o PDF e este recibo.');
  }catch(err){
    status('ENTREGA NÃO CONFIRMADA: '+(err?.message||'Falha de envio.')+
      ' O PDF baixado permanece com a equipe, mas não comprova envio.');
  }finally{
    btn.disabled=false;
  }
});
$('exportMd').addEventListener('click',()=>{download(md(),'text/markdown;charset=utf-8',prefix()+'.md');status('Texto gerado com a pontuação atual e as pendências.');});
$('exportJson').addEventListener('click',()=>{download(JSON.stringify(snapshot(),null,2),'application/json;charset=utf-8',prefix()+'.json');status('Rascunho guardado. Respostas e identificação estão no arquivo; compartilhe apenas com quem precisa.');});
$('printView').addEventListener('click',()=>showDocument());
$('backToForm').addEventListener('click',()=>{document.body.classList.remove('document-mode');$('document-view').hidden=true;window.scrollTo(0,previousFormScroll);$('printView').focus({preventScroll:true});});
$('printDocument').addEventListener('click',()=>window.print());
$('clearBtn').addEventListener('click',clearAll);
$('importFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>512*1024)throw Error('O arquivo deve ter no máximo 512 KB.');const normalized=normalizeDraft(JSON.parse(await file.text()));if(!confirm('Reabrir este rascunho e substituir o preenchimento atual?'))return;applyDraft(normalized);}catch(err){status('Não foi possível abrir o rascunho. Seu preenchimento foi preservado. '+err.message);}finally{e.target.value='';}});
window.addEventListener('beforeprint',renderDocument);
window.ppiAula06=Object.freeze({snapshot,documentModel,scoring,restore,renderDocument});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
