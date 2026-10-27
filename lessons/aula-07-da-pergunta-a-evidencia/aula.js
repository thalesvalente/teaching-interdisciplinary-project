/* Aula 07: apresentação acessível, missões formativas locais e sem vínculo com nota. */
(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const $ = id => document.getElementById(id);
  const slides = [...document.querySelectorAll('.slide')];
  const STORAGE_KEY = 'ppi-aula07-treino-v1';
  const MODE_KEY = 'ppi-aula07-modo-v1';
  const CONTRAST_KEY = 'ppi-aula07-contraste-v1';
  let current = Math.max(0, slides.findIndex(slide => '#' + slide.id === location.hash));
  if (current < 0) current = 0;
  let reading = true;
  let manualMode = null;

  const MISSIONS = [
    {
      id: '1', slide: 's10', max: 10, title: 'Escolha a lente certa', badge: 'Lente Certa', type: 'questions',
      intro: 'Associe cada situação à técnica — ou combinação — que produz evidência mais adequada.',
      questions: [
        { id: 'a', prompt: 'A coordenação precisa explicar como reage quando as faltas aumentam.', correct: 'interview-observation', options: [
          ['document-only','Somente analisar a planilha final'],['interview-observation','Entrevista, complementada por observação do processo'],['ai','Pedir à IA que imagine o fluxo']
        ], explanation: 'A entrevista revela decisões e justificativas; a observação ajuda a conferir como o processo ocorre.' },
        { id: 'b', prompt: 'A equipe quer saber se o procedimento escrito corresponde ao trabalho diário.', correct: 'observation-document', options: [
          ['interview-only','Somente perguntar se o procedimento é seguido'],['observation-document','Comparar observação com análise documental'],['survey','Aplicar uma enquete sem observar o processo']
        ], explanation: 'A comparação entre prática observada e documento permite localizar diferenças sem presumir culpa.' },
        { id: 'c', prompt: 'Uma fotografia antiga não possui autoria nem data registradas.', correct: 'document-validation', options: [
          ['publish','Publicar e pedir correção depois'],['document-validation','Analisar registros e buscar validação autorizada'],['caption','Criar uma legenda provável com IA']
        ], explanation: 'Autoria, data, contexto e autorização permanecem pendentes até que fontes e validadores sejam localizados.' }
      ]
    },
    {
      id: '2', slide: 's14', max: 15, title: 'Desarme a pergunta', badge: 'Pergunta Limpa', type: 'questions',
      intro: 'Escolha a reformulação aberta e neutra.',
      questions: [
        { id: 'map', prompt: 'Mapa: “Todo mundo concorda que essa história precisa aparecer no mapa, certo?”', correct: 'map-good', options: [
          ['map-who','Quem concorda com a publicação?'],['map-good','Como a comunidade decide se uma memória pode ser publicada?'],['map-true','Essa memória é verdadeira?']
        ], explanation: 'A reformulação investiga o processo de decisão sem exigir concordância nem reduzir a resposta a “verdadeiro/falso”.' },
        { id: 'eda', prompt: 'EDA: “Os alunos faltam porque não se esforçam, não é?”', correct: 'eda-good', options: [
          ['eda-why','Por que os alunos não se esforçam?'],['eda-good','Quais situações costumam aparecer antes do aumento de faltas?'],['eda-who','Quem são os alunos que faltam?']
        ], explanation: 'A pergunta correta remove julgamento e abre espaço para múltiplos fatores, sem identificar estudantes.' }
      ]
    },
    {
      id: '3', slide: 's17', max: 15, title: 'Câmera objetiva', badge: 'Olhar de Campo', type: 'questions',
      intro: 'Classifique cada registro sem transformar observação em julgamento.',
      questions: [
        { id: 'q1', prompt: '“A pessoa anotou o dado em uma folha antes de abrir a planilha.”', correct: 'fact', options: [['fact','Fato observado'],['interpretation','Interpretação'],['judgment','Julgamento'],['validation','Pergunta para validação']], explanation: 'Descreve uma ação observável, sem explicar a causa.' },
        { id: 'q2', prompt: '“A planilha é difícil e por isso ninguém gosta dela.”', correct: 'interpretation', options: [['fact','Fato observado'],['interpretation','Interpretação'],['judgment','Julgamento'],['validation','Pergunta para validação']], explanation: 'A frase atribui causa e sentimento sem evidência direta.' },
        { id: 'q3', prompt: '“A equipe trabalha de forma errada.”', correct: 'judgment', options: [['fact','Fato observado'],['interpretation','Interpretação'],['judgment','Julgamento'],['validation','Pergunta para validação']], explanation: 'É uma avaliação de valor, não um registro do que ocorreu.' },
        { id: 'q4', prompt: '“Por que o registro é feito primeiro no papel?”', correct: 'validation', options: [['fact','Fato observado'],['interpretation','Interpretação'],['judgment','Julgamento'],['validation','Pergunta para validação']], explanation: 'Mantém a dúvida explícita e convida a pessoa a explicar o processo.' }
      ]
    },
    {
      id: '4', slide: 's19', max: 20, title: 'Documento sob suspeita', badge: 'Fonte Auditada', type: 'multi',
      intro: 'A planilha fictícia abaixo será reutilizada. Marque os seis sinais que exigem investigação antes do uso.',
      sheet: true,
      options: [
        ['author','Não informa autor ou responsável',true],['version','Não informa data nem versão',true],['ambiguous','A coluna “situação” não possui definição',true],['privacy','Exibe nomes completos',true],['conflict','Abas apresentam valores diferentes',true],['formula','A fórmula de “risco” não está documentada',true],['color','O cabeçalho usa a cor verde',false],['rows','A planilha possui mais de dez linhas',false]
      ],
      explanation: 'Autoria, versão, definição, privacidade, consistência e cálculo precisam ser esclarecidos. Cor e quantidade de linhas, isoladamente, não resolvem a confiabilidade.'
    },
    {
      id: '5', slide: 's21', max: 20, title: 'Cruze as pistas', badge: 'Evidência Cruzada', type: 'questions',
      intro: 'Três fontes divergem sobre a atualização dos dados. Escolha a ação tecnicamente responsável.',
      questions: [
        { id: 'tri', prompt: 'Gestor: semanal. Planilha: mensal. Observação: anotações diárias em papel.', correct: 'investigate', options: [
          ['manager','Aceitar a versão do gestor'],['document','Aceitar a planilha porque é documento'],['lie','Concluir que alguém está mentindo'],['investigate','Registrar a divergência, mapear etapas e pedir validação'],['ai','Pedir à IA para decidir qual fonte está correta']
        ], explanation: 'Pode existir registro diário, revisão semanal e consolidação mensal. A divergência deve ser preservada e investigada.' }
      ]
    },
    {
      id: '6', slide: 's25', max: 20, title: 'Investigador responsável', badge: 'Investigador Responsável', type: 'scenario',
      intro: 'Escolha uma trilha e resolva quatro decisões integradas.',
      tracks: {
        map: {
          label: 'Mapa Quilombola',
          scenario: 'Um morador narra uma memória ligada a um local sensível. Há uma fotografia antiga sem autoria conhecida. Ele deseja preservar a história, mas não quer publicar a localização exata.',
          questions: [
            { id:'m1', prompt:'Qual combinação inicia a investigação?', correct:'m-tech', options:[['m-publish','Publicar e pedir comentários'],['m-tech','Entrevista autorizada + análise documental + validação comunitária'],['m-ai','Pedir à IA que complete a história']], explanation:'A combinação investiga relato, documento e decisão comunitária sem inventar lacunas.' },
            { id:'m2', prompt:'Qual pergunta inicial é mais adequada?', correct:'m-question', options:[['m-leading','A localização deve aparecer no mapa, certo?'],['m-question','Como a comunidade decide o que pode ser registrado e publicado?'],['m-owner','Quem é o verdadeiro dono da história?']], explanation:'A pergunta aberta investiga processo, autoridade e limites sem induzir publicação.' },
            { id:'m3', prompt:'Que informação deve ser protegida conforme o cenário?', correct:'m-location', options:[['m-location','A localização exata do lugar sensível'],['m-title','O título da aula'],['m-tool','O navegador utilizado']], explanation:'O próprio participante informou que a localização exata não deve ser pública.' },
            { id:'m4', prompt:'A fotografia sem autoria conhecida deve ser registrada como...', correct:'m-pending', options:[['m-evidence','Evidência pronta para publicação'],['m-pending','Fonte com autoria, contexto e autorização pendentes'],['m-false','Documento falso']], explanation:'Ausência de autoria não prova falsidade, mas impede tratar a foto como evidência pronta para publicação.' }
          ]
        },
        eda: {
          label: 'EDA / Permanência',
          scenario: 'Uma planilha contém nomes, matrículas e uma coluna “risco” sem fórmula conhecida. Está há seis meses sem atualização, e um gestor solicita ranking individual de estudantes.',
          questions: [
            { id:'e1', prompt:'Qual combinação inicia a investigação?', correct:'e-tech', options:[['e-rank','Gerar o ranking para validar depois'],['e-tech','Análise documental + entrevista com responsáveis pelos dados e pela decisão'],['e-ai','Enviar a planilha à IA']], explanation:'É necessário compreender autoria, definição, atualização e uso antes de qualquer análise.' },
            { id:'e2', prompt:'O que não pode ser enviado a uma IA pública?', correct:'e-private', options:[['e-private','Nomes, matrículas e registros pessoais da planilha'],['e-title','O título fictício da atividade'],['e-question','Uma pergunta genérica sem dados reais']], explanation:'Dados identificáveis e registros institucionais não autorizados não devem ser enviados.' },
            { id:'e3', prompt:'O que precisa de definição e validação institucional?', correct:'e-definition', options:[['e-definition','O significado e o cálculo da coluna “risco”'],['e-green','A cor da planilha'],['e-browser','O navegador do estudante']], explanation:'Sem definição, o indicador não é interpretável nem auditável.' },
            { id:'e4', prompt:'Qual decisão é responsável?', correct:'e-action', options:[['e-action','Recusar ranking punitivo; trabalhar com dados seguros, objetivo claro e revisão humana'],['e-public','Publicar os nomes para obter ajuda'],['e-cause','Tratar correlação como causa']], explanation:'O projeto deve apoiar permanência, evitar exposição e punição e preservar revisão humana.' }
          ]
        }
      }
    }
  ];

  const state = loadState();

  function defaultState(){ return { confirmed:false, completed:{}, answers:{}, reflection:'' }; }
  function loadState(){
    try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch { return defaultState(); }
  }
  function saveState(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Local files can restrict storage. */ }
  }
  function announce(message){ $('lesson-status').textContent = message; }
  function missionById(id){ return MISSIONS.find(mission => mission.id === String(id)); }
  function missionScore(){ return MISSIONS.reduce((sum, mission) => sum + (state.completed[mission.id] ? mission.max : 0), 0); }
  function completedCount(){ return MISSIONS.filter(mission => state.completed[mission.id]).length; }

  function paintScore(){
    const score = missionScore();
    const count = completedCount();
    $('lesson-score').textContent = `${score} / 100 XP de treino`;
    $('lesson-progress').value = score;
    $('lesson-progress-text').textContent = `${count} de 6 missões concluídas · não vale nota`;
    $('final-score').textContent = `${score} / 100 XP de treino`;
    $('final-badge').textContent = score === 100 ? 'Investigador responsável' : count ? 'Percurso em andamento' : 'Treino ainda não iniciado';
    renderMissionSummary();
  }

  function currentMissionAnswers(mission){
    if (!state.answers[mission.id]) state.answers[mission.id] = mission.type === 'scenario' ? { track:'', tracks:{} } : {};
    return state.answers[mission.id];
  }

  function buildOption(question, mission, disabled, answerStore, prefix=''){
    const wrapper = document.createElement('label');
    wrapper.className = 'mission-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `mission-${mission.id}-${prefix}${question.id}`;
    input.value = question.optionValue;
    input.checked = answerStore[question.id] === question.optionValue;
    input.disabled = disabled;
    const span = document.createElement('span');
    span.textContent = question.optionText;
    wrapper.append(input, span);
    return { wrapper, input };
  }

  function renderQuestionMission(mission, host, answerStore = currentMissionAnswers(mission), questionPrefix=''){
    const list = document.createElement('div');
    list.className = `mission-question-list questions-${mission.questions.length}`;
    mission.questions.forEach(question => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'mission-question';
      const legend = document.createElement('legend');
      legend.textContent = question.prompt;
      const options = document.createElement('div');
      options.className = 'mission-options';
      const feedback = document.createElement('div');
      feedback.className = 'question-feedback';
      feedback.setAttribute('role','status');
      const selected = answerStore[question.id];
      question.options.forEach(([value,text]) => {
        const built = buildOption({ id:question.id, optionValue:value, optionText:text }, mission, !!state.completed[mission.id], answerStore, questionPrefix);
        built.input.addEventListener('change', () => {
          answerStore[question.id] = value;
          const correct = value === question.correct;
          feedback.className = `question-feedback ${correct ? 'ok' : 'warn'}`;
          feedback.textContent = `${correct ? 'Correto.' : 'Ainda não.'} ${question.explanation}`;
          evaluateQuestionMission(mission, answerStore, host, questionPrefix);
          saveState();
        });
        options.append(built.wrapper);
      });
      if (selected) {
        const correct = selected === question.correct;
        feedback.className = `question-feedback ${correct ? 'ok' : 'warn'}`;
        feedback.textContent = `${correct ? 'Correto.' : 'Ainda não.'} ${question.explanation}`;
      } else feedback.textContent = 'Escolha uma resposta para receber uma pista.';
      fieldset.append(legend, options, feedback);
      list.append(fieldset);
    });
    host.append(list);
  }

  function evaluateQuestionMission(mission, answerStore, host){
    const allCorrect = mission.questions.every(question => answerStore[question.id] === question.correct);
    if (allCorrect && !state.completed[mission.id]) {
      state.completed[mission.id] = true;
      saveState();
      announce(`Missão ${mission.id} concluída. ${mission.max} XP de treino. Total ${missionScore()} de 100.`);
      renderMission(mission.id);
      paintScore();
    } else updateMissionStatus(mission, host);
  }

  function updateMissionStatus(mission, host){
    const status = host.querySelector('.mission-status');
    if (!status) return;
    if (state.completed[mission.id]) {
      status.className = 'mission-status complete';
      status.textContent = `Missão concluída · ${mission.max} / ${mission.max} XP de treino · não vale nota`;
    } else {
      status.className = 'mission-status';
      status.textContent = `Em andamento · 0 / ${mission.max} XP · erros não retiram pontos`;
    }
  }

  function missionShell(mission){
    const shell = document.createElement('section');
    shell.className = 'mission-shell';
    const head = document.createElement('div');
    head.className = 'mission-head';
    const copy = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = `${mission.badge} · Missão ${mission.id}`;
    const intro = document.createElement('p');
    intro.textContent = mission.intro;
    copy.append(title,intro);
    const points = document.createElement('span');
    points.className = 'mission-points';
    points.textContent = `${mission.max} XP · treino`;
    head.append(copy,points);
    shell.append(head);
    return shell;
  }

  function renderMission(id){
    const mission = missionById(id);
    const host = $(`mission-host-${id}`);
    if (!mission || !host) return;
    host.replaceChildren();
    const shell = missionShell(mission);
    if (mission.type === 'questions') {
      renderQuestionMission(mission, shell);
      appendMissionFooter(mission,shell);
    } else if (mission.type === 'multi') renderMultiMission(mission,shell);
    else if (mission.type === 'scenario') renderScenarioMission(mission,shell);
    host.append(shell);
  }

  function appendMissionFooter(mission,shell){
    const footer = document.createElement('div');
    footer.className = 'mission-footer';
    const status = document.createElement('div');
    status.className = 'mission-status';
    const actions = document.createElement('div');
    actions.className = 'mission-actions';
    const reset = document.createElement('button');
    reset.type='button';reset.className='secondary';reset.textContent='Reiniciar missão';
    reset.addEventListener('click',()=>resetMission(mission.id));
    actions.append(reset); footer.append(status,actions); shell.append(footer); updateMissionStatus(mission,shell);
  }

  function renderMultiMission(mission,shell){
    if (mission.sheet) {
      const sheet = document.createElement('div'); sheet.className='fake-sheet';
      ['Nome','Situação','Faltas','Risco'].forEach(v=>{const b=document.createElement('b');b.textContent=v;sheet.append(b);});
      [['Ana S.','Atenção','12','ALTO'],['Bruno M.','Regular','4','BAIXO']].flat().forEach(v=>{const s=document.createElement('span');s.textContent=v;sheet.append(s);});
      shell.append(sheet);
    }
    const answers = currentMissionAnswers(mission);
    if (!Array.isArray(answers.selected)) answers.selected=[];
    const options = document.createElement('div'); options.className='multi-options';
    mission.options.forEach(([value,text])=>{
      const label=document.createElement('label'); const input=document.createElement('input'); input.type='checkbox'; input.value=value; input.checked=answers.selected.includes(value); input.disabled=!!state.completed[mission.id];
      input.addEventListener('change',()=>{ answers.selected=[...options.querySelectorAll('input:checked')].map(node=>node.value); saveState(); });
      const span=document.createElement('span');span.textContent=text;label.append(input,span);options.append(label);
    });
    const feedback=document.createElement('div');feedback.className='question-feedback';feedback.setAttribute('role','status');
    if (answers.submitted) feedback.textContent=answers.lastCorrect ? `Correto. ${mission.explanation}` : `Revise. ${mission.explanation}`;
    else feedback.textContent='Marque os sinais e use “Conferir seleção”.';
    if(answers.lastCorrect)feedback.classList.add('ok');else if(answers.submitted)feedback.classList.add('warn');
    shell.append(options,feedback);
    const footer=document.createElement('div');footer.className='mission-footer';const status=document.createElement('div');status.className='mission-status';
    const actions=document.createElement('div');actions.className='mission-actions';
    const check=document.createElement('button');check.type='button';check.textContent='Conferir seleção';check.disabled=!!state.completed[mission.id];
    check.addEventListener('click',()=>{
      const correct=mission.options.filter(o=>o[2]).map(o=>o[0]).sort(); const chosen=[...answers.selected].sort();
      answers.submitted=true; answers.lastCorrect=correct.length===chosen.length && correct.every((v,i)=>v===chosen[i]);
      if(answers.lastCorrect){state.completed[mission.id]=true;announce(`Missão ${mission.id} concluída. ${mission.max} XP de treino.`);} saveState();renderMission(mission.id);paintScore();
    });
    const reset=document.createElement('button');reset.type='button';reset.className='secondary';reset.textContent='Reiniciar';reset.addEventListener('click',()=>resetMission(mission.id));
    actions.append(check,reset);footer.append(status,actions);shell.append(footer);updateMissionStatus(mission,shell);
  }

  function renderScenarioMission(mission,shell){
    const answers=currentMissionAnswers(mission); if(!answers.tracks) answers.tracks={};
    const selector=document.createElement('div');selector.className='scenario-selector';selector.setAttribute('role','group');selector.setAttribute('aria-label','Escolha a trilha do desafio final');
    Object.entries(mission.tracks).forEach(([key,track])=>{const button=document.createElement('button');button.type='button';button.textContent=track.label;button.setAttribute('aria-pressed',String(answers.track===key));button.disabled=!!state.completed[mission.id];button.addEventListener('click',()=>{answers.track=key;if(!answers.tracks[key])answers.tracks[key]={};answers.step=0;saveState();renderMission(mission.id);});selector.append(button);});
    shell.append(selector);
    if(!answers.track){const p=document.createElement('div');p.className='scenario-card';p.textContent='Escolha Mapa Quilombola ou EDA / Permanência para abrir o cenário.';shell.append(p);appendMissionFooter(mission,shell);return;}
    const track=mission.tracks[answers.track]; const card=document.createElement('div');card.className='scenario-card';card.innerHTML=`<p><strong>Cenário ${track.label}:</strong> ${track.scenario}</p>`;shell.append(card);
    const trackAnswers=answers.tracks[answers.track] || (answers.tracks[answers.track]={});
    const step=Math.max(0,Math.min(track.questions.length-1,Number(answers.step)||0));
    const question=track.questions[step];
    const stepLabel=document.createElement('p');stepLabel.className='scenario-step';stepLabel.textContent=`Etapa ${step+1} de ${track.questions.length}`;shell.append(stepLabel);
    const fieldset=document.createElement('fieldset');fieldset.className='mission-question scenario-question';
    const legend=document.createElement('legend');legend.textContent=question.prompt;
    const options=document.createElement('div');options.className='mission-options';
    const feedback=document.createElement('div');feedback.className='question-feedback';feedback.setAttribute('role','status');
    const selected=trackAnswers[question.id];
    question.options.forEach(([value,text])=>{const label=document.createElement('label');label.className='mission-option';const input=document.createElement('input');input.type='radio';input.name=`mission-${mission.id}-${answers.track}-${question.id}`;input.value=value;input.checked=selected===value;input.disabled=!!state.completed[mission.id];input.addEventListener('change',()=>{trackAnswers[question.id]=value;const correct=value===question.correct;feedback.className=`question-feedback ${correct?'ok':'warn'}`;feedback.textContent=`${correct?'Correto.':'Ainda não.'} ${question.explanation}`;saveState();renderMission(mission.id);});const span=document.createElement('span');span.textContent=text;label.append(input,span);options.append(label);});
    if(selected){const correct=selected===question.correct;feedback.className=`question-feedback ${correct?'ok':'warn'}`;feedback.textContent=`${correct?'Correto.':'Ainda não.'} ${question.explanation}`;}else feedback.textContent='Escolha uma resposta para receber uma pista.';
    fieldset.append(legend,options,feedback);shell.append(fieldset);
    const nav=document.createElement('div');nav.className='scenario-nav';
    const previous=document.createElement('button');previous.type='button';previous.textContent='← Etapa anterior';previous.disabled=step===0||!!state.completed[mission.id];previous.addEventListener('click',()=>{answers.step=step-1;saveState();renderMission(mission.id);});
    const next=document.createElement('button');next.type='button';const currentCorrect=trackAnswers[question.id]===question.correct;next.textContent=step===track.questions.length-1?'Concluir missão':'Próxima etapa →';next.disabled=!currentCorrect||!!state.completed[mission.id];next.addEventListener('click',()=>{if(step===track.questions.length-1){const allCorrect=track.questions.every(q=>trackAnswers[q.id]===q.correct);if(allCorrect){state.completed[mission.id]=true;saveState();announce(`Missão final concluída. ${mission.max} XP de treino.`);renderMission(mission.id);paintScore();}}else{answers.step=step+1;saveState();renderMission(mission.id);}});
    nav.append(previous,next);shell.append(nav);appendMissionFooter(mission,shell);
  }

  function resetMission(id){
    delete state.answers[id]; delete state.completed[id]; saveState(); renderMission(id); paintScore(); announce(`Missão ${id} reiniciada. Os XP desta missão foram removidos.`);
  }

  function resetAllMissions(){
    if(!confirm('Reiniciar as seis missões e zerar os XP de treino?')) return;
    state.completed={};state.answers={};saveState();MISSIONS.forEach(m=>renderMission(m.id));paintScore();announce('Todas as missões foram reiniciadas.');
  }

  function renderMissionSummary(){
    const container=$('missions-summary'); if(!container)return; container.replaceChildren();
    MISSIONS.forEach(mission=>{const card=document.createElement('article');card.className='mission-summary-card'+(state.completed[mission.id]?' complete':'');const strong=document.createElement('strong');strong.textContent=`Missão ${mission.id} · ${mission.badge}`;const span=document.createElement('span');span.textContent=state.completed[mission.id]?`Concluída · ${mission.max} XP de treino`:`Pendente · 0 / ${mission.max} XP`;const jump=document.createElement('button');jump.type='button';jump.textContent='Abrir';jump.addEventListener('click',()=>{closeDialog($('missions-dialog'));goToSlide(mission.slide,true);});card.append(strong,span,jump);container.append(card);});
  }

  function buildIndex(){
    const list=$('index-list'); slides.forEach((slide,index)=>{const button=document.createElement('button');button.type='button';button.textContent=`${String(index+1).padStart(2,'0')} · ${slide.dataset.title}`;button.addEventListener('click',()=>{closeDialog($('index-dialog'));show(index,{focus:true,scroll:true});});list.append(button);});
  }
  function updateIndexCurrent(){ $('index-list').querySelectorAll('button').forEach((button,index)=>{if(index===current)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');}); }
  function requiresReading(){ return innerWidth<900 || innerHeight<560; }
  function scaleDeck(){ if(reading)return;const rect=$('viewport').getBoundingClientRect();const factor=Math.min((rect.width-14)/1280,(rect.height-14)/720);document.documentElement.style.setProperty('--scale',String(Math.max(.35,factor))); }
  function setReading(value,user=false){ reading=!!value;document.body.classList.toggle('reading',reading);$('read-btn').setAttribute('aria-pressed',String(reading));$('read-btn').textContent=reading?'Modo apresentação':'Modo leitura';if(user){manualMode=reading?'reading':'presentation';try{localStorage.setItem(MODE_KEY,manualMode);}catch{}}slides.forEach((slide,index)=>{const active=index===current;slide.classList.toggle('active',active);if(!reading&&!active)slide.setAttribute('aria-hidden','true');else slide.removeAttribute('aria-hidden');});if(reading)document.documentElement.style.removeProperty('--scale');else requestAnimationFrame(scaleDeck);updateNavigation(); }
  function updateNavigation(){ $('counter').textContent=`${current+1} / ${slides.length}`;$('prev-btn').disabled=current===0;$('next-btn').disabled=current===slides.length-1;updateIndexCurrent();updateNotes(); }
  function show(index,{focus=false,scroll=false}={}){current=Math.max(0,Math.min(slides.length-1,index));slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);if(!reading&&i!==current)slide.setAttribute('aria-hidden','true');else slide.removeAttribute('aria-hidden');});try{history.replaceState(null,'','#'+slides[current].id);}catch{}updateNavigation();if(reading&&scroll){const root=document.documentElement;const previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';const top=slides[current].getBoundingClientRect().top+scrollY-$('toolbar').offsetHeight-8;scrollTo(0,Math.max(0,top));requestAnimationFrame(()=>{root.style.scrollBehavior=previous;});}if(focus){const heading=slides[current].querySelector('.title');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});} }
  function goToSlide(id,focus=false){const index=slides.findIndex(slide=>slide.id===id);if(index>=0)show(index,{focus,scroll:true});}
  function updateNotes(){const template=slides[current].querySelector('template.notes');$('notes-content').textContent=template?.content.textContent.trim()||'Sem notas adicionais para este slide.';}
  function openDialog(dialog){if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');}
  function closeDialog(dialog){if(dialog.open&&dialog.close)dialog.close();else dialog.removeAttribute('open');}

  function setupDialogs(){
    $('index-btn').addEventListener('click',()=>openDialog($('index-dialog')));$('missions-btn').addEventListener('click',()=>openDialog($('missions-dialog')));$('notes-btn').addEventListener('click',()=>{updateNotes();openDialog($('notes-dialog'));});$('help-btn').addEventListener('click',()=>openDialog($('help-dialog')));document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>closeDialog(button.closest('dialog'))));document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog(dialog);}));$('reset-all-missions').addEventListener('click',resetAllMissions);
  }

  function setupInteractions(){
    $('confirm-training').classList.toggle('confirmed',state.confirmed);$('confirm-training').textContent=state.confirmed?'Confirmado: XP é treino, não avaliação.':'Entendi: os XP servem para aprender, não para avaliar.';$('confirm-training').addEventListener('click',()=>{state.confirmed=true;saveState();$('confirm-training').classList.add('confirmed');$('confirm-training').textContent='Confirmado: XP é treino, não avaliação.';announce('Regras das missões confirmadas.');});
    document.querySelectorAll('[data-diagnostic] article').forEach(card=>{card.querySelectorAll('button[data-value]').forEach(button=>button.addEventListener('click',()=>{card.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const correct=button.dataset.value===card.dataset.correct;const feedback=card.querySelector('.mini-feedback');feedback.className=`mini-feedback ${correct?'ok':'warn'}`;feedback.textContent=correct?'Boa leitura: ainda não há evidência suficiente para afirmar a frase.':'Reveja: a frase não possui fonte ou contexto suficiente para ser tratada como fato.';}));});
    document.querySelectorAll('[data-reveal-group]').forEach(group=>{const detail=group.querySelector('.reveal-detail');group.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>{group.querySelectorAll('[data-detail]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));detail.textContent=button.dataset.detail;}));});
    document.querySelectorAll('[data-family-grid] button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-family-grid] button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('family-title').textContent=button.querySelector('b').textContent;$('family-map').textContent='Mapa: '+button.dataset.map;$('family-eda').textContent='EDA: '+button.dataset.eda;}));
    const tabs=$('[data-tabs]'); if(tabs){const tabButtons=[...tabs.querySelectorAll('[role="tab"]')];tabButtons.forEach((button,index)=>{button.addEventListener('click',()=>activateTab(button));button.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;const next=tabButtons[(index+direction+tabButtons.length)%tabButtons.length];activateTab(next);next.focus();}});});}
    function activateTab(button){const tabsRoot=button.closest('[data-tabs]');tabsRoot.querySelectorAll('[role="tab"]').forEach(tab=>tab.setAttribute('aria-selected',String(tab===button)));tabsRoot.querySelectorAll('[role="tabpanel"]').forEach(panel=>panel.hidden=panel.id!==button.getAttribute('aria-controls'));}
    document.querySelectorAll('[data-concepts] button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-concepts] button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('concept-detail').textContent=button.dataset.detail;}));
    const reflection=$('reflection');reflection.value=state.reflection||'';reflection.addEventListener('input',()=>{state.reflection=reflection.value;saveState();});
  }

  function setupControls(){
    $('prev-btn').addEventListener('click',()=>show(current-1,{focus:true,scroll:true}));$('next-btn').addEventListener('click',()=>{if(current===4&&!state.confirmed){announce('Confirme que os XP não valem nota antes de avançar.');$('confirm-training').focus();return;}show(current+1,{focus:true,scroll:true});});$('read-btn').addEventListener('click',()=>setReading(!reading,true));$('reset-btn').addEventListener('click',()=>{const id=slides[current].dataset.missionId;if(id)resetMission(id);else announce('Este slide não possui missão pontuada para reiniciar.');});$('print-btn').addEventListener('click',()=>window.print());$('full-btn').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{announce('O navegador não permitiu alternar a tela cheia.');}});
    let savedContrast=false;try{savedContrast=localStorage.getItem(CONTRAST_KEY)==='true';}catch{}document.documentElement.classList.toggle('high-contrast',savedContrast);$('contrast-btn').setAttribute('aria-pressed',String(savedContrast));$('contrast-btn').addEventListener('click',()=>{const enabled=!document.documentElement.classList.contains('high-contrast');document.documentElement.classList.toggle('high-contrast',enabled);$('contrast-btn').setAttribute('aria-pressed',String(enabled));try{localStorage.setItem(CONTRAST_KEY,String(enabled));}catch{}});
    document.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]'))return;const target=event.target;if(target&&/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName))return;if(event.key==='ArrowRight'||event.key==='PageDown'){event.preventDefault();show(current+1,{focus:true,scroll:true});}else if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();show(current-1,{focus:true,scroll:true});}else if(event.key==='Home'){event.preventDefault();show(0,{focus:true,scroll:true});}else if(event.key==='End'){event.preventDefault();show(slides.length-1,{focus:true,scroll:true});}});
    addEventListener('resize',()=>{if(manualMode===null)setReading(requiresReading(),false);else if(!reading)scaleDeck();});document.addEventListener('fullscreenchange',()=>{if(!reading)requestAnimationFrame(scaleDeck);$('full-btn').textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia';});
  }

  function init(){
    buildIndex();setupDialogs();setupInteractions();setupControls();MISSIONS.forEach(mission=>renderMission(mission.id));paintScore();
    try{manualMode=localStorage.getItem(MODE_KEY);}catch{manualMode=null;}if(manualMode==='reading')setReading(true);else if(manualMode==='presentation')setReading(false);else setReading(requiresReading());show(current,{scroll:false});
  }
  init();
})();
