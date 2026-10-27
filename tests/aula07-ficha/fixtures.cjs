'use strict';

const { moduleFile } = require('./harness.cjs');
const Model = require(moduleFile('model.js'));

function completeFixture(track = 'memorias') {
  const state = Model.createEmpty();
  state.team = { name: 'Equipe sintética QA', date: '2026-10-27', track,
    repository: 'https://example.org/projeto-sintetico', declaration: true };
  state.members = [1, 2].map(n => ({ id: 'm-qa-' + n, name: 'Integrante sintético ' + n,
    role: n === 1 ? 'Entrevista e revisão' : 'Observação e documentação',
    contribution: 'Escreveu e revisou o protocolo em cenário sintético.',
    improvement: 'Substituiu uma pergunta dupla por uma pergunta aberta.',
    risk: 'Identificou risco de publicar informação ainda não validada.',
    learning: 'Precisa praticar triangulação e registro de contradições.', reviewed: true }));
  state.m1 = {
    objective: track === 'memorias' ? 'Descobrir como validar versões divergentes de uma memória fictícia.' : 'Descobrir o significado local do indicador sintético de permanência.',
    need: 'A informação orienta a investigação e evita assumir uma interpretação sem fonte.',
    decision: 'Definir quem revisa e em que condições uma informação pode ser reutilizada.',
    source: 'Cartão inteiramente sintético e documento fictício preparado para o teste.',
    assumption: 'A equipe ainda supõe que a definição seja compartilhada por todos os papéis.'
  };
  state.m2.techniques = [
    { id: 't-qa-1', role: 'principal', kind: 'entrevista', source: 'Papel fictício de pessoa participante',
      purpose: 'Conhecer o significado atribuído à informação.', evidence: 'Relato sintético anotado.',
      limitation: 'A fala não prova como o processo ocorre.', responsible: 'm-qa-1',
      justification: 'A pergunta exige conhecer o ponto de vista do papel simulado.' },
    { id: 't-qa-2', role: 'complementar', kind: 'documental', source: 'Registro fictício v1',
      purpose: 'Confrontar a definição com o registro.', evidence: 'Campo e regra descritos no documento fictício.',
      limitation: 'O documento pode estar desatualizado.', responsible: 'm-qa-2',
      justification: 'O registro permite triangular a fala com uma fonte de outra técnica.' }
  ];
  const questionText = [
    'Como o processo funciona neste cenário sintético?', 'Quais papéis participam de sua validação?',
    'Como a informação passa entre os papéis?', 'Que dificuldades aparecem quando as versões diferem?',
    'Que resultado ajudaria a equipe a compreender o problema?', 'Como podemos verificar se entendemos corretamente?',
    'Há algo importante que não perguntamos?'
  ];
  const categories = ['contexto', 'pessoas', 'processo', 'problema', 'resultado', 'validacao', 'fechamento'];
  state.m3.questions = categories.map((category, i) => ({ id: 'q-qa-' + (i + 1), category,
    text: questionText[i], purpose: 'Explorar ' + category + ' sem induzir a resposta do papel fictício.' }));
  state.m3.observation = {
    activity: 'Acompanhar o registro sintético e a revisão por dois papéis.',
    boundaries: 'Começa na consulta do cartão e termina na marcação de pendências.',
    people: 'Papéis fictícios de observador, participante e revisor.',
    tools: 'Ficha em papel e quadro sintético.', transfers: 'O primeiro papel entrega o registro ao revisor.',
    delays: 'O revisor espera uma definição que o cartão não fornece.',
    practice: 'A descrição formal prevê uma etapa de validação que a simulação ainda não conclui.',
    record: 'Anotar ações, sequência e duração aproximada sem atribuir intenção.'
  };
  state.m3.document = {
    name: 'Cartão sintético de teste', author: 'Equipe sintética QA', version: '2026-10-27, versão 1',
    purpose: 'Servir a uma simulação de elicitação.', terms: 'Definição, origem, versão e responsável.',
    rules: 'Todo registro deve indicar a fonte fictícia.', gaps: 'A periodicidade não foi definida no cartão.',
    restrictions: 'Usar somente em teste educacional e não atribuir o relato a pessoas reais.',
    unanswered: 'Quem resolverá a divergência ainda está pendente.'
  };
  state.m3.ai.used = 'no';
  for (const key of ['authorization', 'explained', 'refusal', 'recording', 'personal', 'substitution', 'ai']) {
    state.m4[key] = { answer: ['recording', 'personal', 'ai'].includes(key) ? 'no' : 'yes',
      decision: 'Decisão registrada apenas para o cenário sintético; qualquer coleta real exigiria validação própria.' };
  }
  Object.assign(state.m4, {
    access: 'Somente os papéis da equipe durante a simulação.', validator: 'Docente e parte interessada autorizada em etapa futura.',
    citation: 'Cartão inteiramente sintético, versão 1, 2026-10-27.', publication: 'Não publicar informação não validada ou identificadora.',
    risks: 'Risco de confundir hipótese com evidência.', mitigation: 'Marcar a hipótese e pedir validação antes de utilizá-la.'
  });
  state.m5 = { type: 'synthetic', participants: ['m-qa-1', 'm-qa-2'],
    scenario: 'Simulação integralmente inventada com duas versões divergentes de um registro.',
    roles: 'Integrante sintético 1 entrevista; integrante sintético 2 representa e registra.',
    worked: 'A pergunta de contexto produziu uma explicação descritiva.',
    confusing: 'Uma pergunta reunia atualização e validação em uma só frase.',
    leading: 'A expressão sempre correto poderia induzir concordância.',
    sensitive: 'O cenário indicava que uma localização fictícia seria restrita.',
    contradiction: 'A fala sintética e o documento fictício apresentam sequências diferentes.',
    difficulty: 'A pergunta dupla tomou tempo adicional para ser entendida.',
    change: 'Separou a pergunta dupla e removeu a expressão indutiva após o teste.',
    reason: 'Permitir descrever cada etapa sem sugerir uma resposta.',
    before: 'O registro está sempre correto e atualizado?', after: 'Como o registro é atualizado?',
    summary: 'Após o teste, a pergunta fechada e dupla foi substituída por uma pergunta aberta.' };
  state.m6.records = ['achado', 'hipotese', 'pendencia'].map((classification, i) => ({ id: 'e-qa-' + (i + 1),
    raw: ['O registro sintético apresenta duas versões.', 'A equipe supõe que as versões usam critérios diferentes.', 'Ainda falta decidir quem valida a definição.'][i],
    source: 'Cartão sintético QA v1, item ' + (i + 1), classification,
    confidence: ['alta', 'baixa', 'media'][i],
    justification: 'Confiança declarada no cenário de teste; o significado exige revisão humana.',
    validator: 'Papel fictício de revisor e docente.', relation: 'Ajuda a responder a dúvida central sobre a definição.',
    restriction: 'Uso sintético em teste; não divulgar como relato real.' }));
  state.m6.limitation = 'O cenário contém uma divergência entre fala e registro; nenhuma versão foi escolhida como verdade.';
  state.m6.needs = 'Necessidade candidata de explicitar as versões, ainda pendente de validação. QA_FINAL_EVIDENCE_MARKER';
  return state;
}

function partialFixture(track = 'memorias') {
  const state = Model.createEmpty();
  state.team.track = track;
  state.m1.objective = 'QA_PARTIAL_RESPONSE_MARKER: investigar uma dúvida inteiramente sintética.';
  return state;
}

module.exports = { completeFixture, partialFixture };
