/* Aula 06: interações locais, acessíveis e pontuação formativa recalculada. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const slides = [...document.querySelectorAll('.slide')];
  const timers = [];
  const answers = Object.create(null);
  let current = 0;
  let reading = true;
  let manualReading = false;
  let scrollFrame = 0;
  let scrollNavigationUntil = 0;
  let fitFrame = 0;

  const MISSIONS = [
    {
      id: '1', slide: 's03', title: 'Reconhecer o risco',
      question: 'Uma planilha real contém nome, turma, faltas, notas e motivo de saúde. Como testar o projeto nesta aula?',
      options: [
        { value: 'yes', text: 'Copiar a planilha: é um trabalho escolar.' },
        { value: 'name', text: 'Apagar só o nome e considerar a planilha anônima.' },
        { value: 'care', text: 'Usar dados sintéticos e confirmar o procedimento antes do uso real.' }
      ], correct: 'care',
      explanation: 'Há dados pessoais e um dado de saúde. Para testar, use dados sintéticos. Uso escolar não dispensa necessidade, segurança e procedimento institucional; apagar só o nome não garante anonimização.'
    },
    {
      id: '2', slide: 's08', title: 'Entender o consentimento',
      question: 'Qual afirmação sobre consentimento está correta?',
      options: [
        { value: 'any', text: 'Um aceite genérico permite todos os usos futuros.' },
        { value: 'context', text: 'É uma das bases legais; quando usada, precisa de decisão livre, informada, inequívoca e para finalidade determinada.' },
        { value: 'only', text: 'É a única base legal possível em todos os tratamentos.' }
      ], correct: 'context',
      explanation: 'A LGPD prevê diferentes bases legais. Quando o consentimento é a base usada, ele deve ser livre, informado e inequívoco, para finalidade determinada, com possibilidade de revogação facilitada. A equipe segue o procedimento da instituição.'
    },
    {
      id: '3', slide: 's09', title: 'Usar o mínimo necessário',
      question: 'Para testar um filtro de frequência, o que a equipe deve preparar?',
      options: [
        { value: 'minimum', text: 'Registros sintéticos com apenas os campos necessários ao filtro.' },
        { value: 'all', text: 'Nome, CPF, endereço e histórico de saúde de estudantes reais, por garantia.' },
        { value: 'public', text: 'Qualquer planilha da internet, sem conferir sua origem ou contexto.' }
      ], correct: 'minimum',
      explanation: 'O princípio da necessidade limita os dados ao mínimo para uma finalidade clara. Para a atividade, registros sintéticos permitem testar o filtro sem expor estudantes reais. Disponibilidade pública não elimina cuidados.'
    },
    {
      id: '4', slide: 's11', title: 'Distinguir anonimização',
      question: 'A equipe trocou nomes por códigos e guardou uma chave que liga os códigos às pessoas. O que isso significa?',
      options: [
        { value: 'anonymous', text: 'Os dados ficaram automaticamente anônimos e podem ser publicados.' },
        { value: 'synthetic', text: 'Os registros passaram a ser sintéticos, sem relação com pessoas reais.' },
        { value: 'pseudonym', text: 'É pseudonimização: a chave permite voltar à pessoa, e os dados ainda exigem proteção.' }
      ], correct: 'pseudonym',
      explanation: 'Pseudonimização reduz a associação direta, mas uma informação adicional pode restabelecer o vínculo. Não equivale a anonimização. Outros campos e cruzamentos também podem permitir reconhecimento.'
    },
    {
      id: '5', slide: 's13', title: 'Registrar a proveniência',
      question: 'Qual registro permite conferir a origem de um número usado no projeto?',
      options: [
        { value: 'trace', text: 'Fonte, data/versão, transformações, responsável pela verificação e restrições de uso.' },
        { value: 'ai', text: 'A frase “a IA informou”, sem conferir documentos ou dados.' },
        { value: 'memory', text: 'Somente o valor final, sem registrar de onde veio.' }
      ], correct: 'trace',
      explanation: 'Proveniência registra origem, histórico e responsáveis. Se houver IA, declare ferramenta, data, finalidade e verificação; a saída da IA, sozinha, não é evidência. Não envie dados pessoais ou narrativas não autorizadas.'
    }
  ];

  const CASES = {
    memorias: {
      title: 'Mapa de Memórias Quilombolas',
      html: '<p><strong>Fonte histórica pública:</strong> o cadastro MuseusBr registra a fundação da Associação de Mulheres de Itamatatiua em 1989.</p><p><strong>Planejamento fictício:</strong> a equipe cogita entrevistar uma pessoa da comunidade.</p><ul><li>Registre o fato histórico com a fonte e seu contexto; não acrescente afirmações sem evidência.</li><li>Nome, voz, imagem e depoimento exigem procedimento definido antes da coleta.</li><li>Nesta aula, a equipe apenas planeja: não contata nem grava ninguém.</li></ul>'
    },
    permanencia: {
      title: 'Permanência e Evasão Escolar',
      html: '<p><strong>Versão segura para aula:</strong> tabela sintética para testar campos, filtros e hipóteses.</p><p><strong>Versão de risco:</strong> planilha real com nome, faltas, notas e motivo de saúde.</p><ul><li>Usem dados sintéticos ou agregados preparados para a atividade.</li><li>Dados reais de estudantes dependem de procedimento institucional específico.</li><li>Remover o nome não garante anonimização; evitem também inferências sobre pessoas.</li></ul>'
    }
  };

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function announce(message) {
    $('lesson-status').textContent = message;
  }

  function missionState(mission) {
    const selected = mission.options.find(option => option.value === answers[mission.id]);
    const correct = !!selected && selected.value === mission.correct;
    return {
      id: mission.id, label: mission.title, question: mission.question,
      answer: selected?.text || 'Não respondida', value: selected?.value || '',
      earned: correct ? 20 : 0, max: 20, answered: !!selected, correct,
      status: !selected ? 'Pendente' : correct ? 'Correta' : 'Revisar',
      explanation: selected ? mission.explanation : 'Ainda não respondida. Vale 0 XP até uma resposta correta.'
    };
  }

  function scoring() {
    const missions = MISSIONS.map(missionState);
    const answered = missions.filter(mission => mission.answered).length;
    const correct = missions.filter(mission => mission.correct).length;
    return {
      label: 'XP de aprendizagem', earned: correct * 20, max: 100,
      answered, total: MISSIONS.length, pending: MISSIONS.length - answered,
      correct, status: answered === MISSIONS.length ? 'Todos respondidos' : 'Em andamento',
      description: 'Cada resposta atual correta vale 20 XP. Respostas incorretas ou não respondidas valem 0. Revisar não acumula pontos. Atividade formativa: não substitui nota oficial, autorização institucional ou avaliação de conformidade com a LGPD.',
      missions: missions.map(({ label, earned, max, status }) => ({ label, earned, max, status }))
    };
  }

  function snapshot() {
    return {
      schema: 'ppi-aula06-missoes-v1', version: '2.0',
      team: $('lesson-team').value.trim(), answers: { ...answers }, scoring: scoring(),
      missions: MISSIONS.map(missionState)
    };
  }

  function documentModel() {
    const state = snapshot();
    return {
      title: 'Aula 06 — Missões de Proteção de Dados',
      institution: 'Instituto Federal do Maranhão — Campus Itapecuru-Mirim',
      course: 'Técnico em Informática Integrado ao Ensino Médio',
      discipline: 'Prática Profissional Integrada I — PPI I',
      lesson: 'Aula 06 — Ética e Proteção de Dados',
      professor: 'Prof. Dr. Thales Levi Azevedo Valente',
      team: state.team || 'Não informada', members: [],
      project: 'Percurso de aprendizagem: consentimento, privacidade, LGPD e proveniência',
      date: new Date().toLocaleDateString('pt-BR'), version: '2.0', scoring: state.scoring,
      sections: state.missions.map(mission => ({
        title: 'Missão ' + mission.id + ' — ' + mission.label,
        items: [
          ['Pergunta', mission.question], ['Resposta atual', mission.answer],
          ['Situação e pontuação', mission.status + ' · ' + mission.earned + ' / ' + mission.max + ' XP'],
          ['Comentário', mission.explanation]
        ]
      }))
    };
  }

  function paintScoring() {
    const score = scoring();
    $('lesson-score').textContent = score.earned + ' / 100 XP';
    $('lesson-progress').value = score.earned;
    $('lesson-progress-text').textContent = score.answered + ' de 5 desafios respondidos';
    $('missions-score').textContent = score.earned + ' / 100 XP · ' + score.answered + ' de 5 respondidos · ' + score.pending + ' pendentes';
    MISSIONS.forEach(mission => {
      const state = missionState(mission);
      const feedback = $('mission-feedback-' + mission.id);
      const feedbackText = state.status + ' · ' + state.earned + ' / 20 XP. ' + state.explanation;
      if (feedback.textContent !== feedbackText) feedback.textContent = feedbackText;
      feedback.className = 'mission-feedback' + (state.correct ? ' correct' : state.answered ? ' review' : '');
      document.querySelectorAll('input[name="mission-' + mission.id + '"]').forEach(input => {
        input.checked = input.value === state.value;
      });
      document.querySelectorAll('[data-mission-summary="' + mission.id + '"]').forEach(node => {
        node.textContent = state.status + ' · ' + state.earned + ' / 20 XP';
      });
    });
    const first = missionState(MISSIONS[0]);
    $('privacy-quiz').querySelectorAll('button[data-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.choice === first.value));
    });
    $('privacy-feedback').className = 'feedback' + (first.correct ? ' ok' : first.answered ? ' warn' : '');
    $('privacy-feedback').textContent = first.earned + ' / 20 XP. ' + (first.answered ? (first.correct ? 'Use dados sintéticos e confirme o procedimento antes do uso real.' : 'Reveja: finalidade escolar e retirada do nome não eliminam os riscos.') : 'Ainda não respondida. Escolha a próxima ação da equipe.');
  }

  function chooseAnswer(missionId, choice) {
    const mission = MISSIONS.find(item => item.id === missionId);
    if (!mission || (choice && !mission.options.some(option => option.value === choice))) return;
    if (choice) answers[missionId] = choice;
    else delete answers[missionId];
    paintScoring();
    const state = missionState(mission);
    announce('Missão ' + missionId + ': ' + state.status.toLowerCase() + '. ' + state.earned + ' de 20 XP. Total: ' + scoring().earned + ' de 100 XP.');
  }

  function buildMissions() {
    MISSIONS.forEach(mission => {
      const card = element('fieldset', undefined, 'mission-card');
      card.id = 'mission-' + mission.id;
      const legend = element('legend', 'Missão ' + mission.id + ' · ' + mission.title + ' · 20 XP');
      legend.tabIndex = -1;
      const question = element('p', mission.question, 'question');
      question.id = 'mission-question-' + mission.id;
      const options = element('div', undefined, 'mission-options');
      card.setAttribute('aria-describedby', question.id);
      mission.options.forEach((option, index) => {
        const label = element('label', undefined, 'mission-option');
        const input = element('input');
        input.type = 'radio';
        input.name = 'mission-' + mission.id;
        input.id = 'mission-' + mission.id + '-option-' + index;
        input.value = option.value;
        input.addEventListener('change', () => chooseAnswer(mission.id, option.value));
        label.append(input, element('span', option.text));
        options.append(label);
      });
      const feedback = element('div', undefined, 'mission-feedback');
      feedback.id = 'mission-feedback-' + mission.id;
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      const clear = element('button', 'Deixar esta missão em branco', 'mission-clear');
      clear.type = 'button';
      clear.setAttribute('aria-label', 'Deixar esta missão em branco: missão ' + mission.id);
      clear.addEventListener('click', () => chooseAnswer(mission.id, ''));
      card.append(legend, question, options, feedback, clear);
      $('mission-list').append(card);
    });
  }

  function pauseTimers() { timers.forEach(timer => timer.pause()); }
  function requiresReading() { return innerWidth < 1100 || innerHeight < 680; }
  function scale() {
    if (reading) return;
    const rect = $('viewport').getBoundingClientRect();
    const factor = Math.min((rect.width - 14) / 1280, (rect.height - 14) / 720);
    document.documentElement.style.setProperty('--scale', String(Math.max(0.1, factor)));
  }

  function updateNavigation() {
    $('counter').textContent = (current + 1) + ' / ' + slides.length;
    $('prev-btn').disabled = current === 0;
    $('next-btn').disabled = current === slides.length - 1;
    $('index-list').querySelectorAll('button').forEach((button, index) => {
      if (index === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  function show(index, options = {}) {
    current = Math.max(0, Math.min(slides.length - 1, Number(index) || 0));
    pauseTimers();
    slides.forEach((slide, number) => {
      const active = number === current;
      slide.classList.toggle('active', active);
      if (!reading && !active) slide.setAttribute('aria-hidden', 'true');
      else slide.removeAttribute('aria-hidden');
    });
    updateNavigation();
    try { history.replaceState(null, '', '#' + slides[current].id); } catch { /* Local files can restrict history. */ }
    if (reading && options.scroll !== false) {
      scrollNavigationUntil = performance.now() + 150;
      slides[current].scrollIntoView({ block: 'start', behavior: 'auto' });
    }
    if (options.focus) {
      const heading = slides[current].querySelector('.title');
      const target = current === 0 ? $('deck') : heading;
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
    scale();
    ensureReadableCanvas();
  }

  function ensureReadableCanvas() {
    if (reading || fitFrame) return;
    fitFrame = requestAnimationFrame(() => {
      fitFrame = 0;
      if (reading) return;
      const slide = slides[current];
      const body = slide.querySelector('.body');
      if (body && (body.scrollHeight > body.clientHeight + 2 || body.scrollWidth > body.clientWidth + 2)) {
        setReading(true);
        announce('Modo leitura ativado para mostrar todo o conteúdo com o tamanho de texto escolhido.');
      }
    });
  }

  function setReading(value) {
    manualReading = !!value;
    reading = manualReading || requiresReading();
    document.body.classList.toggle('reading', reading);
    $('read-btn').setAttribute('aria-pressed', String(reading));
    $('read-btn').disabled = requiresReading();
    $('read-btn').textContent = requiresReading() ? 'Leitura automática' : 'Modo leitura';
    $('read-btn').title = requiresReading() ? 'Leitura fluida para manter a legibilidade nesta tela.' : 'Alternar entre leitura contínua e apresentação';
    show(current, { scroll: false });
  }

  function modal(id, missionId) {
    pauseTimers();
    const dialog = $(id);
    if (!dialog.open) dialog.showModal();
    if (missionId) {
      const card = $('mission-' + missionId);
      card?.querySelector('legend')?.focus();
      card?.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }

  function renderReport() {
    const model = documentModel();
    const root = $('lesson-report');
    root.replaceChildren();
    root.append(element('p', model.institution, 'report-note'), element('h1', model.title));
    root.append(element('p', 'Equipe: ' + model.team + '\nData: ' + model.date));
    root.append(element('p', model.scoring.earned + ' / ' + model.scoring.max + ' XP', 'report-score'));
    root.append(element('p', model.scoring.answered + ' de ' + model.scoring.total + ' desafios respondidos · ' + model.scoring.pending + ' pendentes · ' + model.scoring.correct + ' corretos.'));
    root.append(element('p', model.scoring.description, 'report-note'));
    model.sections.forEach(section => {
      const block = element('section', undefined, 'report-answer');
      block.append(element('h2', section.title));
      section.items.forEach(([label, value]) => block.append(element('h3', label), element('p', value)));
      root.append(block);
    });
    root.append(element('p', 'Registro local da atividade. Pode ser exportado incompleto. A pontuação reflete apenas as respostas atuais desta cópia.', 'report-note'));
    return model;
  }

  function printResult(fullLesson = false) {
    pauseTimers();
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    document.body.classList.toggle('print-full-lesson', fullLesson);
    renderReport();
    window.print();
  }

  async function exportPdf() {
    pauseTimers();
    const controls = [$('pdf-btn'), $('missions-pdf')];
    controls.forEach(button => button.disabled = true);
    try {
      if (!window.PpiPdf?.generate) throw new Error('O gerador ainda não está disponível.');
      const bytes = await window.PpiPdf.generate(documentModel());
      const blob = bytes instanceof Blob ? bytes : new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = element('a');
      link.href = url;
      link.download = 'ppi1_aula06_missoes_' + scoring().earned + 'xp.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      announce('PDF gerado com ' + scoring().earned + ' de 100 XP e ' + scoring().pending + ' desafios pendentes.');
    } catch (error) {
      announce('O PDF direto não ficou disponível. A versão de impressão preserva o resultado.');
      document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
      $('pdf-fallback-message').textContent = 'O PDF direto não ficou disponível. A versão de impressão preserva seu texto, ' + scoring().earned + ' de 100 XP e ' + scoring().pending + ' perguntas pendentes. Selecione Abrir impressão e escolha Salvar como PDF como destino.';
      modal('pdf-fallback-dialog');
    } finally { controls.forEach(button => button.disabled = false); }
  }

  $('prev-btn').addEventListener('click', () => show(current - 1, { focus: true }));
  $('next-btn').addEventListener('click', () => show(current + 1, { focus: true }));
  $('read-btn').addEventListener('click', () => setReading(!reading));
  $('index-btn').addEventListener('click', () => modal('index-dialog'));
  $('help-btn').addEventListener('click', () => modal('help-dialog'));
  $('missions-btn').addEventListener('click', () => modal('missions-dialog'));
  $('print-btn').addEventListener('click', () => printResult());
  $('missions-print').addEventListener('click', () => printResult());
  $('pdf-fallback-print').addEventListener('click', () => printResult());
  $('print-slides-btn').addEventListener('click', () => printResult(true));
  $('pdf-btn').addEventListener('click', exportPdf);
  $('missions-pdf').addEventListener('click', exportPdf);
  $('notes-btn').addEventListener('click', () => {
    const slide = slides[current];
    $('notes-title').textContent = 'Slide ' + (current + 1) + ' · ' + slide.dataset.title;
    $('notes-body').textContent = slide.querySelector('template.notes')?.content.textContent || 'Sem notas.';
    modal('notes-dialog');
  });
  $('full-btn').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else announce('Tela cheia não está disponível neste navegador. O modo leitura continua disponível.');
    } catch { announce('O navegador não permitiu tela cheia. O modo leitura continua disponível.'); }
  });
  if (!document.documentElement.requestFullscreen) {
    $('full-btn').disabled = true;
    $('full-btn').title = 'Tela cheia não suportada neste navegador.';
  }
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
  document.querySelectorAll('[data-open-mission]').forEach(button => button.addEventListener('click', () => modal('missions-dialog', button.dataset.openMission)));
  slides.forEach((slide, index) => {
    const button = element('button', String(index + 1).padStart(2, '0') + ' · ' + slide.dataset.title);
    button.type = 'button';
    button.addEventListener('click', () => { $('index-dialog').close(); show(index, { focus: true }); });
    $('index-list').append(button);
  });
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.dataset.original = button.textContent;
    button.addEventListener('click', () => {
      const answer = $(button.dataset.answer);
      answer.hidden = !answer.hidden;
      button.setAttribute('aria-expanded', String(!answer.hidden));
      button.textContent = answer.hidden ? button.dataset.original : 'Ocultar resposta';
    });
  });
  $('privacy-quiz').querySelectorAll('button[data-choice]').forEach(button => {
    button.addEventListener('click', () => chooseAnswer('1', button.dataset.choice));
  });
  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    if (reading || document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (active?.closest('input,textarea,select,button,a,summary,[contenteditable="true"],[role="button"],[role="radio"]')) return;
    let next;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') next = current + 1;
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') next = current - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = slides.length - 1;
    if (next !== undefined) { event.preventDefault(); show(next, { focus: true }); }
  });

  const tabs = [...document.querySelectorAll('#case-tabs button')];
  function renderCase(key) {
    const chosen = CASES[key];
    if (!chosen) return;
    tabs.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.case === key)));
    $('case-content').innerHTML = '<h2>' + chosen.title + '</h2>' + chosen.html;
  }
  tabs.forEach(button => button.addEventListener('click', () => renderCase(button.dataset.case)));
  renderCase('memorias');

  function updateRisk() {
    const chance = Number($('risk-prob').value || 0);
    const impact = Number($('risk-impact').value || 0);
    const box = $('risk-score');
    if (!chance || !impact) {
      box.textContent = 'Escolha chance e impacto. O índice de risco não altera os XP.';
      box.className = 'risk-score';
      return;
    }
    const score = chance * impact;
    const level = score <= 2 ? 'Baixo' : score <= 4 ? 'Moderado' : 'Alto';
    box.textContent = 'Índice de risco: ' + score + ' · ' + level + '. Não é XP.';
    box.className = 'risk-score ' + (score <= 2 ? 'ok' : score <= 4 ? 'warn' : 'bad');
  }
  ['risk-prob', 'risk-impact'].forEach(id => $(id).addEventListener('change', updateRisk));
  updateRisk();

  document.querySelectorAll('.timer').forEach(root => {
    const start = Number(root.dataset.seconds || 0);
    let left = start;
    let interval = null;
    const output = root.querySelector('.clock');
    const toggle = root.querySelector('.timer-toggle');
    const reset = root.querySelector('.timer-reset');
    const slide = root.closest('.slide');
    output.setAttribute('role', 'timer');
    output.setAttribute('aria-label', 'Tempo opcional da atividade');
    output.setAttribute('aria-live', 'off');
    const paint = () => {
      output.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
      toggle.disabled = left === 0;
    };
    const pause = () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
        toggle.textContent = left === start ? 'Iniciar' : 'Continuar';
      }
    };
    const play = () => {
      if (interval !== null || left === 0) return;
      toggle.textContent = 'Pausar';
      interval = setInterval(() => {
        left = Math.max(0, left - 1);
        paint();
        if (left === 0) {
          clearInterval(interval); interval = null;
          toggle.textContent = 'Concluído';
          announce('O tempo sugerido desta etapa terminou. Você pode continuar; isso não altera a pontuação.');
        }
      }, 1000);
    };
    const resetTimer = () => { pause(); left = start; toggle.textContent = 'Iniciar'; paint(); };
    toggle.addEventListener('click', () => interval !== null ? pause() : play());
    reset.addEventListener('click', resetTimer);
    paint();
    timers.push({ slide, pause, reset: resetTimer });
  });

  $('reset-btn').addEventListener('click', () => {
    const slide = slides[current];
    slide.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(input => { input.checked = false; });
    slide.querySelectorAll('select').forEach(select => { select.selectedIndex = 0; });
    slide.querySelectorAll('[data-answer]').forEach(button => {
      $(button.dataset.answer).hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.textContent = button.dataset.original;
    });
    MISSIONS.filter(mission => mission.slide === slide.id).forEach(mission => { delete answers[mission.id]; });
    timers.filter(timer => timer.slide === slide).forEach(timer => timer.reset());
    if (slide.id === 's14') renderCase('memorias');
    updateRisk();
    paintScoring();
    announce('Somente o slide ' + (current + 1) + ' foi reiniciado. Pontuação atual: ' + scoring().earned + ' de 100 XP.');
  });

  window.addEventListener('resize', () => setReading(manualReading));
  document.addEventListener('fullscreenchange', () => { setReading(manualReading); scale(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseTimers(); });
  window.addEventListener('beforeprint', () => { pauseTimers(); renderReport(); });
  window.addEventListener('afterprint', () => { document.body.classList.remove('print-full-lesson'); });
  window.addEventListener('hashchange', () => {
    const match = location.hash.match(/^#s(\d{2})$/);
    if (match) show(Number(match[1]) - 1, { focus: true });
  });
  window.addEventListener('scroll', () => {
    if (!reading || scrollFrame || document.querySelector('dialog[open]')) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (performance.now() < scrollNavigationUntil) return;
      let best = 0;
      slides.forEach((slide, index) => { if (slide.getBoundingClientRect().top <= innerHeight * 0.28) best = index; });
      if (best !== current) { current = best; updateNavigation(); }
    });
  }, { passive: true });

  buildMissions();
  paintScoring();
  const hash = location.hash.match(/^#s(\d{2})$/);
  if (hash) current = Math.max(0, Math.min(slides.length - 1, Number(hash[1]) - 1));
  document.documentElement.classList.remove('no-js');
  setReading(false);
  if (hash && reading) show(current, { scroll: true });
  if (window.ResizeObserver) {
    const contentObserver = new ResizeObserver(ensureReadableCanvas);
    document.querySelectorAll('.slide .body > *').forEach(node => contentObserver.observe(node));
  }
  document.fonts?.ready.then(ensureReadableCanvas);
  window.ppiAula06Lesson = Object.freeze({ snapshot, documentModel });
})();
