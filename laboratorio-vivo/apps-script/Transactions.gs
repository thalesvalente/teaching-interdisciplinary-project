/** Write-ahead receipts + deterministic replay. Sheets is not a multi-sheet ACID database. */
function lvCommitAudit_(ctx,actor,operation,stored) {
  var data=stored.data,plan=stored.plan;
  var originalActor={participant_id:plan.actor_id||actor.participant_id,role:plan.actor_role||actor.role};
  lvAudit_(ctx,originalActor,operation,data.submission_id||data.activity_id||data.plan_version||'',
    data.decision==='APROVADA'?'APPROVED':'SUCCESS',plan.request_id,plan.payload_hash,
    'TRANSACTION_COMMITTED','evt-'+plan.key,stored.committed_at||plan.timestamp);
}
function lvMutation_(ctx, actor, operation, input, prepare, apply, materialize) {
  var request = lvEnvelope_(input);
  var key = 'req-' + lvSha_(lvCanonical_({ actor_id: actor.participant_id, request_id: request.request_id }));
  var hash = lvSha_(lvCanonical_({ operation: operation, actor_id: actor.participant_id, payload: request.payload }));
  var row = lvFind_(ctx, 'Idempotencia', { idempotency_key: key });
  if (row && (row.payload_hash !== hash || row.operation !== operation)) {
    var conflictId = 'conf-' + lvSha_(key + ':' + hash);
    lvEnsure_(ctx, 'Conflitos', { conflict_id: conflictId, request_id: request.request_id,
      actor_id: actor.participant_id, operation: operation, expected_hash: row.payload_hash,
      received_hash: hash, status: 'ABERTO', created_at: new Date().toISOString(),
      resolution_code: '', resolved_by: '', resolved_at: ''
    }, ['request_id', 'actor_id', 'operation', 'expected_hash', 'received_hash']);
    lvAudit_(ctx, actor, operation, '', 'CONFLICT', request.request_id, hash,
      'REQUEST_ID_REUSED', 'evt-' + conflictId);
    lvFail_('CONFLICT', 'O identificador do pedido já foi utilizado com conteúdo diferente.');
  }
  var stored;
  if (row) {
    try { stored = JSON.parse(row.receipt_json); }
    catch (e) { lvFail_('RECOVERY_REQUIRED', 'Recibo de operação incompleto ou corrompido.'); }
    lvAssert_(stored && stored.plan && typeof stored.plan.timestamp === 'string',
      'RECOVERY_REQUIRED', 'Plano de retomada ausente.');
    if (row.state === 'COMMITTED') {
      try {
        var replayData = stored.data;
        // A failure after the marker may have prevented audit persistence. Repair it first.
        lvCommitAudit_(ctx,actor,operation,stored);
        // Rebuild only derived views; this also repairs a failure after the commit marker.
        if (materialize) replayData = materialize(ctx, actor, stored.plan, request.payload, replayData);
        if (lvCanonical_(replayData) !== lvCanonical_(stored.data)) {
          stored.data = replayData;
          lvPatch_(ctx, 'Idempotencia', row, { receipt_json: JSON.stringify(stored), updated_at: new Date().toISOString() });
        }
        return { ok: true, code: 'NO_OP', data: replayData };
      } catch(error) {
        lvFail_('RECOVERY_REQUIRED','Operação confirmada; auditoria ou visão derivada exige retomada com o mesmo pedido.');
      }
    }
    lvAssert_(['PREPARING', 'RECOVERY_REQUIRED'].indexOf(row.state) >= 0,
      'RECOVERY_REQUIRED', 'Estado transacional não reconhecido.');
  } else {
    var interrupted = lvRows_(ctx, 'Idempotencia').some(function (r) { return r.state !== 'COMMITTED'; });
    lvAssert_(!interrupted, 'RECOVERY_REQUIRED', 'Existe operação interrompida. Reenvie o mesmo pedido antes de novas gravações.');
    // Validate everything before creating the write-ahead record.
    var plan = prepare(ctx, actor, request.payload, key, request.transport_hash);
    plan.timestamp = new Date().toISOString();
    plan.key = key;
    plan.request_id = request.request_id;
    plan.payload_hash = hash;
    plan.transport_hash = request.transport_hash;
    plan.actor_id=actor.participant_id;
    plan.actor_role=actor.role;
    stored = { plan: plan, data: null };
    lvAppend_(ctx, 'Idempotencia', { idempotency_key: key, request_id: request.request_id,
      actor_id: actor.participant_id, operation: operation, payload_hash: hash, state: 'PREPARING',
      receipt_json: JSON.stringify(stored), created_at: plan.timestamp, updated_at: plan.timestamp });
    row = lvFind_(ctx, 'Idempotencia', { idempotency_key: key });
  }
  try {
    var data = apply(ctx, actor, stored.plan, request.payload);
    stored.data = data;
    stored.committed_at = new Date().toISOString();
    // Write the complete receipt BEFORE its commit marker, never the reverse.
    lvPatch_(ctx, 'Idempotencia', row, { receipt_json: JSON.stringify(stored), updated_at: new Date().toISOString() });
    lvPatch_(ctx, 'Idempotencia', row, { state: 'COMMITTED' });
    SpreadsheetApp.flush();
    // A success event is evidence of an existing commit, never a prediction of one.
    lvCommitAudit_(ctx,actor,operation,stored);
    if (materialize) {
      stored.data = materialize(ctx, actor, stored.plan, request.payload, data);
      lvPatch_(ctx, 'Idempotencia', row, { receipt_json: JSON.stringify(stored), updated_at: new Date().toISOString() });
      SpreadsheetApp.flush();
    }
    return { ok: true, code: 'CREATED', data: stored.data };
  } catch (error) {
    // Do not erase evidence or append a new submission on retry.
    // If commit is already written, leave it COMMITTED; replay repairs the projections.
    try {
      var current = lvFind_(ctx, 'Idempotencia', { idempotency_key: key });
      if (current && current.state !== 'COMMITTED') lvPatch_(ctx, 'Idempotencia', current,
        { state: 'RECOVERY_REQUIRED', updated_at: new Date().toISOString() });
    } catch (ignored) { /* A failed write can also prevent recording its own failure. */ }
    lvFail_('RECOVERY_REQUIRED', 'Operação interrompida. Preserve o pedido e reenvie o mesmo request_id e conteúdo.');
  }
}
function lvCommitted_(ctx, operation) {
  return lvRows_(ctx, 'Idempotencia').filter(function (r) {
    return r.state === 'COMMITTED' && (!operation || r.operation === operation);
  }).map(function (r) {
    var receipt;
    try { receipt = JSON.parse(r.receipt_json); }
    catch (e) { lvFail_('INTEGRITY_ERROR', 'Recibo confirmado ilegível.'); }
    lvAssert_(receipt && receipt.plan && receipt.data, 'INTEGRITY_ERROR', 'Recibo confirmado incompleto.');
    return { row: r, plan: receipt.plan, data: receipt.data };
  });
}

