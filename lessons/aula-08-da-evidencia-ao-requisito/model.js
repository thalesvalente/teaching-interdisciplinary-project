/* Aula 08 · modelo local e exportação voluntária, sem dependências de runtime. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./content.js'));
  else root.PPI_A08_MODEL = factory(root.PPI_A08_CONTENT);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (C) {
  'use strict';
  const VERSION = '1.0.0';
  const STORAGE_KEY = 'ppi-aula08-v1';
  const TRACKS = ['memorias', 'permanencia'];
  const TYPES = ['RF', 'RNF', 'RD'];
  const REVIEW = ['source', 'measurable', 'scope', 'ethics'];
  const FIELDS = ['text', 'source', 'sourceStatus', 'criterion', 'priority'];
  const now = () => new Date().toISOString();
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  function text(value) {
    check(typeof value === 'string' && value.length <= 2000, 'Texto inválido: use até 2.000 caracteres.');
    return value;
  }
  function keys(object, allowed, required = allowed) {
    check(object && typeof object === 'object' && !Array.isArray(object), 'Objeto esperado no rascunho.');
    check(Object.keys(object).every(key => allowed.includes(key)), 'Campo desconhecido no rascunho.');
    check(required.every(key => own(object, key)), 'Campo obrigatório ausente no rascunho.');
  }
  function safe(value, depth = 0) {
    check(depth <= 10, 'Rascunho profundo demais.');
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        check(!['__proto__', 'prototype', 'constructor'].includes(key), 'Chave não permitida no rascunho.');
        safe(value[key], depth + 1);
      }
    }
  }
  function date(value) {
    check(typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) &&
      Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value, 'Data inválida no rascunho.');
    return value;
  }
  function emptyTrack() {
    return {
      answers: {},
      catalog: Object.fromEntries(TYPES.map(type => [type, { text: '', source: '', sourceStatus: 'pending_hypothesis', criterion: '', priority: 'must' }])),
      review: Object.fromEntries(REVIEW.map(key => [key, false])), exit: ''
    };
  }
  function createState() {
    const timestamp = now();
    return { schema_version: VERSION, activeTrack: 'memorias', created_at: timestamp, updated_at: timestamp,
      tracks: { memorias: emptyTrack(), permanencia: emptyTrack() } };
  }
  function questions(track, missionId) {
    check(TRACKS.includes(track), 'Trilha desconhecida.');
    const mission = C.tracks[track].missions[missionId];
    check(mission && Array.isArray(mission.questions), 'Missão desconhecida.');
    return mission.questions;
  }
  function score(state, track = state.activeTrack) {
    check(TRACKS.includes(track), 'Trilha desconhecida.');
    const answers = state.tracks[track].answers;
    const missions = C.missions.map(mission => {
      const qs = questions(track, mission.id);
      const correct = qs.filter(q => answers[q.id] === q.correct).length;
      const completed = correct === qs.length && qs.length > 0;
      return { id: mission.id, xp: completed ? mission.xp : 0, max: mission.xp, correct, total: qs.length, completed };
    });
    return { xp: missions.reduce((sum, m) => sum + m.xp, 0), max: 100,
      completed: missions.filter(m => m.completed).length, total: 6, missions };
  }
  function touch(state) { state.updated_at = now(); return state; }
  function answer(state, missionId, questionId, optionId) {
    const q = questions(state.activeTrack, missionId).find(item => item.id === questionId);
    check(q && q.options.some(item => item.id === optionId), 'Questão ou alternativa desconhecida.');
    state.tracks[state.activeTrack].answers[questionId] = optionId;
    return touch(state);
  }
  function resetMission(state, missionId) {
    questions(state.activeTrack, missionId).forEach(q => { delete state.tracks[state.activeTrack].answers[q.id]; });
    return touch(state);
  }
  function switchTrack(state, track) {
    check(TRACKS.includes(track), 'Trilha desconhecida.');
    state.activeTrack = track;
    return touch(state);
  }
  function setCatalog(state, type, field, value) {
    check(TYPES.includes(type) && FIELDS.includes(field), 'Campo do catálogo desconhecido.');
    text(value);
    if (field === 'sourceStatus') check(['evidence', 'pending_hypothesis'].includes(value), 'Situação de fonte inválida.');
    if (field === 'priority') check(['must', 'should', 'could', 'later'].includes(value), 'Prioridade inválida.');
    state.tracks[state.activeTrack].catalog[type][field] = value;
    // Uma edição exige revisar novamente; completar campos não aprova qualidade.
    REVIEW.forEach(key => { state.tracks[state.activeTrack].review[key] = false; });
    return touch(state);
  }
  function setReview(state, key, value) {
    check(REVIEW.includes(key) && typeof value === 'boolean', 'Autoavaliação inválida.');
    state.tracks[state.activeTrack].review[key] = value;
    return touch(state);
  }
  function setExit(state, value) { state.tracks[state.activeTrack].exit = text(value); return touch(state); }
  function validateState(input) {
    if (typeof input === 'string') {
      check(input.length <= 262144, 'Rascunho maior que 256 KiB.');
      input = JSON.parse(input);
    }
    safe(input);
    keys(input, ['schema_version', 'activeTrack', 'created_at', 'updated_at', 'tracks']);
    check(input.schema_version === VERSION, 'Versão desconhecida; seu rascunho foi preservado.');
    check(TRACKS.includes(input.activeTrack), 'Trilha desconhecida.');
    date(input.created_at); date(input.updated_at);
    check(Date.parse(input.updated_at) >= Date.parse(input.created_at), 'Datas fora de ordem.');
    keys(input.tracks, TRACKS);
    const result = createState();
    result.activeTrack = input.activeTrack;
    result.created_at = input.created_at; result.updated_at = input.updated_at;
    for (const track of TRACKS) {
      const source = input.tracks[track]; const target = result.tracks[track];
      keys(source, ['answers', 'catalog', 'review', 'exit']);
      const allQuestions = C.missions.flatMap(m => questions(track, m.id));
      keys(source.answers, allQuestions.map(q => q.id), []);
      for (const [id, value] of Object.entries(source.answers)) {
        const q = allQuestions.find(item => item.id === id);
        check(q.options.some(option => option.id === value), 'Alternativa inválida no rascunho.');
        target.answers[id] = value;
      }
      keys(source.catalog, TYPES);
      for (const type of TYPES) {
        keys(source.catalog[type], FIELDS);
        for (const field of FIELDS) target.catalog[type][field] = text(source.catalog[type][field]);
        check(['evidence', 'pending_hypothesis'].includes(target.catalog[type].sourceStatus), 'Situação de fonte inválida.');
        check(['must', 'should', 'could', 'later'].includes(target.catalog[type].priority), 'Prioridade inválida.');
      }
      keys(source.review, REVIEW);
      for (const key of REVIEW) {
        check(typeof source.review[key] === 'boolean', 'Autoavaliação deve ser sim/não.');
        target.review[key] = source.review[key];
      }
      target.exit = text(source.exit);
    }
    return result;
  }
  function completeness(state, track = state.activeTrack) {
    const catalog = state.tracks[track].catalog;
    const filled = TYPES.reduce((sum, type) => sum + ['text', 'source', 'criterion'].filter(field => catalog[type][field].trim()).length, 0);
    return { domain: 'catalog_completeness', filled_fields: filled, required_fields: 9, complete: filled === 9, qualitative_quality: 'not_assessed' };
  }
  function exportData(state, track = state.activeTrack) {
    state = validateState(state);
    check(TRACKS.includes(track), 'Trilha desconhecida.');
    const record = state.tracks[track]; const result = score(state, track); const filled = completeness(state, track);
    const hasAnswers = Object.keys(record.answers).length > 0 || filled.filled_fields > 0 || record.exit.trim().length > 0;
    const draftStatus = filled.complete && REVIEW.every(key => record.review[key]) ? 'self_reviewed' : hasAnswers ? 'draft' : 'empty';
    return {
      schema_version: VERSION, lesson_id: 'ppi-aula08', activity_id: 'aula08-local-draft', track_id: track,
      question_id: null, answer_kind: 'lesson_draft', draft_status: draftStatus, xp_formativo: result.xp,
      criteria_version: C.criteriaVersion, answer_key_version: C.answerKeyVersion,
      created_at: state.created_at, updated_at: state.updated_at,
      training: { domain: 'presentation_training', xp_formativo: result.xp, max_xp: 100,
        missions: result.missions.map(m => ({ mission_id: m.id, completed: m.completed, correct: m.correct, total: m.total, xp_formativo: m.xp })),
        answers: C.missions.flatMap(m => questions(track, m.id).filter(q => own(record.answers, q.id)).map(q => ({
          schema_version: VERSION, lesson_id: 'ppi-aula08', activity_id: m.id, track_id: track, question_id: q.id,
          answer_kind: 'single_choice', selected_option: record.answers[q.id], correct: record.answers[q.id] === q.correct,
          criteria_version: C.criteriaVersion, answer_key_version: C.answerKeyVersion
        }))) },
      catalog: { activity_id: 'catalogo-minimo', requirements: TYPES.map(type => ({
        requirement_id: 'a08.' + type.toLowerCase() + '.v1', type,
        text: record.catalog[type].text, source_ref: record.catalog[type].source,
        source_status: record.catalog[type].sourceStatus, acceptance_criterion: record.catalog[type].criterion,
        priority: record.catalog[type].priority
      })), self_review: { ...record.review }, exit_ticket: record.exit },
      completeness: filled,
      teacher_assessment: { domain: 'teacher_qualitative', status: 'pending', value: null },
      official_grade: { domain: 'official_grade', status: 'not_applicable', value: null },
      notice: 'XP exclusivamente formativo. Completude não comprova qualidade. Revisão docente pendente; nenhuma nota oficial calculada. Somente dados sintéticos.'
    };
  }
  return Object.freeze({ VERSION, STORAGE_KEY, TRACKS, TYPES, REVIEW, createState, validateState,
    questions, score, answer, resetMission, switchTrack, setCatalog, setReview, setExit, completeness, exportData });
}));
