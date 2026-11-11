/* Aula 08 · apresentação, treino e rascunho local. Nenhuma chamada de rede. */
(function () {
  'use strict';
  const C = window.PPI_A08_CONTENT;
  const M = window.PPI_A08_MODEL;
  const $ = id => document.getElementById(id);
  let state = M.createState();
  let storageBlocked = false;
  let current = Math.max(0, C.slides.findIndex(s => '#' + s.id === location.hash));
  let manualReading = null;
  let catalogType = 'RF';
  const questionSteps = { memorias: {}, permanencia: {} };
  const reviewText = {
    source: 'Relacionei cada requisito à fonte; hipóteses continuam marcadas como pendentes.',
    measurable: 'Meu RNF e meus critérios dizem como observar o resultado esperado.',
    scope: 'Cada requisito tem uma obrigação principal e uma prioridade justificada.',
    ethics: 'Usei apenas dados sintéticos e revi acesso, proteção e possíveis ambiguidades.'
  };
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, className, action) {
    const node = el('button', text, className); node.type = 'button';
    if (action) node.addEventListener('click', action);
    return node;
  }
  function announce(text) { $('live-region').textContent = text; }
  function storageStatus(text) { if ($('storage-status').textContent !== text) $('storage-status').textContent = text; }
  try {
    const saved = localStorage.getItem(M.STORAGE_KEY);
    if (saved !== null) {
      try { state = M.validateState(saved); storageStatus('Rascunho retomado neste dispositivo'); }
      catch (_) { storageBlocked = true; storageStatus('Rascunho inválido preservado. Exporte o novo antes de apagar.'); }
    }
  } catch (_) { storageStatus('Só em memória: baixe sua síntese para guardar.'); }
  function save() {
    if (storageBlocked) return;
    try { localStorage.setItem(M.STORAGE_KEY, JSON.stringify(state)); storageStatus('Salvo neste dispositivo'); }
    catch (_) { storageStatus('Só em memória: baixe sua síntese para guardar.'); }
  }
  function track() { return C.tracks[state.activeTrack]; }
  function dossierStageFor(slideId) {
    const target = C.slides.findIndex(s => s.id === slideId);
    const found = track().dossierStages.filter(stage =>
      C.slides.findIndex(s => s.id === stage.slideId) <= target);
    return found.length ? found[found.length - 1] : null;
  }
  function slideData(source) {
    return { ...source, ...(track().slides[source.id] || {}), dossierStage: dossierStageFor(source.id) };
  }
  function updateScore() {
    const result = M.score(state);
    $('xp-total').textContent = result.xp + ' / 100 XP';
    $('mission-progress').textContent = result.completed + ' de 6 missões concluídas';
    return result;
  }
  function cards(items) {
    const group = el('div', null, 'cards');
    items.forEach(item => {
      const card = el('section', null, 'concept-card');
      card.append(el('h3', item.title), el('p', item.text));
      if (item.tag) card.append(el('span', item.tag, 'tag'));
      group.append(card);
    });
    return group;
  }
  function openDialog(id) {
    const dialog = $(id);
    if (!dialog.open) dialog.showModal();
  }
  const typeNames = { RF: 'Requisito funcional (RF)', RNF: 'Requisito não funcional (RNF)', RD: 'Requisito de dados (RD)' };
  function showGlossary() {
    const host = $('glossary-content'); host.replaceChildren();
    const example = state.activeTrack === 'permanencia'
      ? 'EV-P01 = primeira evidência da trilha Permanência. P1, P2 e P3 são períodos fictícios; L01 a L06 são linhas da tabela, nunca códigos de alunos.'
      : 'EV-M01 = primeira evidência da trilha Memórias. R01 a R06 são os seis relatos inventados, nunca códigos de pessoas.';
    host.append(el('p', 'As letras são etiquetas para encontrar partes do mesmo documento. Não é preciso decorar: leia primeiro o nome completo.', 'dialog-intro'));
    host.append(el('p', example, 'glossary-example'));
    const entries = el('dl', null, 'glossary-list');
    C.glossary.forEach(item => {
      const entry = el('div', null, 'glossary-term');
      entry.append(el('dt', item.code + ' — ' + item.term), el('dd', item.meaning));
      entries.append(entry);
    });
    host.append(entries);
    openDialog('glossary-dialog');
  }
  function showExample(type) {
    const example = track().catalogExamples[type];
    const container = $('notes-content'); container.replaceChildren();
    container.append(el('h3', 'Exemplo sintético · ' + typeNames[type] + ' · ' + track().shortLabel));
    for (const [label, value] of [['Enunciado', example.text], ['Fonte', example.source], ['Critério de aceitação', example.criterion]]) {
      container.append(el('h4', label), el('p', value));
    }
    container.append(el('p', 'Use o exemplo para comparar. Ele não preenche nem avalia sua resposta.'));
    openDialog('notes-dialog');
  }
  function missionRenderer(host, missionId, focusTarget) {
    const definition = C.missions.find(m => m.id === missionId);
    const qs = M.questions(state.activeTrack, missionId);
    const index = Math.min(questionSteps[state.activeTrack][missionId] || 0, qs.length - 1);
    const q = qs[index]; const selected = state.tracks[state.activeTrack].answers[q.id];
    const result = M.score(state).missions.find(m => m.id === missionId);
    host.replaceChildren(); host.className = 'mission-shell'; host.dataset.mission = missionId;
    const top = el('div', null, 'mission-top');
    top.append(el('h3', 'Questão ' + (index + 1) + ' de ' + qs.length));
    const status = el('p', result.completed ? 'Concluída · ' + result.xp + ' XP' : 'Não concluída · ' + result.correct + '/' + result.total + ' corretas · 0/' + result.max + ' XP', 'mission-state');
    status.dataset.complete = String(result.completed); top.append(status); host.append(top);
    const nav = el('div', null, 'question-nav'); nav.setAttribute('role', 'group'); nav.setAttribute('aria-label', 'Questões da missão ' + missionId.slice(1));
    qs.forEach((item, i) => {
      const correct = state.tracks[state.activeTrack].answers[item.id] === item.correct;
      const b = button(String(i + 1) + (correct ? ' ✓' : ''), 'question-step', () => {
        questionSteps[state.activeTrack][missionId] = i; missionRenderer(host, missionId, 'prompt');
      });
      b.setAttribute('aria-label', 'Questão ' + (i + 1) + (correct ? ', correta' : ', pendente'));
      if (i === index) b.setAttribute('aria-current', 'step');
      nav.append(b);
    });
    host.append(nav);
    const field = el('fieldset', null, 'question-fieldset'); field.dataset.question = q.id;
    const legend = el('legend', q.prompt, 'prompt'); legend.tabIndex = -1; field.append(legend);
    const options = el('div', null, 'options');
    q.options.forEach(option => {
      const b = button('', 'option', () => {
        M.answer(state, missionId, q.id, option.id); save(); updateScore();
        missionRenderer(host, missionId, option.id);
        announce(host.querySelector('.feedback').textContent + ' ' + M.score(state).xp + ' de 100 XP formativos.');
      });
      b.dataset.option = option.id; b.setAttribute('aria-pressed', String(selected === option.id));
      const letter = el('span', option.id.toUpperCase(), 'option-letter'); letter.setAttribute('aria-hidden', 'true');
      b.append(letter, el('span', option.text));
      if (selected === option.id) b.dataset.result = selected === q.correct ? 'correct' : 'incorrect';
      options.append(b);
    });
    field.append(options); host.append(field);
    const feedback = el('p', null, 'feedback'); feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite');
    if (selected) {
      const chosen = q.options.find(o => o.id === selected);
      feedback.dataset.correct = String(selected === q.correct);
      feedback.textContent = selected === q.correct ? 'Correto. ' + q.explanation : 'Tente novamente. ' + chosen.feedback + ' ' + q.explanation;
    } else feedback.textContent = 'Escolha uma resposta. Você pode tentar novamente sem perder pontos por tentativa.';
    host.append(feedback);
    const actions = el('div', null, 'mission-actions');
    actions.append(button('Reiniciar esta missão', 'reset-mission', () => {
      M.resetMission(state, missionId); questionSteps[state.activeTrack][missionId] = 0; save(); updateScore();
      missionRenderer(host, missionId, 'prompt'); announce('Missão reiniciada apenas nesta trilha. Demais respostas preservadas.');
    }));
    const previous = button('Questão anterior', 'question-prev', () => { questionSteps[state.activeTrack][missionId] = index - 1; missionRenderer(host, missionId, 'prompt'); });
    previous.disabled = index === 0;
    const next = button('Próxima questão', 'question-next', () => { questionSteps[state.activeTrack][missionId] = index + 1; missionRenderer(host, missionId, 'prompt'); });
    next.disabled = index === qs.length - 1;
    actions.append(previous, next); host.append(actions);
    if (focusTarget === 'prompt') {
      // Firefox precisa concluir o layout do legend inserido antes de receber foco.
      requestAnimationFrame(() => {
        if (!legend.isConnected) return;
        legend.getBoundingClientRect();
        legend.focus({ preventScroll: true });
      });
    }
    else if (focusTarget) host.querySelector('[data-option="' + focusTarget + '"]')?.focus({ preventScroll: true });
  }
  function exportJSON() {
    const content = JSON.stringify(M.exportData(state), null, 2) + '\n';
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }));
    const a = el('a'); a.href = url; a.download = 'ppi-aula08-' + state.activeTrack + '-rascunho-v1.json';
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Exportação local solicitada. Nenhum dado foi enviado.');
  }
  function addExportButtons(host, primary = false) {
    const actions = el('div', null, 'catalog-actions');
    const download = button('Baixar síntese JSON', 'primary', exportJSON);
    const print = button('Imprimir / salvar PDF', '', () => { buildPrint(); window.print(); });
    if (primary) { download.id = 'export-json'; print.id = 'print-btn'; }
    actions.append(download, print); host.append(actions);
  }
  function updateCatalogStatus() {
    const complete = M.completeness(state);
    const hint = $('catalog-completeness');
    if (hint) hint.textContent = complete.filled_fields + '/9 campos de texto registrados · completude não comprova qualidade.';
    document.querySelectorAll('[data-review]').forEach(input => { input.checked = state.tracks[state.activeTrack].review[input.dataset.review]; });
  }
  function catalogRenderer(host, keepFocus = false) {
    host.replaceChildren();
    const tabs = el('div', null, 'catalog-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Tipos de requisito do catálogo');
    M.TYPES.forEach(type => {
      const b = button(typeNames[type], '', () => { catalogType = type; catalogRenderer(host, true); });
      b.dataset.catalogTab = type; b.setAttribute('aria-pressed', String(type === catalogType)); tabs.append(b);
    }); host.append(tabs);
    const entry = el('section', null, 'catalog-entry'); entry.dataset.catalogKind = catalogType;
    entry.setAttribute('aria-label', 'Rascunho: ' + typeNames[catalogType]);
    const grid = el('div', null, 'catalog-grid');
    function field(label, key, type, choices) {
      const group = el('div', null, 'catalog-field'); const id = 'catalog-' + catalogType + '-' + key;
      const l = el('label', label); l.htmlFor = id; group.append(l);
      const input = el(type); input.id = id; input.dataset.field = key;
      if (type === 'select') choices.forEach(([value, name]) => { const option = el('option', name); option.value = value; input.append(option); });
      else { input.maxLength = 2000; if (type === 'textarea') input.rows = 2; else input.type = 'text'; }
      input.value = state.tracks[state.activeTrack].catalog[catalogType][key];
      input.addEventListener(type === 'select' ? 'change' : 'input', () => {
        M.setCatalog(state, catalogType, key, input.value); save(); updateCatalogStatus();
      });
      group.append(input); grid.append(group);
    }
    field('Descrição do ' + typeNames[catalogType].toLowerCase(), 'text', 'textarea');
    field('Critério · Dado / Quando / Então', 'criterion', 'textarea');
    field('ID e resumo da fonte sintética', 'source', 'input');
    field('Situação da fonte', 'sourceStatus', 'select', [['pending_hypothesis', 'Hipótese pendente'], ['evidence', 'Evidência sintética']]);
    field('Prioridade proposta', 'priority', 'select', [['must', 'Essencial agora'], ['should', 'Importante depois'], ['could', 'Pode esperar'], ['later', 'Fora do escopo atual']]);
    const help = el('div', null, 'catalog-field'); help.append(el('p', 'Compare sem copiar automaticamente.', 'field-help'), button('Ver exemplo de ' + catalogType, '', () => showExample(catalogType))); grid.append(help);
    entry.append(grid); host.append(entry);
    const status = el('p', '', 'catalog-hint'); status.id = 'catalog-completeness'; host.append(status);
    addExportButtons(host, true); updateCatalogStatus();
    if (keepFocus) tabs.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
  }
  function reviewRenderer(host) {
    const list = el('div', null, 'review-list');
    M.REVIEW.forEach(key => {
      const label = el('label'); const input = el('input'); input.type = 'checkbox'; input.dataset.review = key;
      input.checked = state.tracks[state.activeTrack].review[key];
      input.addEventListener('change', () => { M.setReview(state, key, input.checked); save(); });
      label.append(input, el('span', reviewText[key])); list.append(label);
    });
    host.append(list, el('p', 'Marcar os itens registra sua autoavaliação. A avaliação qualitativa docente continua pendente.', 'catalog-hint'));
    host.append(button('Voltar e ajustar o catálogo', '', () => goSlide(C.slides.findIndex(s => s.kind === 'catalog'))));
  }
  function exitRenderer(host) {
    const summary = el('div', null, 'summary-stats');
    for (const [value, title] of [['100 XP', 'máximo de treino'], ['3 itens', 'RF · RNF · Dados'], ['Pendente', 'avaliação docente']]) {
      const card = el('div'); card.append(el('strong', value), el('span', title)); summary.append(card);
    }
    host.append(summary);
    const group = el('div', null, 'exit-field'); const label = el('label', 'Meu requisito rastreável e uma hipótese ainda pendente'); label.htmlFor = 'exit-ticket';
    const field = el('textarea'); field.id = 'exit-ticket'; field.maxLength = 2000; field.rows = 3; field.value = state.tracks[state.activeTrack].exit;
    field.addEventListener('input', () => { M.setExit(state, field.value); save(); });
    group.append(label, field); host.append(group); addExportButtons(host);
  }
  function renderAll() {
    const deck = $('deck'); deck.replaceChildren();
    C.slides.forEach((source, i) => {
      const data = slideData(source); const slide = el('article', null, 'slide ' + data.kind);
      slide.id = data.id; slide.tabIndex = -1; slide.dataset.title = data.title; slide.setAttribute('aria-labelledby', data.id + '-title');
      const heading = el('header', null, 'slide-heading');
      const step = data.dossierStage ? ' · Etapa ' + (Number(data.dossierStage.id.slice(1)) + 1) + ': ' + data.dossierStage.title.toLowerCase() : '';
      heading.append(el('p', data.kicker + step, 'kicker'));
      const title = el(i === 0 ? 'h1' : 'h2', data.title); title.id = data.id + '-title'; heading.append(title);
      if (data.lead) heading.append(el('p', data.lead, 'lead')); slide.append(heading);
      const body = el('div', null, 'slide-body');
      if (data.kind === 'mission') { const host = el('div'); body.append(host); missionRenderer(host, data.missionId); }
      else if (data.kind === 'catalog') catalogRenderer(body);
      else if (data.kind === 'review') reviewRenderer(body);
      else if (data.kind === 'exit') exitRenderer(body);
      else {
        if (data.kind === 'cover') {
          const path = el('ol', null, 'hero-path'); ['Investigar a origem', 'Especificar a resposta', 'Conferir o resultado'].forEach(t => path.append(el('li', t))); body.append(path);
        }
        if (data.steps) { const list = el('ol', null, 'steps'); data.steps.forEach(step => list.append(el('li', step))); body.append(list); }
        if (data.cards) body.append(cards(data.cards));
        if (data.example) body.append(el('p', data.example, 'slide-example'));
      }
      slide.append(body);
      if (data.note) slide.append(el('p', data.note, 'slide-note'));
      const foot = el('footer', null, 'slide-footer'); foot.append(el('span', 'PPI I · IFMA Itapecuru-Mirim · Casos sintéticos'), el('strong', String(i + 1).padStart(2, '0') + ' / 26'));
      const back = el('a', 'Controles ↑', 'reading-top'); back.href = '#toolbar'; foot.append(back); slide.append(foot);
      deck.append(slide);
    });
    const list = $('index-list'); list.replaceChildren();
    C.slides.forEach((s, i) => {
      const b = button(String(i + 1).padStart(2, '0') + ' · ' + s.title, s.kind === 'mission' ? 'mission-link' : '', () => { $('index-dialog').close(); goSlide(i); });
      b.dataset.slide = s.id; list.append(b);
    });
    $('track-select').value = state.activeTrack; updateScore(); updateView(false); updateCatalogStatus();
  }
  function isReading() { return window.innerWidth < 900 || manualReading === true; }
  function fit() {
    if (isReading()) return;
    const reserved = $('toolbar').offsetHeight + $('policy-banner').offsetHeight + $('lesson-footer').offsetHeight + 24;
    const scale = Math.max(.15, Math.min(1, (window.innerWidth - 24) / 1280, (window.innerHeight - reserved) / 720));
    document.documentElement.style.setProperty('--deck-scale', String(scale));
  }
  function updateView(focus) {
    const reading = isReading(); document.body.classList.toggle('reading', reading);
    document.querySelectorAll('#deck .slide').forEach((s, i) => { s.classList.toggle('active', i === current); s.hidden = !reading && i !== current; });
    $('mode-btn').setAttribute('aria-pressed', String(reading));
    $('mode-btn').disabled = window.innerWidth < 900;
    $('mode-btn').title = window.innerWidth < 900 ? 'Modo leitura automático nesta largura.' : 'Alternar entre apresentação e leitura contínua';
    $('prev-btn').disabled = current === 0; $('next-btn').disabled = current === C.slides.length - 1;
    $('slide-counter').textContent = (current + 1) + ' / ' + C.slides.length;
    document.querySelectorAll('#index-list [data-slide]').forEach(b => { if (b.dataset.slide === C.slides[current].id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    fit();
    if (focus) {
      const target = $(C.slides[current].id); target.focus({ preventScroll: true });
      if (reading) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  function goSlide(index) {
    current = Math.max(0, Math.min(C.slides.length - 1, index));
    try { history.replaceState(null, '', '#' + C.slides[current].id); } catch (_) { /* file:// pode restringir history */ }
    updateView(true);
  }
  function showNotes() {
    const data = slideData(C.slides[current]); const host = $('notes-content'); host.replaceChildren();
    host.append(el('h3', data.title), el('p', data.note || data.lead || 'Converse com a turma antes de avançar.'));
    host.append(el('p', 'Os códigos das fichas são identificadores internos, não siglas para decorar. Use “Entenda os códigos” para consultar cada termo.'));
    const progress = el('ol', null, 'dossier-history');
    const activeSlideIndex = C.slides.findIndex(s => s.id === data.id);
    track().dossierStages.filter(stage => C.slides.findIndex(s => s.id === stage.slideId) <= activeSlideIndex)
      .forEach(stage => { const item = el('li'); item.append(el('strong', 'Etapa ' + (Number(stage.id.slice(1)) + 1) + ' · ' + stage.title + ' (código do documento: ' + stage.artifactId + ')'), el('p', stage.excerpt)); progress.append(item); });
    if (progress.childElementCount) {
      host.append(el('h4', 'Dossiê em construção · ' + track().shortLabel), progress);
      host.append(el('p', 'Cada versão incorpora a anterior. A fonte continua sintética; a validação de utilidade permanece pendente.'));
    }
    host.append(el('h4', 'Ritmo de referência · 50 minutos'), el('p', 'Retomada 5 min; exemplos e conceitos 10 min; missões guiadas 20 min; catálogo e revisão em equipe 10 min; síntese/ticket 5 min. Intercale explicação e prática.'));
    host.append(el('h4', 'Mediação e limites'), el('p', 'Nos exercícios abertos, discuta fonte, clareza, teste e limites. Não avalie qualidade por tamanho do texto. Casos sintéticos; nenhuma coleta externa.'));
    host.append(el('p', 'Proposta de replanejamento: formalizar requisitos antes da modelagem lógica prevista para 11/11 no plano fornecido. Não altera o SUAP. A publicação da Aula 07 não prova que foi ministrada.'));
    const list = el('ul'); C.sources.forEach(source => { const li = el('li'); const a = el('a', source.title); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; li.append(a); list.append(li); });
    host.append(el('h4', 'Referências consultadas'), list); openDialog('notes-dialog');
  }
  function buildPrint() {
    const data = M.exportData(state); const host = $('print-summary'); host.replaceChildren();
    host.append(el('h1', 'Aula 08 — Da evidência ao requisito'), el('p', track().label + ' · versão ' + data.schema_version), el('p', data.notice, 'print-notice'));
    host.append(el('p', 'Rascunho: ' + data.draft_status + ' · criado em ' + data.created_at + ' · atualizado em ' + data.updated_at));
    host.append(el('h2', 'Percurso de treino · ' + data.xp_formativo + '/100 XP'));
    const table = el('table'); const head = el('thead'); const row = el('tr');
    ['Missão', 'Questões corretas', 'Situação', 'XP formativo'].forEach(t => { const th = el('th', t); th.scope = 'col'; row.append(th); }); head.append(row); table.append(head);
    const tbody = el('tbody'); data.training.missions.forEach((m, i) => {
      const tr = el('tr'); [C.missions[i].title, m.correct + '/' + m.total, m.completed ? 'Concluída' : 'Não concluída', m.xp_formativo + '/' + C.missions[i].xp].forEach(t => tr.append(el('td', t))); tbody.append(tr);
    }); table.append(tbody); host.append(table);
    host.append(el('h2', 'Catálogo mínimo · rascunho'), el('p', data.completeness.filled_fields + '/9 campos de texto registrados. Completude não comprova qualidade.'));
    data.catalog.requirements.forEach(item => {
      const section = el('section'); section.append(el('h3', typeNames[item.type]));
      const dl = el('dl');
      const pairs = [['Código interno do requisito', item.requirement_id], ['Enunciado', item.text], ['Fonte sintética', item.source_ref], ['Situação da fonte', item.source_status === 'evidence' ? 'Evidência do cenário sintético' : 'Hipótese pendente de validação'], ['Critério de aceitação · Dado / Quando / Então', item.acceptance_criterion], ['Prioridade proposta', { must: 'Essencial agora', should: 'Importante depois', could: 'Pode esperar', later: 'Fora do escopo atual' }[item.priority]]];
      pairs.forEach(([k, v]) => dl.append(el('dt', k), el('dd', v.trim() || 'Pendente — ainda não registrado.')));
      section.append(dl); host.append(section);
    });
    host.append(el('h2', 'Autoavaliação guiada'));
    const checks = el('ul'); M.REVIEW.forEach(key => checks.append(el('li', (data.catalog.self_review[key] ? 'Declarado: ' : 'Pendente: ') + reviewText[key]))); host.append(checks);
    host.append(el('h2', 'Ticket de saída'), el('p', data.catalog.exit_ticket.trim() || 'Pendente — ainda não registrado.'));
    host.append(el('p', 'Avaliação qualitativa docente: pendente. Nota oficial: não calculada. Nenhuma submissão automática; a exportação é uma cópia local.'));
  }
  $('prev-btn').addEventListener('click', () => goSlide(current - 1));
  $('next-btn').addEventListener('click', () => goSlide(current + 1));
  $('index-btn').addEventListener('click', () => openDialog('index-dialog'));
  $('notes-btn').addEventListener('click', showNotes);
  $('glossary-btn').addEventListener('click', showGlossary);
  $('mode-btn').addEventListener('click', () => { manualReading = !isReading(); updateView(true); });
  $('contrast-btn').addEventListener('click', () => { const active = document.body.classList.toggle('contrast'); $('contrast-btn').setAttribute('aria-pressed', String(active)); });
  $('fullscreen-btn').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch (_) { announce('Tela cheia indisponível neste navegador. A apresentação continua funcionando.'); }
  });
  $('track-select').addEventListener('change', event => {
    M.switchTrack(state, event.target.value); save(); renderAll();
    announce('Trilha ' + track().label + '. Percurso separado; respostas da outra trilha preservadas.');
  });
  document.querySelectorAll('dialog [data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  $('clear-local-btn').addEventListener('click', () => {
    if (!window.confirm('Apagar as respostas e o catálogo das DUAS trilhas neste dispositivo? Exporte sua síntese antes, se quiser guardar.')) return;
    try { localStorage.removeItem(M.STORAGE_KEY); storageBlocked = false; state = M.createState(); questionSteps.memorias = {}; questionSteps.permanencia = {}; current = 0; catalogType = 'RF'; $('index-dialog').close(); renderAll(); storageStatus('Rascunhos apagados. Nova sessão local.'); goSlide(0); }
    catch (_) { announce('Não foi possível apagar o armazenamento. Use as configurações do navegador para limpar os dados deste site.'); }
  });
  window.addEventListener('resize', () => updateView(false));
  window.addEventListener('beforeprint', buildPrint);
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]') || event.target.closest('button, input, select, textarea, a, [contenteditable]')) return;
    if (['ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); goSlide(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goSlide(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); goSlide(0); }
    if (event.key === 'End') { event.preventDefault(); goSlide(C.slides.length - 1); }
  });
  renderAll(); buildPrint();
  window.PPI_A08_APP = Object.freeze({ getState: () => JSON.parse(JSON.stringify(state)), score: () => M.score(state), exportData: () => M.exportData(state), goSlide, buildPrint });
}());
