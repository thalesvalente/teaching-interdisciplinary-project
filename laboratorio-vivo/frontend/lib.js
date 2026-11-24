/* PPI I — pure, dependency-free helpers shared by the offline and HtmlService UI. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PpiLab = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = '1.0.0';
  const MAX_PAYLOAD_BYTES = 60000;
  const MAX_FILE_BYTES = 80000;
  const QUESTIONS = [
    { question_id: 'q_problema', label: 'Qual situação precisa melhorar?', hint: 'Descreva o contexto, quem é afetado e o recorte do problema. Evite nomes e dados pessoais.', placeholder: 'Em um cenário fictício, a equipe percebe que…', answer_kind: 'text', required: true, max_length: 4000, section: 'compreender' },
    { question_id: 'q_evidencia', label: 'O que sustenta esse problema?', hint: 'Registre um achado, sua fonte e como ele pode ser verificado. Identifique claramente evidências simuladas.', placeholder: 'Achado E01 · Fonte sintética · Limites da observação…', answer_kind: 'text', required: true, max_length: 4000, section: 'compreender' },
    { question_id: 'q_hipotese', label: 'Qual hipótese será investigada?', hint: 'Uma hipótese é uma explicação a testar. Diga também o que faria você revisá-la.', placeholder: 'Acreditamos que… Vamos verificar por…', answer_kind: 'text', required: true, max_length: 4000, section: 'compreender' },
    { question_id: 'q_rf', label: 'Requisito funcional · RF', hint: 'Descreva uma ação observável do sistema, com identificador e ator.', placeholder: 'RF01 · O sistema deve permitir que…', answer_kind: 'text', required: true, max_length: 4000, section: 'modelar' },
    { question_id: 'q_rnf', label: 'Requisito não funcional · RNF', hint: 'Defina uma condição de qualidade mensurável: acessibilidade, desempenho, segurança ou outra pertinente.', placeholder: 'RNF01 · A interface deve… Verificação:…', answer_kind: 'text', required: true, max_length: 4000, section: 'modelar' },
    { question_id: 'q_dados', label: 'Requisito de dados · RD', hint: 'Diga quais dados são necessários, sua origem, qualidade, acesso e retenção. Use dados fictícios neste ambiente.', placeholder: 'RD01 · Campo necessário:… Fonte:… Acesso:…', answer_kind: 'text', required: true, max_length: 4000, section: 'modelar' },
    { question_id: 'q_aceite', label: 'Como saberemos que funciona?', hint: 'Escreva ao menos um critério de aceitação testável. Inclua entrada, ação e resultado esperado.', placeholder: 'CA01 · Dado… Quando… Então…', answer_kind: 'text', required: true, max_length: 4000, section: 'validar' },
    { question_id: 'q_rastreabilidade', label: 'Como as peças se conectam?', hint: 'Relacione evidência → requisito → dado/modelo → critério/teste. Explique lacunas ou decisões.', placeholder: 'E01 → RF01 → RD01 → CA01. A ligação faz sentido porque…', answer_kind: 'text', required: true, max_length: 4000, section: 'validar' }
  ];
  const SELF = [
    { key: 'understood', points: 30, label: 'Consigo explicar o problema, as decisões e os requisitos com minhas palavras.', hint: 'Prepare uma explicação breve e reconheça o que ainda precisa investigar.' },
    { key: 'evidence_checked', points: 40, label: 'Revisei evidências, critérios de aceitação e limites dos dados utilizados.', hint: 'Sinalizei o que é fictício e não tratei uma resposta de IA como evidência.' },
    { key: 'authorship_declared', points: 30, label: 'Registrei minha contribuição e declarei o apoio de ferramentas ou IA.', hint: 'A validação da autoria é feita pelo docente; esta marcação é uma autoavaliação.' }
  ];
  const ACTIVITY = {
    activity_id: 'AULA08-FORMATIVA', activity_version: VERSION, lesson_id: 'AULA08',
    track_id: 'AMBOS', title: 'Da evidência ao requisito', kind: 'FORMATIVA', status: 'RASCUNHO',
    criteria_version: 'FORM-1.0.0', xp_max: 100, official_max: null, questions: QUESTIONS,
    rubric: []
  };
  function canonical(value, depth) {
    depth=depth||0;
    if(depth>16)throw new Error('Estrutura excede o limite de profundidade.');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
      if(typeof value==='string'){
        if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))throw new Error('Texto contém caracteres de controle não permitidos.');
        if(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(value))throw new Error('Texto Unicode inválido.');
      }
      return JSON.stringify(value);
    }
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) throw new Error('Número não finito.');
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      if(value.length>1000)throw new Error('Lista excede o limite.');
      return '[' + value.map(v=>canonical(v,depth+1)).join(',') + ']';
    }
    if (value && typeof value === 'object' && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) {
      if(Object.keys(value).length>100)throw new Error('Objeto excede o limite de campos.');
      return '{' + Object.keys(value).sort().map(function (key) {
        if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error('Chave reservada.');
        return JSON.stringify(key) + ':' + canonical(value[key],depth+1);
      }).join(',') + '}';
    }
    throw new Error('Formato JSON não suportado.');
  }
  function utf8(value) { return new TextEncoder().encode(value); }
  // SHA-256 fallback keeps local file:// use independent of a network or secure-context API.
  function sha256Sync(input) {
    const bytes = utf8(input);
    const words = [];
    const bitLength = bytes.length * 8;
    for (let i = 0; i < bytes.length; i += 1) words[i >> 2] = (words[i >> 2] || 0) | (bytes[i] << (24 - (i % 4) * 8));
    words[bytes.length >> 2] = (words[bytes.length >> 2] || 0) | (0x80 << (24 - (bytes.length % 4) * 8));
    const last = (((bytes.length + 8) >> 6) + 1) * 16;
    for (let i = 0; i < last; i += 1) if (words[i] === undefined) words[i] = 0;
    words[last - 2] = Math.floor(bitLength / 0x100000000);
    words[last - 1] = bitLength >>> 0;
    const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const k = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const rotr = (v, n) => (v >>> n) | (v << (32 - n));
    for (let offset = 0; offset < words.length; offset += 16) {
      const w = words.slice(offset, offset + 16);
      for (let i = 16; i < 64; i += 1) {
        const s0 = rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15] >>> 3);
        const s1 = rotr(w[i-2],17) ^ rotr(w[i-2],19) ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
      }
      let [a,b,c,d,e,f,g,hh] = h;
      for (let i=0; i<64; i+=1) {
        const s1 = rotr(e,6)^rotr(e,11)^rotr(e,25);
        const ch = (e&f)^(~e&g);
        const t1 = (hh+s1+ch+k[i]+w[i])|0;
        const s0 = rotr(a,2)^rotr(a,13)^rotr(a,22);
        const maj=(a&b)^(a&c)^(b&c);
        const t2=(s0+maj)|0;
        hh=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;
      }
      [a,b,c,d,e,f,g,hh].forEach((v,i)=>{h[i]=(h[i]+v)|0;});
    }
    return h.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('');
  }
  async function sha256(input) { return sha256Sync(input); }
  function exactKeys(obj, keys, name) {
    if (!obj || Array.isArray(obj) || typeof obj !== 'object') throw new Error(name + ': objeto esperado.');
    Object.keys(obj).forEach(k => { if (!keys.includes(k)) throw new Error(name + ': campo inesperado (' + k + ').'); });
  }
  function isId(value, max) { return typeof value === 'string' && value.length > 0 && value.length <= (max || 128) && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(value); }
  function validatePayload(payload, activity, allowIncomplete) {
    exactKeys(payload,['lesson_id','activity_id','activity_version','track_id','criteria_version','answers','reflection','self_assessment','previous_submission_id','on_behalf_of'],'Atividade');
    const source = activity || ACTIVITY;
    ['lesson_id','activity_id','activity_version','criteria_version'].forEach(k=>{
      if (payload[k] !== source[k]) throw new Error('A atividade ou a versão não corresponde ao catálogo atual (' + k + ').');
    });
    if (!['QUILOMBOLA','PERMANENCIA'].includes(payload.track_id)) throw new Error('Escolha uma trilha válida.');
    if (source.track_id !== 'AMBOS' && source.track_id !== payload.track_id) throw new Error('A atividade não está disponível para esta trilha.');
    if (!Array.isArray(payload.answers) || payload.answers.length !== source.questions.length) throw new Error('A quantidade de respostas não corresponde à atividade.');
    const seen = new Set();
    payload.answers.forEach(answer=>{
      exactKeys(answer,['question_id','answer_kind','value'],'Resposta');
      const q = source.questions.find(item=>item.question_id===answer.question_id);
      if (!q || seen.has(answer.question_id)) throw new Error('Questão desconhecida ou repetida.');
      seen.add(answer.question_id);
      if (answer.answer_kind !== q.answer_kind || typeof answer.value !== 'string') throw new Error('Tipo de resposta inválido.');
      if (answer.value.length > q.max_length) throw new Error('A resposta excede o limite de ' + q.max_length + ' caracteres.');
      if (!allowIncomplete && q.required && !answer.value.trim()) throw new Error('Responda: ' + q.label);
    });
    if (typeof payload.reflection !== 'string' || payload.reflection.length > 3000) throw new Error('A reflexão deve ter até 3000 caracteres.');
    if (!allowIncomplete && !payload.reflection.trim()) throw new Error('Registre sua reflexão individual antes de enviar.');
    exactKeys(payload.self_assessment,SELF.map(x=>x.key),'Autoavaliação');
    SELF.forEach(item=>{if(typeof payload.self_assessment[item.key]!=='boolean') throw new Error('Autoavaliação inválida.');});
    ['previous_submission_id','on_behalf_of'].forEach(k=>{if(payload[k]!==undefined&&!isId(payload[k],128))throw new Error('Identificador inválido: '+k);});
    if (utf8(canonical(payload)).length > MAX_PAYLOAD_BYTES) throw new Error('A atividade excede o limite de 60.000 bytes.');
    return payload;
  }
  function validateEnvelope(envelope, activity, allowIncomplete) {
    exactKeys(envelope,['schema_version','request_id','payload','payload_hash'],'Arquivo');
    if (envelope.schema_version!==VERSION) throw new Error('Versão de arquivo incompatível. Use o contrato '+VERSION+'.');
    if (typeof envelope.request_id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_.:-]{7,127}$/.test(envelope.request_id)) throw new Error('Identificador de requisição inválido: use de 8 a 128 caracteres, começando por letra ou número.');
    validatePayload(envelope.payload,activity,allowIncomplete);
    if (typeof envelope.payload_hash!=='string'||!/^[a-f0-9]{64}$/.test(envelope.payload_hash)) throw new Error('O arquivo precisa de um hash SHA-256 válido.');
    if (envelope.payload_hash!==sha256Sync(canonical(envelope.payload))) throw new Error('O conteúdo do arquivo não corresponde ao hash. Nada foi importado.');
    return envelope;
  }
  function score(self) { return SELF.reduce((sum,item)=>sum+(self && self[item.key]===true?item.points:0),0); }
  function newRequestId() {
    if (typeof crypto!=='undefined' && typeof crypto.randomUUID==='function') return crypto.randomUUID();
    if (typeof crypto!=='undefined' && crypto.getRandomValues) {
      const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);return Array.from(bytes,v=>v.toString(16).padStart(2,'0')).join('');
    }
    throw new Error('Este navegador não oferece um gerador seguro de identificadores. Use um navegador atualizado.');
  }
  function safeName(value) {return String(value).replace(/[^A-Za-z0-9_.-]/g,'_').slice(0,80);}
  return Object.freeze({VERSION,MAX_PAYLOAD_BYTES,MAX_FILE_BYTES,QUESTIONS,SELF,ACTIVITY,canonical,sha256,sha256Sync,validatePayload,validateEnvelope,score,newRequestId,safeName});
}));
