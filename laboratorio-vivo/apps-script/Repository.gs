/** Sheet adapter. Every mutation requires the script lock held by lvCall_. */
function lvSheet_(ctx, name) {
  lvAssert_(Object.prototype.hasOwnProperty.call(LV_TABLES_, name), 'SCHEMA_MISMATCH', 'Tabela não prevista.');
  var sheet = ctx.book.getSheetByName(name);
  lvAssert_(sheet, 'SCHEMA_MISMATCH', 'Tabela obrigatória ausente.');
  var expected = LV_TABLES_[name].headers;
  var actual = sheet.getRange(1, 1, 1, expected.length).getValues()[0];
  lvAssert_(JSON.stringify(actual) === JSON.stringify(expected), 'SCHEMA_MISMATCH', 'Cabeçalhos não correspondem ao contrato.');
  return sheet;
}
function lvRows_(ctx, name) {
  var sheet = lvSheet_(ctx, name);
  var last = sheet.getLastRow();
  lvAssert_(last <= LV_LIMITS_.rows + 1, 'CAPACITY_REACHED', 'A capacidade configurada foi atingida; requer manutenção docente.');
  if (last <= 1) return [];
  var meta = LV_TABLES_[name];
  var rows = sheet.getRange(2, 1, last - 1, meta.headers.length).getValues();
  var seen = Object.create(null);
  return rows.map(function (values, index) {
    var row = { _row: index + 2 };
    meta.headers.forEach(function (h, i) {
      var val = values[i];
      // Sheets removes its leading text-escape apostrophe on getValues(); do not strip user text.
      row[h] = val instanceof Date ? val.toISOString() : val;
    });
    return row;
  }).filter(function (row) {
    // A total formula on an otherwise blank template row does not create a participant.
    if (meta.primary_key.every(function (key) { return row[key] === ''; })) return false;
    lvAssert_(meta.primary_key.every(function (key) { return row[key] !== ''; }), 'INTEGRITY_ERROR', 'Chave primária incompleta.');
    var key = lvCanonical_(meta.primary_key.map(function (field) { return row[field]; }));
    lvAssert_(!seen[key], 'INTEGRITY_ERROR', 'Chave primária duplicada.');
    seen[key] = true;
    return true;
  });
}
function lvFind_(ctx, table, values) {
  var rows = lvRows_(ctx, table).filter(function (row) {
    return Object.keys(values).every(function (key) { return String(row[key]) === String(values[key]); });
  });
  lvAssert_(rows.length <= 1, 'INTEGRITY_ERROR', 'Resultado ambíguo.');
  return rows[0] || null;
}
function lvWritable_(ctx) {
  lvAssert_(ctx.locked && ctx.writeAllowed, 'WRITE_GUARD', 'Gravação fora de contexto autorizado.');
}
function lvAppend_(ctx, table, data) {
  lvWritable_(ctx);
  var meta = LV_TABLES_[table];
  var keys = {};
  meta.primary_key.forEach(function (key) { keys[key] = data[key]; });
  lvAssert_(!lvFind_(ctx, table, keys), 'INTEGRITY_ERROR', 'Tentativa de duplicar chave.');
  var sheet = lvSheet_(ctx, table);
  var row = sheet.getLastRow() + 1;
  lvAssert_(row <= LV_LIMITS_.rows + 1, 'CAPACITY_REACHED', 'Limite da tabela atingido.');
  var values = meta.headers.map(function (h) { return lvCell_(data[h]); });
  sheet.getRange(row, 1, 1, values.length).setValues([values]);
  return row;
}
function lvPatch_(ctx, table, row, patch) {
  lvWritable_(ctx);
  lvAssert_(row && row._row >= 2, 'INTEGRITY_ERROR', 'Linha de alteração não identificada.');
  var headers = LV_TABLES_[table].headers;
  Object.keys(patch).forEach(function (key) {
    var index = headers.indexOf(key);
    lvAssert_(index >= 0, 'SCHEMA_MISMATCH', 'Campo de alteração não previsto.');
    if(Object.prototype.hasOwnProperty.call(row,key) && row[key]===(patch[key]===undefined||patch[key]===null?'':patch[key]))return;
    lvSheet_(ctx, table).getRange(row._row, index + 1).setValue(lvCell_(patch[key]));
  });
}
function lvEnsure_(ctx, table, data, compareFields) {
  var meta = LV_TABLES_[table];
  var keys = {};
  meta.primary_key.forEach(function (key) { keys[key] = data[key]; });
  var existing = lvFind_(ctx, table, keys);
  if (!existing) return lvAppend_(ctx, table, data);
  (compareFields || Object.keys(data)).forEach(function (key) {
    lvAssert_(String(existing[key]) === String(data[key] === undefined ? '' : data[key]),
      'RECOVERY_REQUIRED', 'Registro parcial diverge do pedido original; revisão docente necessária.');
  });
  return existing._row;
}
function lvUpsert_(ctx, table, keys, data) {
  var existing = lvFind_(ctx, table, keys);
  if (existing) { lvPatch_(ctx, table, existing, data); return existing._row; }
  return lvAppend_(ctx, table, Object.assign({}, keys, data));
}
function lvConfig_(ctx) {
  var config = Object.create(null);
  lvRows_(ctx, 'Config').forEach(function (row) { config[row.config_key] = row.config_value; });
  return config;
}
function lvAudit_(ctx, actor, op, entity, outcome, request, hash, detail, eventId, timestamp) {
  lvEnsure_(ctx, 'Auditoria', {
    event_id: eventId || 'evt-' + Utilities.getUuid(), event_at: timestamp || new Date().toISOString(),
    actor_id: actor.participant_id, actor_role: actor.role, operation: op, entity_id: entity || '',
    outcome: outcome, request_id: request || '', payload_hash: hash || '', detail_code: detail || ''
  }, ['actor_id', 'actor_role', 'operation', 'entity_id', 'outcome', 'request_id', 'payload_hash', 'detail_code']);
}

