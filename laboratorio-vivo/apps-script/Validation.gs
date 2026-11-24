/** Pure validation/canonicalization. All internal functions end in _. */
var LV_VERSION_ = '1.0.0';
var LV_LIMITS_ = { payloadBytes: 60000, answerLength: 4000, reflectionLength: 3000,
  questions: 32, rows: 20000, exportRows: 2000, lockMs: 10000 };

function lvFail_(code, message) {
  var error = new Error(message);
  error.lvCode = code;
  throw error;
}
function lvAssert_(condition, code, message) {
  if (!condition) lvFail_(code, message);
}
function lvPlainObject_(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]';
}
function lvCanonical_(value, depth) {
  depth = depth || 0;
  lvAssert_(depth <= 16, 'INVALID_PAYLOAD', 'Estrutura excede o limite de profundidade.');
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    if (typeof value === 'string') {
      lvAssert_(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value),
        'INVALID_PAYLOAD', 'Texto contém caracteres de controle não permitidos.');
      // Reject isolated UTF-16 surrogates rather than hash replacement bytes ambiguously.
      lvAssert_(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(value),
        'INVALID_PAYLOAD', 'Texto Unicode inválido.');
    }
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    lvAssert_(Number.isFinite(value), 'INVALID_PAYLOAD', 'Número não finito.');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    lvAssert_(value.length <= 1000, 'INVALID_PAYLOAD', 'Lista excede o limite.');
    return '[' + value.map(function (v) { return lvCanonical_(v, depth + 1); }).join(',') + ']';
  }
  lvAssert_(lvPlainObject_(value), 'INVALID_PAYLOAD', 'Tipo de dado não permitido.');
  var keys = Object.keys(value).sort();
  lvAssert_(keys.length <= 100, 'INVALID_PAYLOAD', 'Objeto excede o limite de campos.');
  return '{' + keys.map(function (key) {
    lvAssert_(['__proto__', 'prototype', 'constructor'].indexOf(key) < 0,
      'INVALID_PAYLOAD', 'Campo reservado não permitido.');
    return JSON.stringify(key) + ':' + lvCanonical_(value[key], depth + 1);
  }).join(',') + '}';
}
function lvUtf8Length_(text) {
  return Utilities.newBlob(text, 'application/json').getBytes().length;
}
function lvSha_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text,
    Utilities.Charset.UTF_8).map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}
function lvKeys_(obj, allowed, required) {
  lvAssert_(lvPlainObject_(obj), 'INVALID_PAYLOAD', 'Objeto esperado.');
  Object.keys(obj).forEach(function (key) {
    lvAssert_(allowed.indexOf(key) >= 0, 'INVALID_PAYLOAD', 'Campo não previsto no contrato.');
  });
  (required || []).forEach(function (key) {
    lvAssert_(Object.prototype.hasOwnProperty.call(obj, key), 'INVALID_PAYLOAD', 'Campo obrigatório ausente.');
  });
}
function lvText_(value, max, required) {
  lvAssert_(typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0),
    'INVALID_PAYLOAD', 'Texto obrigatório ausente ou limite excedido.');
  lvCanonical_(value);
  return value;
}
function lvId_(value) {
  lvAssert_(typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(value),
    'INVALID_PAYLOAD', 'Identificador inválido.');
  return value;
}
function lvBool_(value) { return value === true || String(value).toUpperCase() === 'TRUE'; }
function lvCell_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') return value;
  // A leading apostrophe preserves text in Sheets; CSV exports use a separate escaping layer.
  return /^[\s\uFEFF]*[=+\-@']/.test(value) ? "'" + value : value;
}
function lvCsvCell_(value) {
  var safe = lvCell_(String(value === undefined || value === null ? '' : value));
  return '"' + safe.replace(/"/g, '""') + '"';
}
function lvEnvelope_(input) {
  lvKeys_(input, ['schema_version', 'request_id', 'payload', 'payload_hash'], ['schema_version', 'request_id', 'payload']);
  lvAssert_(input.schema_version === LV_VERSION_, 'SCHEMA_VERSION_MISMATCH', 'Versão de contrato não suportada.');
  lvAssert_(typeof input.request_id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{7,127}$/.test(input.request_id),
    'INVALID_REQUEST_ID', 'Use um identificador de pedido com 8 a 128 caracteres.');
  lvAssert_(lvPlainObject_(input.payload), 'INVALID_PAYLOAD', 'Payload deve ser um objeto.');
  var canonical = lvCanonical_(input.payload);
  lvAssert_(lvUtf8Length_(canonical) <= LV_LIMITS_.payloadBytes, 'PAYLOAD_TOO_LARGE', 'Payload excede 60.000 bytes UTF-8.');
  var digest = lvSha_(canonical);
  if (input.payload_hash !== undefined) lvAssert_(input.payload_hash === digest,
    'PAYLOAD_HASH_MISMATCH', 'O conteúdo não corresponde ao hash do arquivo.');
  return { request_id: input.request_id, payload: input.payload, transport_hash: digest };
}
function lvXp_(activity, self) {
  if (activity.kind !== 'FORMATIVA') return 0;
  return Math.min(Number(activity.xp_max) || 0,
    (self.understood ? 30 : 0) + (self.evidence_checked ? 40 : 0) + (self.authorship_declared ? 30 : 0));
}

