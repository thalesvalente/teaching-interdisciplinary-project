
/* Ficha da equipe 2.4.0. Sem rede, cookies, armazenamento persistente ou envio de respostas. */
(() => {
  'use strict';
  function init(){
  if(window.ppiWorksheet)return;
  const $ = id => document.getElementById(id);
  const PROFESSOR = 'Prof. Dr. Thales Levi Azevedo Valente';
  const INSTITUICAO = 'Instituto Federal do Maranhão — Campus Itapecuru-Mirim';
  const CURSO = 'Técnico em Informática Integrado ao Ensino Médio';
  const DISCIPLINA = 'Prática Profissional Integrada I — PPI I';
  const PROJETOS = {memorias:'Mapa de Memórias Quilombolas', permanencia:'Permanência e Evasão Escolar'};
  const CASES = {
    memorias: {title:'Mapa de Memórias Quilombolas', records:[
      ['Ficha completa da memória','A equipe do projeto registra uma memória fictícia chamada “Brincadeiras de roda”, na categoria “vivências”. Na ficha completa consta: “Pode ser consultada durante a oficina; publicação externa não autorizada”.'],
      ['Folha de consulta da oficina','Para a oficina, a equipe do projeto prepara uma folha de consulta com o título “Brincadeiras de roda” e a categoria “vivências”. A orientação sobre uso e publicação não aparece nessa folha.'],
      ['Pergunta do participante','Durante a oficina, a equipe entrega a folha de consulta a um participante para acompanhar a atividade. O participante pergunta oralmente à equipe: “Posso fotografar e publicar esse material?”. O caso não informa qual resposta foi dada.']],
      limit:'Não sabemos qual resposta foi dada ao participante, se ele fotografou o material ou se houve publicação depois da oficina.'},
    permanencia: {title:'Permanência e Evasão Escolar', records:[
      ['Tabela de pedidos de apoio','Um setor pedagógico fictício entrega à equipe uma tabela com pedidos de apoio separados por período. Todos os dados são inventados e não há nomes.'],
      ['Resumo para a reunião','A equipe prepara um resumo, mas não escreve o período dos pedidos nem de qual tabela retirou as informações.'],
      ['Pergunta durante a reunião','Uma pessoa pergunta: “A que período esse resumo se refere?”']],
      limit:'Não sabemos que decisão foi tomada, por que o apoio foi pedido ou se isso mudou a permanência dos estudantes.'}
  };
  const GROUPS = [
    {title:'1 · Retomem o projeto da equipe', fields:[['recorte','Que problema sua equipe está investigando?','Retome o foco escolhido na Aula 3. Não precisa escolher uma tecnologia.']]},
    {title:'2 · Primeira troca de informação', note:'Comecem por uma troca que aparece na situação fictícia do projeto: quem envia, o que envia e para quem.', fields:[
      ['origem1','Quem envia a informação?','Escreva o papel ou grupo que aparece no caso.'],
      ['info1','Qual é a informação?','Escreva o conteúdo do recado com o contexto necessário.'],
      ['canal1','Por onde a informação passa?','Esse meio é o canal. Exemplos: mensagem, documento ou mural.'],
      ['destino1','Para quem ela é enviada?','Separe destinatário previsto de recebimento comprovado.'],
      ['uso1','Para que a pessoa precisa dela?','Qual compreensão, ação ou decisão essa informação apoia?']]},
    {title:'3 · A próxima parte do caminho', note:'Acompanhem a informação adiante. Se a situação não contar essa parte, marquem o que falta descobrir. Não inventem a ligação.', fields:[
      ['origem2','Quem passa a informação adiante?','Procure no caso. Se não estiver explicado, escreva “não sabemos”.'],
      ['info2','O que é passado adiante?','Compare: a informação continua completa ou perdeu contexto?'],
      ['canal2','Por qual meio?','Não invente um meio que o material não apresenta.'],
      ['destino2','Quem recebe ou deveria receber?','Distingua o que deveria acontecer do que realmente está registrado.'],
      ['uso2','Para que essa pessoa precisa da informação?','Se o uso não estiver informado, registre a dúvida.']]},
    {title:'4 · Confiram o desenho que apareceu', note:'O desenho usa o que vocês digitaram. Ele não verifica se a informação é verdadeira. Confiram com a situação do projeto e mantenham as dúvidas visíveis.', fields:[]},
    {title:'5 · Mostrem onde conferiram e o que falta saber', note:'Fonte é o material consultado. Evidência é o trecho que apoia sua resposta. Use o nome do registro, não códigos artificiais.', fields:[
      ['fonte','Onde vocês conferiram?','Exemplo: “Ficha completa da memória” ou “Resumo para a reunião”.'],
      ['evidencia','Que trecho sustenta sua resposta?','Copie ou resuma o trecho que realmente apoia a afirmação.'],
      ['limite','O que ainda não é possível afirmar?','Mostre o limite do material, sem preencher a lacuna por suposição.'],
      ['pergunta','Que pergunta ajudaria a descobrir isso?','Escreva uma pergunta específica e investigável.']]},
    {title:'6 · Outra equipe vai conferir', note:'Peçam a outra equipe que leia a ficha e confira cada resposta na situação. Ter texto em todos os campos não significa que está tudo certo.', fields:[
      ['forca','O que ficou claro na ficha?','Quem revisou aponta uma parte bem explicada.'],
      ['ajuste','O que precisa ser melhor explicado?','Quem revisou sugere uma pergunta ou ajuste concreto.']]},
    {title:'7 · Combinem a próxima tarefa', note:'Terminar a ficha não significa resolver o problema. Escolham uma ação para investigar o que ainda falta descobrir.', fields:[
      ['tarefa','Qual será a próxima tarefa?','Uma ação pequena e investigativa; ainda não é hora de criar um sistema.'],
      ['responsavel','Quem acompanha essa tarefa?','Use um papel, como “quem registra” ou “quem confere”.'],
      ['quando','Quando a equipe vai conferir?','Combine um momento com a equipe e o professor.'],
      ['pronto','Como saberemos que a tarefa terminou?','Escreva uma condição verificável.'],
      ['registro','O que ficará guardado como registro?','Exemplo: uma anotação revisada. Se ainda não foi feita, escreva “a fazer”.']]}
  ];
  const CHECKS = [
    'O desenho mostra quem envia, qual informação, por onde, para quem e para quê.',
    'Há duas partes do caminho; o que não sabemos ficou marcado.',
    'Indicamos o material usado como fonte.',
    'Escrevemos um limite e uma pergunta para investigar.',
    'Nas respostas sobre a situação fictícia, não incluímos dados pessoais reais nem antecipamos uma solução.'
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
      if(i===0){const box=el('div',undefined,'case');box.id='caseMaterial';section.append(box);}
      if(i===5){CHECKS.forEach((t,j)=>{const label=el('label',undefined,'check'),box=el('input');box.type='checkbox';box.id='check'+j;box.name=box.id;label.append(box,el('span',t));section.append(label);});}
      const grid=el('div',undefined,'grid');
      for(const [id,label,hint] of g.fields){const lab=el('label',undefined,'field'),ta=el('textarea');lab.htmlFor=id;ta.id=id;ta.name=id;ta.rows=3;ta.maxLength=3000;ta.required=true;ta.placeholder=hint;ta.setAttribute('aria-describedby',id+'-hint');const small=el('small',hint);small.id=id+'-hint';lab.append(el('span',label+' *'),ta,small);grid.append(lab);}
      if(g.fields.length)section.append(grid);
      if(i===3){const p=el('div',undefined,'preview');p.id='preview';section.append(p);}
      if(i===6){section.append(el('h3','Como essa próxima tarefa está agora?'));const lab=el('label','Situação no quadro');lab.htmlFor='taskState';const select=el('select');select.id='taskState';select.name='estado';STATES.forEach(v=>{const opt=el('option',v==='Concluído'?'Concluído — somente se executado e revisado':v);opt.value=v;select.append(opt);});section.append(lab,select);}
      $('activity-sections').append(section);
    }
  }

  let memberId=0;
  function addMember(value='',focus=false){
    if($('members-list').children.length>=30){$('members-status').textContent='Limite de 30 componentes nesta ficha.';return;}
    const row=el('div',undefined,'member-row'),lab=el('label'),input=el('input'),remove=el('button','Remover','secondary');input.type='text';input.maxLength=120;input.className='member-name';input.id='componente-'+(++memberId);input.name=input.id;input.value=value;input.autocomplete='off';lab.htmlFor=input.id;lab.append(el('span'),input);remove.type='button';remove.addEventListener('click',()=>{const inputs=[...document.querySelectorAll('.member-name')],idx=inputs.indexOf(input);row.remove();if(!document.querySelector('.member-name'))addMember();renumber();const remaining=[...document.querySelectorAll('.member-name')];remaining[Math.min(idx,remaining.length-1)]?.focus();});input.addEventListener('input',()=>{input.classList.remove('error');input.removeAttribute('aria-invalid');});row.append(lab,remove);$('members-list').append(row);renumber();if(focus)input.focus();
  }
  function renumber(){[...$('members-list').children].forEach((r,i)=>{r.querySelector('span').textContent='Componente '+(i+1);r.querySelector('button').setAttribute('aria-label','Remover campo do componente '+(i+1));});$('members-status').textContent='Campos vazios não entram no documento.';$('addMember').disabled=$('members-list').children.length>=30;}
  function members(){return [...document.querySelectorAll('.member-name')].map(n=>n.value.trim()).filter(Boolean);}

  function caseView(){
    const root=$('caseMaterial'),project=val('projeto');root.replaceChildren();
    if(!Object.hasOwn(CASES,project)){
      root.append(el('h3','Situação fictícia do projeto'),el('p','Selecione o projeto na identificação. As orientações de cada pergunta aparecerão junto com a situação correspondente.'));
    }else{
      const c=CASES[project];root.append(el('h3','Situação fictícia · '+c.title));
      for(const [k,t]of c.records){const p=el('p');p.append(el('b',k+' — '),document.createTextNode(t));root.append(p);}
      root.append(el('p','O que ainda não sabemos: '+c.limit));
    }
    if(window.PpiGuide)window.PpiGuide.update(project,CASES);
  }
  function preview(){if(window.PpiGuide)window.PpiGuide.renderFlow();}

  function snapshot(){const p=val('projeto');return {schema:'ppi-f01-v3',identificacao:{instituicao:INSTITUICAO,curso:CURSO,disciplina:DISCIPLINA,professor:PROFESSOR,componentes:members(),projeto:p,data:val('dataAtividade')},caso:p,campos:Object.fromEntries(keys.map(k=>[k,val(k)])),revisao:CHECKS.map((_,i)=>$('check'+i).checked),estado:val('taskState')};}

  function validate(){
    document.querySelectorAll('.error').forEach(n=>{n.classList.remove('error');n.removeAttribute('aria-invalid');});const missing=fields.filter(([k])=>!val(k)).map(([k])=>$(k));
    if(!members().length)missing.unshift(document.querySelector('.member-name'));if(!Object.hasOwn(PROJETOS,val('projeto')))missing.unshift($('projeto'));if(!dateOK(val('dataAtividade')))missing.unshift($('dataAtividade'));
    missing.forEach(n=>{n.classList.add('error');n.setAttribute('aria-invalid','true');});
    if(missing.length){status('Faltam '+missing.length+' campos obrigatórios ou há uma data inválida. Confira os campos destacados. Informe pelo menos um componente e selecione o projeto.');missing[0].focus();missing[0].scrollIntoView({block:'center'});return false;}
    status('Identificação e respostas preenchidas. As marcações de revisão mostram o que a equipe declarou ter conferido; não são uma correção automática.');return true;
  }

  function download(data,type,name){const b=data instanceof Blob?data:new Blob([data],{type}),url=URL.createObjectURL(b),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  function prefix(){const team=val('equipe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40)||'equipe';return 'ppi1_aula05_'+team+'_fluxo_informacao';}

  function documentModel(){
    const s=snapshot(),id=s.identificacao,sections=[];
    sections.push({title:'1. Ponto de partida',items:[['Problema investigado',s.campos.recorte]]});
    sections.push({title:'2. Primeira troca de informação',items:GROUPS[1].fields.map(([k,l])=>[l,s.campos[k]])});
    sections.push({title:'3. Próxima parte do caminho',items:GROUPS[2].fields.map(([k,l])=>[l,s.campos[k]])});
    sections.push({title:'4. Fontes, evidências e dúvidas',items:GROUPS[4].fields.map(([k,l])=>[l,s.campos[k]])});
    sections.push({title:'5. Revisão por pares',items:[...GROUPS[5].fields.map(([k,l])=>[l,s.campos[k]]),...CHECKS.map((c,i)=>['Critério '+(i+1),c+'\nSituação: '+(s.revisao[i]?'conferido pela equipe revisora.':'não marcado como conferido.')])]});
    sections.push({title:'6. Próxima tarefa da equipe',items:[...GROUPS[6].fields.map(([k,l])=>[l,s.campos[k]]),['Situação no quadro',s.estado]]});
    return {title:'Registro do caminho da informação',institution:INSTITUICAO,course:CURSO,discipline:DISCIPLINA,lesson:'Aula 05 — Seguir a informação',professor:PROFESSOR,team:s.campos.equipe||'Não informado',members:id.componentes,project:PROJETOS[id.projeto]||'[A preencher]',date:prettyDate(id.data),version:'1.0',sections};
  }

  function md(){const m=documentModel();let out='# '+m.title+'\n\n'+m.institution+'\n\n**Curso:** '+m.course+'\n\n**Disciplina:** '+m.discipline+'\n\n**Aula:** '+m.lesson+'\n\n**Professor:** '+m.professor+'\n\n**Equipe:** '+m.team+'\n\n**Componentes:**\n'+(m.members.length?m.members.map(x=>'- '+x).join('\n'):'[A preencher]')+'\n\n**Projeto analisado:** '+m.project+'\n\n**Data da atividade:** '+m.date+'\n\n> Situação fictícia associada ao projeto. Arquivo gerado localmente. Não constitui envio da atividade.\n\n';for(const s of m.sections){out+='## '+s.title+'\n\n';for(const [l,t]of s.items)out+='### '+l+'\n\n'+(t||'[A preencher]')+'\n\n';}return out;}

  function addRow(table,label,value){const tr=el('tr'),th=el('th',label),td=el('td',value);tr.append(th,td);table.append(tr);}
  function renderDocument(){
    const m=documentModel(),root=$('document-content');root.replaceChildren();
    const cover=el('section',undefined,'doc-cover');cover.append(el('p','IFMA · CAMPUS ITAPECURU-MIRIM','doc-brand'),el('h1','REGISTRO DO CAMINHO DA INFORMAÇÃO'),el('p','Prática Profissional Integrada I · Aula 05','doc-subtitle'));
    const project=el('div',undefined,'doc-project');project.append(el('small','Projeto analisado'),el('strong',m.project));cover.append(project);
    const meta=el('div',undefined,'doc-cover-meta');for(const [l,t]of [['Professor',m.professor],['Equipe',m.team],['Componentes',m.members.join('; ')||'[A preencher]'],['Data',m.date]]){const p=el('p');p.append(el('strong',l+': '),document.createTextNode(t));meta.append(p);}cover.append(meta);root.append(cover);

    const intro=el('section',undefined,'doc-body doc-pagebreak'),head=el('div',undefined,'doc-header'),left=el('div','PPI I · Documento da atividade','left'),right=el('div','Aula 05 · Registro de fluxo','right');head.append(left,right);intro.append(head,el('h2','Identificação do documento'));
    const table=el('table',undefined,'doc-meta-table');addRow(table,'Instituição',m.institution);addRow(table,'Curso',m.course);addRow(table,'Disciplina',m.discipline);addRow(table,'Professor',m.professor);addRow(table,'Equipe',m.team);addRow(table,'Componentes',m.members.join('; ')||'[A preencher]');addRow(table,'Projeto analisado',m.project);addRow(table,'Data da atividade',m.date);intro.append(table,el('h2','Controle do documento'));
    const control=el('table',undefined,'doc-control'),thead=el('thead'),tr=el('tr');['Versão','Data','Responsáveis','Descrição'].forEach(t=>tr.append(el('th',t)));thead.append(tr);control.append(thead);const tbody=el('tbody'),row=el('tr');[m.version,m.date,m.members.join('; ')||m.team,'Registro de fluxo de informação produzido na Aula 05.'].forEach(t=>row.append(el('td',t)));tbody.append(row);control.append(tbody);intro.append(control,el('p','As respostas abaixo foram produzidas a partir de uma situação fictícia associada ao projeto da equipe. O documento registra o raciocínio e as evidências da atividade; não transforma hipóteses em fatos.','doc-note'));
    for(const s of m.sections){intro.append(el('h2',s.title));for(const [l,t]of s.items)intro.append(el('h3',l),el('p',t||'[A preencher]'));}
    root.append(intro);
  }

  function showDocument(){renderDocument();$('document-view').hidden=false;document.body.classList.add('document-mode');window.scrollTo(0,0);$('backToForm').focus();}
  function backToForm(){document.body.classList.remove('document-mode');$('document-view').hidden=true;$('viewDocument').focus();}

  buildForm();$('dataAtividade').value=today();for(let i=0;i<3;i++)addMember();caseView();preview();
  $('addMember').addEventListener('click',()=>addMember('',true));$('worksheet').addEventListener('submit',e=>e.preventDefault());
  $('worksheet').addEventListener('input',e=>{e.target.classList.remove('error');e.target.removeAttribute('aria-invalid');if(e.target.tagName==='TEXTAREA')preview();});
  let previousProject=val('projeto');
  $('projeto').addEventListener('change',()=>{
    const next=val('projeto'),hasAnswers=fields.some(([id])=>val(id));
    if(next!==previousProject&&hasAnswers){
      if(!confirm('Trocar o projeto e suas dicas? As respostas atuais serão preservadas, mas precisarão ser conferidas com a nova situação.')){$('projeto').value=previousProject;return;}
    }
    caseView();if(next!==previousProject&&hasAnswers)window.PpiGuide?.flagProjectChange();
    previousProject=next;$('projeto').classList.remove('error');$('projeto').removeAttribute('aria-invalid');
  });$('validateBtn').addEventListener('click',validate);
  $('exportPdf').addEventListener('click',()=>{if(!validate())return;const b=$('exportPdf');b.disabled=true;try{if(!window.PpiPdf)throw Error('O gerador não carregou. Recarregue a página depois de guardar um rascunho, ou use a versão de impressão.');const bytes=window.PpiPdf.generate(documentModel());download(bytes,'application/pdf',prefix()+'.pdf');status('PDF formal gerado. Abra o arquivo e confira nomes, projeto, respostas e páginas. Nada foi enviado ao site.');}catch(e){status('Não foi possível gerar o PDF: '+e.message);}finally{b.disabled=false;}});
  $('viewDocument').addEventListener('click',showDocument);$('backToForm').addEventListener('click',backToForm);$('printDocument').addEventListener('click',()=>window.print());addEventListener('beforeprint',()=>{renderDocument();$('document-view').hidden=false;});addEventListener('afterprint',()=>{if(!document.body.classList.contains('document-mode'))$('document-view').hidden=true;});
  $('exportMd').addEventListener('click',()=>{download(md(),'text/markdown;charset=utf-8',prefix()+'.md');status('Texto baixado com nomes e respostas. Não é envio de atividade.');});
  $('exportJson').addEventListener('click',()=>{download(JSON.stringify(snapshot(),null,2),'application/json;charset=utf-8',prefix()+'.json');status('Rascunho para continuar depois gerado. Ela contém nomes e respostas: guarde-a com cuidado.');});
  $('clearBtn').addEventListener('click',()=>{if(!confirm('Apagar os nomes e as respostas? O que não foi guardado será perdido.'))return;$('worksheet').reset();keys.forEach(k=>$(k).value='');$('members-list').replaceChildren();for(let i=0;i<3;i++)addMember();$('dataAtividade').value=today();document.querySelectorAll('.error').forEach(n=>{n.classList.remove('error');n.removeAttribute('aria-invalid');});previousProject=val('projeto');window.PpiGuide?.clearProjectWarning();caseView();preview();status('Preenchimento apagado. Os dados institucionais continuam fixos.');});

  $('importFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{
      if(file.size>1000000)throw Error('Arquivo acima de 1 MB.');const d=JSON.parse(await file.text());
      if(!d||!['ppi-f01-v1','ppi-f01-v2','ppi-f01-v3'].includes(d.schema)||!d.campos||typeof d.campos!=='object'||!Array.isArray(d.revisao)||d.revisao.length!==5||d.revisao.some(v=>typeof v!=='boolean')||!STATES.includes(d.estado))throw Error('Formato de ficha não reconhecido.');
      for(const k of keys)if(typeof d.campos[k]!=='string'||d.campos[k].length>3000)throw Error('Campos inválidos ou muito longos.');
      let names=[],project='',date=today(),legacyConflict=false;
      if(d.schema==='ppi-f01-v2'||d.schema==='ppi-f01-v3'){
        const id=d.identificacao;if(!id||!Array.isArray(id.componentes)||id.componentes.length>30||id.componentes.some(v=>typeof v!=='string'||v.length>120||/[\r\n]/.test(v))||typeof id.projeto!=='string'||typeof id.data!=='string'||!(id.data===''||dateOK(id.data)))throw Error('Identificação inválida.');
        names=id.componentes;project=Object.hasOwn(PROJETOS,id.projeto)?id.projeto:'';date=id.data||today();if(d.caso&&project&&d.caso!==project)legacyConflict=true;
      } else if(Object.hasOwn(PROJETOS,d.caso)) project=d.caso;
      if(!confirm('Reabrir este rascunho e substituir os nomes e as respostas atuais?'))return;
      keys.forEach(k=>$(k).value=d.campos[k]);$('members-list').replaceChildren();(names.length?names:['','','']).forEach(n=>addMember(n));$('projeto').value=project;$('dataAtividade').value=date;$('taskState').value=d.estado;d.revisao.forEach((v,i)=>$('check'+i).checked=v);document.querySelectorAll('.error').forEach(n=>{n.classList.remove('error');n.removeAttribute('aria-invalid');});previousProject=val('projeto');window.PpiGuide?.clearProjectWarning();caseView();preview();if(legacyConflict)window.PpiGuide?.flagProjectChange();
      status(legacyConflict?'Rascunho antigo reaberto. Ela tinha projeto e caso diferentes; a nova ficha manteve o projeto. Revise as respostas antes de gerar o PDF.':d.schema==='ppi-f01-v1'?'Rascunho antigo reaberto. Suas respostas foram preservadas; complete nomes, projeto e data antes de gerar o PDF.':'Rascunho reaberto. Confira projeto, nomes e respostas antes de gerar o documento.');
    }catch(err){status('Não foi possível reabrir: '+err.message+' Nenhum campo foi alterado.');}finally{e.target.value='';}
  });
  window.ppiWorksheet={snapshot,md,documentModel,validate,renderDocument};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

  