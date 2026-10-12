
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
['acesso','Quem realmente precisa acessar essa informação?'],
['minimizacao','Qual é o menor conjunto de informações necessário?'],
['autorizacao','Que autorização, consentimento ou validação precisa ser confirmada?'],
['informar','O que precisa ser explicado a quem participa ou fornece dados?'],
['publicacao','Em que condições essa informação poderia ser publicada ou compartilhada?'],
['dataVersao','Qual data, versão ou momento da fonte deve ficar registrado?'],
['transformacoes','Que transformação será feita nos dados?'],
['restricoes','Que restrições, limites ou dúvidas precisam acompanhar o dado?'],
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
acesso:'Para o protótipo, normalmente basta a equipe e o professor. Um depoimento identificável não precisa estar público para a equipe testar o mapa.',
minimizacao:'Pergunte o que pode ser retirado. Para registrar um evento histórico talvez bastem evento, ano, comunidade, síntese e fonte.',
autorizacao:'Para uma fonte pública, registre a necessidade de respeitar finalidade/fonte. Para entrevista/gravação, escreva “procedimento a confirmar com professor/instituição antes da coleta”.',
informar:'Em uma entrevista futura, a pessoa precisaria entender finalidade, o que seria registrado, quem teria acesso e se algo seria publicado. Nesta aula isso é apenas planejamento.',
publicacao:'Não presuma que depoimento, foto ou áudio poderão ser publicados. Registre condições e dúvidas; a fonte pública pode ser citada sem acrescentar fatos que ela não sustenta.',
dataVersao:'Registre a data de consulta e, quando houver, versão/atualização da fonte. Para entrevista futura, a data seria a da coleta autorizada.',
transformacoes:'Ex.: resumir um texto mantendo o sentido; criar campos sintéticos para testar a interface. Não atribua fala inventada a uma pessoa real.',
restricoes:'Ex.: “não publicar entrevista sem autorização definida”; “não inferir finalidade da associação que a fonte não informa”.',
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
acesso:'Defina quem precisa ver os registros de teste. Dados reais, se existirem futuramente, não devem circular entre alunos sem procedimento institucional.',
minimizacao:'Retire nomes, contatos e detalhes que não sejam necessários. Prefira faixas, contagens ou valores sintéticos para o protótipo.',
autorizacao:'Escreva que qualquer uso de dado real deve ser confirmado com professor/instituição. A equipe não escolhe sozinha uma base legal.',
informar:'Se houver atividade futura com participantes, registre o que precisaria ser explicado. Para dados sintéticos, escreva que não há participante real.',
publicacao:'Protótipos podem usar dados sintéticos. Não publique planilhas acadêmicas reais ou informações que permitam identificar estudantes.',
dataVersao:'Para sintéticos, registre a versão do conjunto de teste. Para dados institucionais futuros, registre data/competência e fonte.',
transformacoes:'Ex.: transformar valores inventados em faixas ou calcular agregados. Se partir de dado real no futuro, a transformação precisará ser documentada.',
restricoes:'Ex.: “conjunto apenas para teste”; “não representa estudantes reais”; “dados reais dependem de autorização institucional”.',
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
let memberId=0,previousProject='';
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dateOK(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number),x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d;}
const prettyDate=d=>dateOK(d)?d.split('-').reverse().join('/'):'[A preencher]';
function status(t){$('status').textContent=t;}
function addMember(v='',focus=false){const row=el('div',undefined,'member-row'),lab=el('label'),inp=el('input'),btn=el('button','Remover','secondary');inp.type='text';inp.maxLength=120;inp.className='member-name';inp.id='componente-'+(++memberId);inp.value=v;lab.htmlFor=inp.id;lab.append(el('span'),inp);btn.type='button';btn.addEventListener('click',()=>{row.remove();if(!document.querySelector('.member-name'))addMember();renumber();});row.append(lab,btn);$('members-list').append(row);renumber();if(focus)inp.focus();}
function renumber(){[...document.querySelectorAll('.member-row')].forEach((r,i)=>r.querySelector('label span').textContent='Componente '+(i+1));$('members-status').textContent=document.querySelectorAll('.member-name').length+' campo(s) de componente.';}
function members(){return [...document.querySelectorAll('.member-name')].map(x=>x.value.trim()).filter(Boolean);}
function caseView(){const root=$('caseMaterial'),p=val('projeto');root.replaceChildren();if(!CASES[p]){root.append(el('h3','Situação de análise'),el('p','Selecione o projeto para ver o material e as dicas.'));return;}const c=CASES[p];root.append(el('h3',c.title),el('p',c.kind,'case-kind'));for(const [k,t]of c.records){const p1=el('p');p1.append(el('b',k+' — '),document.createTextNode(t));root.append(p1);}if(c.source){const p2=el('p');p2.append(el('b','Fonte pública — '));const a=el('a',c.source.label);a.href=c.source.url;a.target='_blank';a.rel='noopener noreferrer';a.className='source-link';p2.append(a);root.append(p2);}root.append(el('p','Limite importante — '+c.limit));updateHints();}
function fieldCard(id,label){const card=el('div',undefined,'field-card');card.id='field-'+id;const lab=el('label',label+' *');lab.htmlFor=id;const hint=el('p','Selecione o projeto para ver a dica.','project-hint');hint.id=id+'-hint';const ta=el('textarea');ta.id=id;ta.name=id;ta.rows=3;ta.maxLength=3000;ta.required=true;ta.placeholder='Escreva com suas palavras.';ta.setAttribute('aria-describedby',hint.id);card.append(lab,hint,ta);return card;}
function selectField(id,label){const box=el('label',undefined,'field');const span=el('span',label+' *'),sel=el('select');sel.id=id;sel.required=true;for(const o of SELECTS[id]){const op=el('option',o);op.value=o==='Selecione'?'':o;sel.append(op);}box.append(span,sel);return box;}
function buildForm(){
const host=$('activity-sections');
const s1=el('section',undefined,'panel');s1.id='part-1';s1.append(el('h2','1 · Escolham o dado ou informação'));const c=el('div',undefined,'case');c.id='caseMaterial';s1.append(c);const g1=el('div',undefined,'grid');['item','finalidade','fonte','acesso'].forEach(id=>g1.append(fieldCard(id,TEXT_FIELDS.find(x=>x[0]===id)[1])));s1.append(g1);host.append(s1);
const s2=el('section',undefined,'panel');s2.id='part-2';s2.append(el('h2','2 · Classifiquem antes de usar'),el('p','Não é uma prova jurídica. A equipe registra o que percebe e marca dúvidas para confirmar com o professor.','section-note'));const cg=el('div',undefined,'classification-grid');cg.append(selectField('identifica','A informação identifica alguém?'),selectField('sensivel','Pode envolver dado sensível?'),selectField('estrategia','Qual estratégia de dados será usada?'));s2.append(cg,fieldCard('minimizacao',TEXT_FIELDS.find(x=>x[0]==='minimizacao')[1]));host.append(s2);
const s3=el('section',undefined,'panel');s3.id='part-3';s3.append(el('h2','3 · Definam autorização e limites'),el('p','Consentimento é apenas uma parte possível do processo. Quando não houver definição, escrevam “a confirmar com professor/instituição”.','section-note'));const g3=el('div',undefined,'grid');['autorizacao','informar','publicacao'].forEach(id=>g3.append(fieldCard(id,TEXT_FIELDS.find(x=>x[0]===id)[1])));s3.append(g3);host.append(s3);
const s4=el('section',undefined,'panel');s4.id='part-4';s4.append(el('h2','4 · Registrem a proveniência'));const g4=el('div',undefined,'grid');['dataVersao','transformacoes','restricoes'].forEach(id=>g4.append(fieldCard(id,TEXT_FIELDS.find(x=>x[0]===id)[1])));s4.append(g4);host.append(s4);
const s5=el('section',undefined,'panel');s5.id='part-5';s5.append(el('h2','5 · Matriz de riscos'),el('p','Chance × impacto é uma priorização didática. A pontuação não decide se algo é permitido ou proibido.','section-note'));for(let n=1;n<=2;n++){const wrap=el('div',undefined,'risk-block'),title=el('h3','Risco '+n),grid=el('div',undefined,'grid');grid.append(fieldCard('risco'+n,TEXT_FIELDS.find(x=>x[0]==='risco'+n)[1]));const row=el('div',undefined,'risk-row'),lp=el('label'),li=el('label'),sp=el('select'),si=el('select');lp.append(el('span','Chance *'));li.append(el('span','Impacto *'));sp.id='prob'+n;si.id='impacto'+n;[['','Escolha'],['1','1 · baixa'],['2','2 · média'],['3','3 · alta']].forEach(([v,t])=>{const a=el('option',t);a.value=v;sp.append(a);const b=el('option',t.replace('baixa','baixo').replace('média','médio').replace('alta','alto'));b.value=v;si.append(b);});lp.append(sp);li.append(si);const score=el('div','Escolha chance e impacto','score-box');score.id='score'+n;row.append(lp,li,score);grid.append(row,fieldCard('mitigacao'+n,TEXT_FIELDS.find(x=>x[0]==='mitigacao'+n)[1]));wrap.append(title,grid);s5.append(wrap);}host.append(s5);
const s6=el('section',undefined,'panel');s6.id='part-6';s6.append(el('h2','6 · Protocolo ético da equipe'),el('p','Marquem somente regras que a equipe realmente se compromete a seguir.','section-note'));const checks=el('div',undefined,'protocol-checks');PROTOCOL.forEach((t,i)=>{const lab=el('label'),inp=el('input');inp.type='checkbox';inp.id='protocol-'+i;lab.append(inp,el('span',t));checks.append(lab);});s6.append(checks,fieldCard('regraEquipe',TEXT_FIELDS.find(x=>x[0]==='regraEquipe')[1]));host.append(s6);
const s7=el('section',undefined,'panel');s7.id='part-7';s7.append(el('h2','7 · Revisão e próxima ação'));const g7=el('div',undefined,'grid');['forca','ajuste','proximaAcao'].forEach(id=>g7.append(fieldCard(id,TEXT_FIELDS.find(x=>x[0]===id)[1])));s7.append(g7);host.append(s7);
document.querySelectorAll('textarea,select').forEach(x=>x.addEventListener('input',()=>x.classList.remove('error')));
for(let n=1;n<=2;n++){['prob','impacto'].forEach(p=>$(p+n).addEventListener('change',()=>scoreRisk(n)));}
}
function updateHints(){const p=val('projeto'),g=GUIDES[p];document.querySelectorAll('.field-card').forEach(card=>{const id=card.id.replace('field-',''),hint=$(id+'-hint');if(hint)hint.textContent=g?.[id]||'Escreva uma resposta específica e verificável.';});}
function scoreRisk(n){const p=Number(val('prob'+n)),i=Number(val('impacto'+n)),box=$('score'+n);box.className='score-box';if(!p||!i){box.textContent='Escolha chance e impacto';return 0;}const s=p*i,l=s<=2?'Baixo':s<=4?'Moderado':'Alto';box.textContent=s+' · '+l;box.classList.add(l==='Alto'?'high':l==='Moderado'?'medium':'low');return s;}
function snapshot(){const campos={};TEXT_FIELDS.forEach(([id])=>campos[id]=val(id));['identifica','sensivel','estrategia'].forEach(id=>campos[id]=val(id));for(let n=1;n<=2;n++){campos['prob'+n]=val('prob'+n);campos['impacto'+n]=val('impacto'+n);campos['score'+n]=String(scoreRisk(n)||'');}return {schema:'ppi-f02-v1',identificacao:{instituicao:INSTITUCAO,curso:CURSO,disciplina:DISCIPLINA,professor:PROFESSOR,equipe:val('equipe'),componentes:members(),projeto:val('projeto'),data:val('dataAtividade')},campos,protocolo:PROTOCOL.map((t,i)=>({texto:t,marcado:$('protocol-'+i).checked}))};}
function validate(){document.querySelectorAll('.error').forEach(x=>x.classList.remove('error'));const missing=[];if(!members().length)missing.push(document.querySelector('.member-name'));if(!PROJETOS[val('projeto')])missing.push($('projeto'));if(!dateOK(val('dataAtividade')))missing.push($('dataAtividade'));TEXT_FIELDS.forEach(([id])=>{if(!val(id))missing.push($(id));});['identifica','sensivel','estrategia','prob1','impacto1','prob2','impacto2'].forEach(id=>{if(!val(id))missing.push($(id));});missing.forEach(x=>x?.classList.add('error'));if(missing.length){status('Faltam '+missing.length+' campos obrigatórios. Confira os campos destacados.');missing[0]?.focus();missing[0]?.scrollIntoView({block:'center'});return false;}return true;}
function riskText(s,n){const p=s.campos['prob'+n],i=s.campos['impacto'+n],score=s.campos['score'+n];return s.campos['risco'+n]+'\nChance: '+p+' | Impacto: '+i+' | Pontuação didática: '+score+'\nMitigação: '+s.campos['mitigacao'+n];}
function documentModel(){const s=snapshot(),id=s.identificacao;return {title:'Protocolo Ético e Matriz de Riscos',institution:INSTITUCAO,course:CURSO,discipline:DISCIPLINA,lesson:'Aula 06 — Ética e Proteção de Dados',professor:PROFESSOR,team:id.equipe||'Não informado',members:id.componentes,project:PROJETOS[id.projeto]||'[A preencher]',date:prettyDate(id.data),version:'1.0',sections:[
{title:'1. Informação planejada',items:[['Dado ou informação',s.campos.item],['Finalidade',s.campos.finalidade],['Fonte/origem',s.campos.fonte],['Acesso necessário',s.campos.acesso]]},
{title:'2. Classificação e minimização',items:[['Identificação',s.campos.identifica],['Sensibilidade',s.campos.sensivel],['Estratégia de dados',s.campos.estrategia],['Minimização',s.campos.minimizacao]]},
{title:'3. Autorização e limites',items:[['Autorização/consentimento/validação',s.campos.autorizacao],['O que precisa ser explicado',s.campos.informar],['Publicação/compartilhamento',s.campos.publicacao]]},
{title:'4. Proveniência',items:[['Data/versão',s.campos.dataVersao],['Transformações',s.campos.transformacoes],['Restrições e dúvidas',s.campos.restricoes]]},
{title:'5. Matriz de riscos',items:[['Risco 1',riskText(s,1)],['Risco 2',riskText(s,2)]]},
{title:'6. Protocolo ético',items:[...s.protocolo.map((x,i)=>['Regra '+(i+1),x.texto+'\nSituação: '+(x.marcado?'assumida pela equipe.':'não marcada pela equipe.')]),['Regra específica',s.campos.regraEquipe]]},
{title:'7. Revisão e próxima ação',items:[['Ponto claro',s.campos.forca],['Melhoria necessária',s.campos.ajuste],['Próxima ação',s.campos.proximaAcao]]}
]};}
function md(){const m=documentModel();let out='# '+m.title+'\n\n'+m.institution+'\n\n**Curso:** '+m.course+'\n\n**Disciplina:** '+m.discipline+'\n\n**Aula:** '+m.lesson+'\n\n**Professor:** '+m.professor+'\n\n**Equipe:** '+m.team+'\n\n**Componentes:**\n'+(m.members.length?m.members.map(x=>'- '+x).join('\n'):'[A preencher]')+'\n\n**Projeto:** '+m.project+'\n\n**Data:** '+m.date+'\n\n> Documento didático produzido na Aula 06. Não constitui autorização institucional ou parecer jurídico.\n\n';for(const sec of m.sections){out+='## '+sec.title+'\n\n';for(const [l,t]of sec.items)out+='### '+l+'\n\n'+(t||'[A preencher]')+'\n\n';}return out;}
function download(data,type,name){const b=data instanceof Blob?data:new Blob([data],{type}),u=URL.createObjectURL(b),a=el('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}
function prefix(){const team=(val('equipe')||'equipe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40)||'equipe';return 'ppi1_aula06_'+team+'_protocolo_etico';}
function renderDocument(){const m=documentModel(),root=$('document-content');root.replaceChildren();const cover=el('section',undefined,'doc-cover');cover.append(el('p','Instituto Federal do Maranhão · Campus Itapecuru-Mirim','doc-brand'));const h=el('h1',m.title),sub=el('p','Aula 06 · Ética e Proteção de Dados','doc-subtitle'),proj=el('div',undefined,'doc-project');proj.append(el('small','Projeto analisado'),el('strong',m.project));const meta=el('div',undefined,'doc-cover-meta');meta.append(el('p','Professor: '+m.professor),el('p','Equipe: '+m.team),el('p','Componentes: '+(m.members.join('; ')||'[A preencher]')),el('p','Data: '+m.date));cover.append(h,sub,proj,meta);root.append(cover);const body=el('section',undefined,'doc-body');const header=el('div',undefined,'doc-header'),left=el('div','PPI I · AULA 06 · PROTOCOLO ÉTICO','left'),right=el('div',m.project+' · '+m.date,'right');header.append(left,right);body.append(header);const note=el('p','Documento didático. A revisão por pares e a pontuação da matriz não constituem autorização institucional nem parecer jurídico.','doc-note');body.append(note);for(const sec of m.sections){body.append(el('h2',sec.title));for(const [l,t]of sec.items){body.append(el('h3',l),el('p',t||'[A preencher]'));}}root.append(body);}
function restore(d){if(!d||d.schema!=='ppi-f02-v1')throw Error('Arquivo não reconhecido como rascunho da Aula 06.');const id=d.identificacao||{},c=d.campos||{};$('equipe').value=id.equipe||'';$('dataAtividade').value=id.data||today();$('projeto').value=PROJETOS[id.projeto]?id.projeto:'';document.querySelectorAll('.member-row').forEach(x=>x.remove());(id.componentes?.length?id.componentes:['','','']).forEach(x=>addMember(x));TEXT_FIELDS.forEach(([k])=>$(k).value=c[k]||'');['identifica','sensivel','estrategia','prob1','impacto1','prob2','impacto2'].forEach(k=>$(k).value=c[k]||'');PROTOCOL.forEach((_,i)=>$('protocol-'+i).checked=!!d.protocolo?.[i]?.marcado);caseView();scoreRisk(1);scoreRisk(2);status('Rascunho reaberto. Confira projeto, nomes, respostas e riscos antes de gerar o documento.');}
function clearAll(){if(!confirm('Apagar o preenchimento atual desta ficha?'))return;$('worksheet').reset();document.querySelectorAll('.member-row').forEach(x=>x.remove());for(let i=0;i<3;i++)addMember();$('dataAtividade').value=today();previousProject='';caseView();scoreRisk(1);scoreRisk(2);status('Ficha limpa.');}
buildForm();for(let i=0;i<3;i++)addMember();$('dataAtividade').value=today();caseView();
$('addMember').addEventListener('click',()=>addMember('',true));
$('projeto').addEventListener('change',()=>{const p=val('projeto');const has=TEXT_FIELDS.some(([id])=>val(id));if(previousProject&&p!==previousProject&&has&&!confirm('Trocar o projeto? As respostas serão preservadas, mas precisarão ser revisadas com as novas dicas.')){$('projeto').value=previousProject;return;}previousProject=p;caseView();});
$('exportPdf').addEventListener('click',()=>{if(!validate())return;try{const bytes=window.PpiPdf.generate(documentModel());download(bytes,'application/pdf',prefix()+'.pdf');status('PDF formal gerado. Confira o arquivo antes de entregar. Nada foi enviado ao site.');}catch(e){status('Não foi possível gerar o PDF: '+e.message+' Use a versão de impressão se necessário.');}});
$('exportMd').addEventListener('click',()=>{if(!validate())return;download(md(),'text/markdown;charset=utf-8',prefix()+'.md');status('Texto da atividade gerado.');});
$('exportJson').addEventListener('click',()=>{download(JSON.stringify(snapshot(),null,2),'application/json;charset=utf-8',prefix()+'.json');status('Rascunho gerado. Ele contém nomes e respostas: guarde-o com cuidado.');});
$('printView').addEventListener('click',()=>{if(!validate())return;renderDocument();document.body.classList.add('document-mode');$('document-view').hidden=false;scrollTo(0,0);});
$('backToForm').addEventListener('click',()=>{document.body.classList.remove('document-mode');$('document-view').hidden=true;scrollTo(0,0);});
$('printDocument').addEventListener('click',()=>print());
$('clearBtn').addEventListener('click',clearAll);
$('importFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!confirm('Reabrir este rascunho e substituir o preenchimento atual?'))return;restore(d);}catch(err){status('Não foi possível abrir o rascunho: '+err.message);}finally{e.target.value='';}});
window.ppiAula06=Object.freeze({snapshot,documentModel});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();