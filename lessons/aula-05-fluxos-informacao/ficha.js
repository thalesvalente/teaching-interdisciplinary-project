/* Ficha da equipe 2.0.0. Sem rede, cookies, armazenamento persistente ou envio de respostas. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const PROFESSOR = 'Prof. Dr. Thales Levi Azevedo Valente';
  const INSTITUICAO = 'Instituto Federal do Maranhão — Campus Itapecuru-Mirim';
  const CURSO = 'Técnico em Informática Integrado ao Ensino Médio';
  const DISCIPLINA = 'Prática Profissional Integrada I — PPI I';
  const PROJETOS = {memorias:'Mapa de Memórias Quilombolas', permanencia:'Permanência e Evasão Escolar'};
  const CASES = {
    memorias: {title:'Mapa de Memórias Quilombolas', records:[
      ['Catálogo de exemplo','A equipe reúne uma memória inventada chamada “Brincadeiras de roda”, na categoria “vivências”.'],
      ['Ficha original','A ficha dessa memória diz: “Apenas leitura na oficina; publicação externa não autorizada”.'],
      ['Cópia para a oficina','A cópia entregue para consulta traz o título e a categoria, mas não traz a orientação sobre onde a memória pode ser usada.']],
      limit:'Não sabemos quem leu a cópia nem se alguém publicou a memória fora da oficina.'},
    permanencia: {title:'Permanência e Evasão Escolar', records:[
      ['Tabela de pedidos de apoio','Um setor pedagógico fictício entrega à equipe uma tabela com pedidos de apoio separados por período. Todos os dados são inventados e não há nomes.'],
      ['Resumo para a reunião','A equipe prepara um resumo, mas não escreve o período dos pedidos nem de qual tabela retirou as informações.'],
      ['Pergunta durante a reunião','Uma pessoa pergunta: “A que período esse resumo se refere?”']],
      limit:'Não sabemos que decisão foi tomada, por que o apoio foi pedido ou se isso mudou a permanência dos estudantes.'},
    jogos: {title:'Jogos Interclasse — situação inventada', records:[
      ['8h · Primeiro aviso','O jogo está marcado para as 14h, na Quadra 1.'],
      ['9h · Mudança de quadra','A comissão registra que o mesmo jogo será na Quadra 2.'],
      ['9h05 · Mensagem enviada','A secretaria envia a mudança ao representante da equipe. Não sabemos se ele leu.'],
      ['9h15 · Mural sem mudança','O mural ainda mostra o aviso antigo: jogo na Quadra 1.']],
      limit:'Não sabemos se alguém foi à quadra errada, se houve atraso ou por que o mural não foi atualizado.'}
  };
  // IDs antigos são mantidos para permitir a reabertura dos rascunhos da versão anterior.
  const GROUPS = [
    {title:'1 · Retomem o projeto da equipe', fields:[
      ['recorte','Que problema sua equipe está investigando?','Retome o foco escolhido na Aula 3. Não precisa escolher uma tecnologia.']]},
    {title:'2 · Primeira troca de informação', note:'Comecem por uma troca que aparece no caso: quem envia, o que envia e para quem.', fields:[
      ['origem1','Quem envia a informação?','Escreva o papel ou grupo. Exemplo dos jogos: secretaria.'],
      ['info1','Qual é a informação?','Exemplo dos jogos: o jogo das 14h mudou para a Quadra 2.'],
      ['canal1','Por onde a informação passa?','Esse meio é o canal. Exemplos: mensagem, documento ou mural.'],
      ['destino1','Para quem ela é enviada?','Exemplo dos jogos: representante da equipe. Envio não comprova leitura.'],
      ['uso1','Para que a pessoa precisa dela?','Exemplo dos jogos: orientar os participantes sobre o lugar do jogo.']]},
    {title:'3 · A próxima parte do caminho', note:'Acompanhem o recado adiante. Se o caso não contar essa parte, marquem o que falta descobrir. Não inventem a ligação.', fields:[
      ['origem2','Quem passa a informação adiante?','Procure no caso. Se não estiver explicado, escreva “não sabemos”.'],
      ['info2','O que é passado adiante?','Compare: o recado continua completo ou ficou faltando alguma coisa?'],
      ['canal2','Por qual meio?','Não invente uma mensagem ou conversa que o caso não mostra.'],
      ['destino2','Quem recebe ou deveria receber?','Separe o que deveria acontecer do que realmente está registrado.'],
      ['uso2','Para que essa pessoa precisa da informação?','Escreva o uso explicado no caso. Se não souber, marque a dúvida.']]},
    {title:'4 · Confiram o desenho que apareceu', note:'O desenho usa o que vocês digitaram. Ele não verifica se a informação é verdadeira. Confiram com o caso e mantenham as dúvidas visíveis.', fields:[]},
    {title:'5 · Mostrem onde conferiram e o que falta saber', note:'Fonte é o material consultado. Evidência é o trecho que apoia sua resposta. Não é preciso criar códigos: usem nomes como “Ficha original” ou “Mensagem das 9h05”.', fields:[
      ['fonte','Onde vocês conferiram?','Escreva o nome do material e, quando houver, o horário. Exemplo: mensagem das 9h05.'],
      ['evidencia','Que trecho sustenta sua resposta?','Exemplo: a anotação das 9h15 diz que o mural ainda mostrava a Quadra 1.'],
      ['limite','O que ainda não é possível afirmar?','Exemplo: não sabemos se alguém leu o aviso antigo ou se atrasou.'],
      ['pergunta','Que pergunta ajudaria a descobrir isso?','Escreva uma pergunta específica. Não preencha a resposta por suposição.']]},
    {title:'6 · Outra equipe vai conferir', note:'Peçam a outra equipe que leia a ficha e confira cada resposta no caso. Ter texto em todos os campos não significa que está tudo certo. Se a revisão ainda não aconteceu, registrem isso nos dois campos e não marquem o que não foi conferido.', fields:[
      ['forca','O que ficou claro na ficha?','Quem revisou aponta uma parte bem explicada.'],
      ['ajuste','O que precisa ser melhor explicado?','Quem revisou sugere uma pergunta ou um ajuste concreto.']]},
    {title:'7 · Combinem a próxima tarefa', note:'Terminar a ficha não significa resolver o problema. Escolham uma ação para investigar o que ainda falta descobrir.', fields:[
      ['tarefa','Qual será a próxima tarefa?','Uma ação pequena para investigar a dúvida. Ainda não é hora de criar um sistema.'],
      ['responsavel','Quem acompanha essa tarefa?','Use um papel, como “quem registra” ou “quem confere”. Os nomes dos autores ficam na identificação.'],
      ['quando','Quando a equipe vai conferir?','Combine um momento com a equipe e o professor.'],
      ['pronto','Como saberemos que a tarefa terminou?','Escreva o que precisa estar feito para a equipe conferir.'],
      ['registro','O que ficará guardado como registro?','Exemplo: uma anotação revisada. Se ainda não foi feita, escreva “a fazer”.']]}
  ];
  const CHECKS = [
    'O desenho mostra quem envia, qual informação, por onde, para quem e para quê.',
    'Há duas partes do caminho; o que não sabemos ficou marcado.',
    'Indicamos o material e o horário que usamos, quando informado.',
    'Escrevemos uma dúvida e uma pergunta para investigar.',
    'Nas respostas sobre os casos, não incluímos dados pessoais reais nem escolhemos uma solução antes de entender o problema.'
  ];
  const STATES = ['A fazer','Fazendo','Conferindo','Concluído'];
  const fields = GROUPS.flatMap(g=>g.fields), keys = ['equipe',...fields.map(f=>f[0])];
  const val = id => $(id).value.trim();
  const status = text => { $('status').textContent = text; };
  const el = (tag,text,cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function dateOK(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number);const dt=new Date(0);dt.setUTCFullYear(y,m-1,d);dt.setUTCHours(0,0,0,0);return y>=1900&&y<=2100&&dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;}
  const prettyDate = d => dateOK(d) ? d.split('-').reverse().join('/') : '[A preencher]';
  function buildForm(){
    for(const [i,g] of GROUPS.entries()){
      const section=el('section',undefined,'panel');section.id='part-'+(i+1);const heading=el('h2',g.title);heading.id='heading-'+i;section.setAttribute('aria-labelledby',heading.id);section.append(heading);
      if(g.note)section.append(el('p',g.note,'section-note'));
      if(i===5){CHECKS.forEach((t,j)=>{const label=el('label',undefined,'check'),box=el('input');box.type='checkbox';box.id='check'+j;box.name=box.id;label.append(box,el('span',t));section.append(label);});}
      const grid=el('div',undefined,'grid');
      for(const [id,label,hint] of g.fields){const lab=el('label',undefined,'field'),ta=el('textarea');lab.htmlFor=id;ta.id=id;ta.name=id;ta.rows=3;ta.maxLength=3000;ta.required=true;ta.placeholder=hint;ta.setAttribute('aria-describedby',id+'-hint');const small=el('small',hint);small.id=id+'-hint';lab.append(el('span',label+' *'),ta,small);grid.append(lab);}
      if(g.fields.length)section.append(grid);
      if(i===0){section.append(el('h3','Qual caso sua equipe vai analisar?'));const lab=el('label','Caso fictício');lab.htmlFor='caseSelect';const select=el('select');select.id='caseSelect';select.name='caso';Object.entries(CASES).forEach(([v,c])=>{const opt=el('option',c.title);opt.value=v;select.append(opt);});const box=el('div',undefined,'case');box.id='caseMaterial';section.append(lab,select,box,el('p','Trocar o caso não apaga o que vocês escreveram. Releiam a ficha para ver se ela ainda corresponde ao caso. Se o material não explicar alguma parte, escrevam “não sabemos”.','hint'));}
      if(i===3){const p=el('div',undefined,'preview');p.id='preview';section.append(p);}
      if(i===6){section.append(el('h3','Como essa próxima tarefa está agora?'));const lab=el('label','Situação no quadro');lab.htmlFor='taskState';const select=el('select');select.id='taskState';select.name='estado';STATES.forEach(v=>{const opt=el('option',v==='Concluído'?'Concluído — somente se executado e revisado':v);opt.value=v;select.append(opt);});section.append(lab,select);}
      $('activity-sections').append(section);
    }
  }
  let memberId=0;
  function addMember(value='',focus=false){
    if($('members-list').children.length>=30){$('members-status').textContent='Limite de 30 componentes nesta ficha.';return;}
    const row=el('div',undefined,'member-row'),lab=el('label'),input=el('input'),remove=el('button','Remover','secondary');input.type='text';input.maxLength=120;input.className='member-name';input.id='componente-'+(++memberId);input.name=input.id;input.value=value;input.autocomplete='off';lab.htmlFor=input.id;lab.append(el('span'),input);remove.type='button';remove.addEventListener('click',()=>{const inputs=[...document.querySelectorAll('.member-name')],i=inputs.indexOf(input);row.remove();if(!document.querySelector('.member-name'))addMember();renumber();const remaining=[...document.querySelectorAll('.member-name')];remaining[Math.min(i,remaining.length-1)].focus();});input.addEventListener('input',()=>{input.classList.remove('error');input.removeAttribute('aria-invalid');});row.append(lab,remove);$('members-list').append(row);renumber();if(focus)input.focus();
  }
  function renumber(){[...$('members-list').children].forEach((r,i)=>{r.querySelector('span').textContent='Componente '+(i+1);r.querySelector('button').setAttribute('aria-label','Remover campo do componente '+(i+1));});$('members-status').textContent='Preencha todos os integrantes. Campos vazios não entram no documento.';$('addMember').disabled=$('members-list').children.length>=30;}
  function members(){return [...document.querySelectorAll('.member-name')].map(n=>n.value.trim()).filter(Boolean);}
  function caseView(){const c=CASES[val('caseSelect')],root=$('caseMaterial');root.replaceChildren(el('h3',c.title));for(const [k,t]of c.records){const p=el('p');p.append(el('b',k+' — '),document.createTextNode(t));root.append(p);}root.append(el('p','O que ainda não sabemos: '+c.limit));}
  function preview(){const root=$('preview');root.replaceChildren();for(let n=1;n<=2;n++){const row=el('div',undefined,'flowrow'),start=el('div',val('origem'+n)||'Quem envia? Preencha acima.','node'),middle=el('div',undefined,'arrow'),end=el('div',val('destino'+n)||'Para quem? Preencha acima.','node');const arrow=el('b','→');arrow.setAttribute('aria-hidden','true');middle.append(el('span',val('info'+n)||'Qual é o recado?'),arrow,el('span','Por onde: '+(val('canal'+n)||'a preencher')));row.append(start,middle,end);root.append(row,el('p','Parte '+n+' · Para quê: '+(val('uso'+n)||'a preencher')));}}
  function snapshot(){return {schema:'ppi-f01-v2',identificacao:{instituicao:INSTITUICAO,curso:CURSO,disciplina:DISCIPLINA,professor:PROFESSOR,componentes:members(),projeto:val('projeto'),data:val('dataAtividade')},caso:val('caseSelect'),campos:Object.fromEntries(keys.map(k=>[k,val(k)])),revisao:CHECKS.map((_,i)=>$('check'+i).checked),estado:val('taskState')};}
  function validate(){
    document.querySelectorAll('.error').forEach(n=>{n.classList.remove('error');n.removeAttribute('aria-invalid');});const missing=fields.filter(([k])=>!val(k)).map(([k])=>$(k));
    if(!members().length)missing.unshift(document.querySelector('.member-name'));
    if(!Object.hasOwn(PROJETOS,val('projeto')))missing.unshift($('projeto'));
    if(!dateOK(val('dataAtividade')))missing.unshift($('dataAtividade'));
    missing.forEach(n=>{n.classList.add('error');n.setAttribute('aria-invalid','true');});
    if(missing.length){status('Faltam '+missing.length+' campos obrigatórios ou há uma data inválida. Confira os campos destacados. Informe pelo menos um componente. Use “não sabemos” só quando o caso não contar aquela parte; na revisão pendente, escreva “ainda não revisado”.');missing[0].focus();missing[0].scrollIntoView({block:'center'});return false;}
    status('Identificação e respostas preenchidas. As marcações de revisão mostram o que a equipe declarou ter conferido; não são uma nota nem uma correção automática.');return true;
  }
  function download(data,type,name){const b=data instanceof Blob?data:new Blob([data],{type}),url=URL.createObjectURL(b),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  function prefix(){const team=val('equipe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40)||'equipe';return 'ppi1_aula05_'+team+'_fluxo_informacao';}
  // Um só modelo alimenta PDF, documento para impressão e texto editável.
  function documentModel(){
    const s=snapshot(),id=s.identificacao,sections=[];
    sections.push({title:'1. Ponto de partida',items:[['Problema investigado',s.campos.recorte]]});
    sections.push({title:'2. Primeira troca de informação',items:GROUPS[1].fields.map(([k,l])=>[l,s.campos[k]])});
    sections.push({title:'3. A próxima parte do caminho',items:GROUPS[2].fields.map(([k,l])=>[l,s.campos[k]])});
    sections.push({title:'4. Fontes, evidências e dúvidas',items:GROUPS[4].fields.map(([k,l])=>[l,s.campos[k]])});
    sections.push({title:'5. Revisão da equipe',items:[...GROUPS[5].fields.map(([k,l])=>[l,s.campos[k]]),...CHECKS.map((c,i)=>['Critério '+(i+1),c+'\nSituação declarada: '+(s.revisao[i]?'conferido pela equipe.':'não marcado como conferido.')])]});
    sections.push({title:'6. Próxima tarefa',items:[...GROUPS[6].fields.map(([k,l])=>[l,s.campos[k]]),['Situação no quadro',s.estado]]});
    return {title:'Registro do caminho da informação',institution:INSTITUICAO,course:CURSO,discipline:DISCIPLINA,lesson:'Aula 05 — Seguir a informação',professor:PROFESSOR,team:s.campos.equipe||'Não informado',members:id.componentes,project:PROJETOS[id.projeto]||'[A preencher]',date:prettyDate(id.data),caseTitle:CASES[s.caso].title,sections};
  }
  function md(){const m=documentModel();let out='# '+m.title+'\n\n'+m.institution+'\n\n'+m.discipline+'\n\n'+m.lesson+'\n\n**Curso:** '+m.course+'\n\n**Professor:** '+m.professor+'\n\n**Equipe:** '+m.team+'\n\n**Componentes:**\n'+(m.members.length?m.members.map(x=>'- '+x).join('\n'):'[A preencher]')+'\n\n**Projeto/eixo:** '+m.project+'\n\n**Data da atividade:** '+m.date+'\n\n**Caso de treino:** '+m.caseTitle+'\n\n> Caso fictício. Arquivo gerado localmente. Não constitui envio de atividade.\n\n';for(const s of m.sections){out+='## '+s.title+'\n\n';for(const [l,t]of s.items)out+='### '+l+'\n\n'+(t||'[A preencher]')+'\n\n';}return out;}
  function renderDocument(){const m=documentModel(),root=$('document-content');root.replaceChildren(el('p',m.institution,'doc-meta'),el('h1',m.title,'doc-title'));for(const [l,t]of [['Curso',m.course],['Disciplina',m.discipline],['Aula','05 — Seguir a informação'],['Professor',m.professor],['Equipe',m.team],['Componentes',m.members.join('; ')||'[A preencher]'],['Projeto / eixo',m.project],['Data da atividade',m.date],['Caso de treino',m.caseTitle]]){const p=el('p',undefined,'doc-meta');p.append(el('strong',l+': '),document.createTextNode(t));root.append(p);}root.append(el('p','Respostas da equipe sobre um caso fictício. Documento gerado localmente; não constitui envio da atividade.','doc-meta'));for(const s of m.sections){root.append(el('h2',s.title));for(const [l,t]of s.items)root.append(el('h3',l),el('p',t||'[A preencher]'));}}
  function showDocument(){renderDocument();$('document-view').hidden=false;document.body.classList.add('document-mode');window.scrollTo(0,0);$('backToForm').focus();}
  function backToForm(){document.body.classList.remove('document-mode');$('document-view').hidden=true;$('viewDocument').focus();}
  buildForm();$('dataAtividade').value=today();for(let i=0;i<3;i++)addMember();caseView();preview();
  $('addMember').addEventListener('click',()=>addMember('',true));
  $('worksheet').addEventListener('submit',e=>e.preventDefault());
  $('worksheet').addEventListener('input',e=>{e.target.classList.remove('error');e.target.removeAttribute('aria-invalid');if(e.target.tagName==='TEXTAREA')preview();});
  $('caseSelect').addEventListener('change',caseView);$('validateBtn').addEventListener('click',validate);
  $('exportPdf').addEventListener('click',()=>{if(!validate())return;const b=$('exportPdf');b.disabled=true;try{if(!window.PpiPdf)throw Error('O gerador não carregou. Recarregue a página depois de guardar uma cópia, ou use “Ver documento para impressão”.');const bytes=window.PpiPdf.generate(documentModel());download(bytes,'application/pdf',prefix()+'.pdf');status('PDF gerado. Abra o arquivo e confira os nomes, as respostas e todas as páginas. A entrega continua pelo meio combinado com o professor. Nada foi enviado ao site.');}catch(e){status('Não foi possível gerar o PDF: '+e.message);}finally{b.disabled=false;}});
  $('viewDocument').addEventListener('click',showDocument);$('backToForm').addEventListener('click',backToForm);$('printDocument').addEventListener('click',()=>window.print());
  addEventListener('beforeprint',()=>{renderDocument();$('document-view').hidden=false;});addEventListener('afterprint',()=>{if(!document.body.classList.contains('document-mode'))$('document-view').hidden=true;});
  $('exportMd').addEventListener('click',()=>{download(md(),'text/markdown;charset=utf-8',prefix()+'.md');status('Texto baixado com os nomes e as respostas preenchidas. Não é envio de atividade.');});
  $('exportJson').addEventListener('click',()=>{download(JSON.stringify(snapshot(),null,2),'application/json;charset=utf-8',prefix()+'.json');status('Cópia para continuar depois gerada. Ela contém os nomes da equipe e as respostas: guarde-a com cuidado e não a publique.');});
  $('clearBtn').addEventListener('click',()=>{if(!confirm('Apagar os nomes e as respostas? O que não foi guardado em uma cópia será perdido.'))return;$('worksheet').reset();keys.forEach(k=>$(k).value='');$('members-list').replaceChildren();for(let i=0;i<3;i++)addMember();$('dataAtividade').value=today();document.querySelectorAll('.error').forEach(n=>{n.classList.remove('error');n.removeAttribute('aria-invalid');});caseView();preview();status('Preenchimento apagado. Os dados institucionais continuam fixos.');});
  $('importFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{
      if(file.size>1000000)throw Error('Arquivo acima de 1 MB.');const d=JSON.parse(await file.text());
      if(!d||!['ppi-f01-v1','ppi-f01-v2'].includes(d.schema)||!Object.hasOwn(CASES,d.caso)||!d.campos||typeof d.campos!=='object'||!Array.isArray(d.revisao)||d.revisao.length!==5||d.revisao.some(v=>typeof v!=='boolean')||!STATES.includes(d.estado))throw Error('Formato de ficha não reconhecido.');
      for(const k of keys)if(typeof d.campos[k]!=='string'||d.campos[k].length>3000)throw Error('Campos inválidos ou muito longos.');
      let names=[],project='',date=today();
      if(d.schema==='ppi-f01-v2'){
        const id=d.identificacao;
        if(!id||!Array.isArray(id.componentes)||id.componentes.length>30||id.componentes.some(v=>typeof v!=='string'||v.length>120||/[\r\n]/.test(v))||typeof id.projeto!=='string'||!(id.projeto===''||Object.hasOwn(PROJETOS,id.projeto))||typeof id.data!=='string'||!(id.data===''||dateOK(id.data)))throw Error('Identificação inválida.');
        names=id.componentes;project=id.projeto;date=id.data;
      }else if(Object.hasOwn(PROJETOS,d.caso))project=d.caso;
      if(!confirm('Reabrir esta cópia e substituir os nomes e as respostas atuais?'))return;
      keys.forEach(k=>$(k).value=d.campos[k]);$('members-list').replaceChildren();(names.length?names:['','','']).forEach(n=>addMember(n));$('projeto').value=project;$('dataAtividade').value=date;$('caseSelect').value=d.caso;$('taskState').value=d.estado;d.revisao.forEach((v,i)=>$('check'+i).checked=v);document.querySelectorAll('.error').forEach(n=>{n.classList.remove('error');n.removeAttribute('aria-invalid');});caseView();preview();
      status(d.schema==='ppi-f01-v1'?'Cópia antiga reaberta. Suas respostas foram preservadas. Complete os nomes e confira o eixo e a data antes de gerar o PDF.':'Cópia reaberta com nomes e respostas. O professor e os dados institucionais continuam sendo os fixos desta atividade.');
    }catch(err){status('Não foi possível reabrir: '+err.message+' Nenhum campo foi alterado.');}finally{e.target.value='';}
  });
  window.ppiWorksheet={snapshot,md,documentModel,validate};
})();
