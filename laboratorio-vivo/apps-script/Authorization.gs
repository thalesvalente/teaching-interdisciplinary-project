/** Private resource binding and authenticated principals. No browser identity is trusted. */
function lvPropertyJson_(properties, key) {
  try { return JSON.parse(properties.getProperty(key) || 'null'); }
  catch (e) { lvFail_('CONFIGURATION_REQUIRED', 'Configuração privada inválida.'); }
}
function lvPrivateBinding_(props) {
  var binding = lvPropertyJson_(props, 'PPI_BINDING_JSON');
  var deny = lvPropertyJson_(props, 'PPI_PROTECTED_IDS_JSON');
  lvAssert_(lvPlainObject_(binding) && typeof binding.spreadsheet_id === 'string' &&
    /^[A-Za-z0-9_-]{20,100}$/.test(binding.spreadsheet_id) &&
    ['QA', 'PRODUCTION'].indexOf(binding.environment) >= 0 &&
    typeof binding.script_id === 'string' && binding.script_id === ScriptApp.getScriptId() &&
    typeof binding.expected_title === 'string' && binding.expected_title.indexOf('PPI I — Laboratório Vivo 2026.2') === 0 &&
    typeof binding.binding_nonce === 'string' && /^[A-Za-z0-9_-]{24,128}$/.test(binding.binding_nonce),
    'BLOCKED_TARGET_AMBIGUOUS', 'Vínculo exclusivo de ambiente, projeto e planilha não foi validado.');
  lvAssert_(Array.isArray(deny) && deny.length >= 3 &&
    deny.every(function (id) { return typeof id === 'string' && id.length >= 20; }) &&
    new Set(deny).size === deny.length && deny.indexOf(binding.spreadsheet_id) < 0,
    'BLOCKED_TARGET_AMBIGUOUS', 'Lista de fontes protegidas ausente, inválida ou alvo proibido.');
  return binding;
}
function lvContext_(locked, writing) {
  var props = PropertiesService.getScriptProperties();
  var binding = lvPrivateBinding_(props);
  var book = SpreadsheetApp.openById(binding.spreadsheet_id);
  lvAssert_(book.getId() === binding.spreadsheet_id && book.getName() === binding.expected_title,
    'BLOCKED_TARGET_AMBIGUOUS', 'Readback do ID ou título diverge do destino.');
  var ctx = { properties: props, binding: binding, environment: binding.environment, book: book,
    locked: locked, writeAllowed: false };
  ctx.config = lvConfig_(ctx);
  lvAssert_(ctx.config.spreadsheet_id === binding.spreadsheet_id &&
    ctx.config.environment === binding.environment && ctx.config.binding_nonce === binding.binding_nonce,
    'BLOCKED_TARGET_AMBIGUOUS', 'A planilha não confirma o vínculo privado do ambiente.');
  lvAssert_(ctx.config.schema_version === LV_VERSION_, 'SCHEMA_VERSION_MISMATCH', 'Esquema da planilha incompatível.');
  lvAssert_(ctx.config.timezone === 'America/Fortaleza' && book.getSpreadsheetTimeZone() === 'America/Fortaleza',
    'TIMEZONE_MISMATCH', 'Timezone do ambiente deve ser America/Fortaleza.');
  lvAssert_(book.getSpreadsheetLocale() === 'pt_BR', 'LOCALE_MISMATCH',
    'Locale da planilha deve ser pt_BR para as fórmulas nativas verificadas.');
  ctx.writeAllowed = props.getProperty('PPI_WRITES_ENABLED') === 'true' && lvBool_(ctx.config.writes_enabled);
  if (ctx.environment === 'PRODUCTION') {
    var gate = lvPropertyJson_(props, 'PPI_PRODUCTION_GATE_JSON');
    ctx.writeAllowed = ctx.writeAllowed && lvPlainObject_(gate) && gate.approved === true &&
      gate.binding_nonce === binding.binding_nonce && typeof gate.approval_ref === 'string' &&
      gate.approval_ref.trim().length >= 8 && gate.connected_qa_pass === true && gate.privacy_pass === true;
  }
  if (writing) lvAssert_(ctx.writeAllowed, 'WRITES_DISABLED', 'Gravações desativadas; utilize o modo offline ou o docente.');
  return ctx;
}
function lvAuthorize_(ctx) {
  var email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  lvAssert_(email.length > 0, 'AUTHENTICATION_REQUIRED', 'Identidade autenticada não verificável nesta implantação.');
  var identities = lvPropertyJson_(ctx.properties, 'PPI_IDENTITIES_JSON');
  lvAssert_(lvPlainObject_(identities) && Object.prototype.hasOwnProperty.call(identities, email),
    'FORBIDDEN', 'Conta sem autorização para este laboratório.');
  var record = identities[email];
  lvAssert_(lvPlainObject_(record) && record.active === true &&
    ['ESTUDANTE', 'DOCENTE', 'ADMIN'].indexOf(record.role) >= 0,
    'FORBIDDEN', 'Acesso inativo ou papel inválido.');
  lvId_(record.participant_id);
  var actor = { participant_id: record.participant_id, role: record.role,
    team_id: record.team_id || '', display_name: record.display_name || record.participant_id };
  if (actor.role === 'ESTUDANTE') {
    lvAssert_(lvBool_(ctx.config.student_access_enabled), 'STUDENT_ACCESS_DISABLED', 'Acesso discente ainda não foi homologado.');
    var participant = lvParticipant_(ctx, actor.participant_id);
    lvAssert_(participant.team_id === actor.team_id && participant.role === 'ESTUDANTE', 'FORBIDDEN', 'Vínculo institucional divergente.');
    actor.display_name = participant.display_name;
  }
  return actor;
}
function lvTeacher_(actor) {
  lvAssert_(actor.role === 'DOCENTE' || actor.role === 'ADMIN', 'FORBIDDEN', 'Operação exclusiva do docente autorizado.');
}
function lvAdmin_(actor) { lvAssert_(actor.role === 'ADMIN', 'FORBIDDEN', 'Operação exclusiva da administração autorizada.'); }
function lvParticipant_(ctx, id) {
  lvId_(id);
  var participant = lvFind_(ctx, 'Participantes', { participant_id: id });
  lvAssert_(participant && participant.status === 'ATIVA' && participant.role === 'ESTUDANTE' &&
    lvBool_(participant.authorship_validated), 'PARTICIPANT_NOT_VALIDATED', 'Participante precisa de vínculo e autoria validados pelo docente.');
  var team = lvFind_(ctx, 'Equipes', { team_id: participant.team_id });
  lvAssert_(team && team.status === 'ATIVA', 'TEAM_INACTIVE', 'Equipe não está ativa.');
  return Object.assign({}, participant, { track_id: team.track_id });
}
function lvSubmissionOwner_(ctx, actor, payload) {
  if (actor.role === 'ESTUDANTE') {
    lvAssert_(!payload.on_behalf_of, 'FORBIDDEN', 'Estudante não pode agir por outro participante.');
    return lvParticipant_(ctx, actor.participant_id);
  }
  lvTeacher_(actor);
  lvAssert_(payload.on_behalf_of, 'PARTICIPANT_REQUIRED', 'O docente deve selecionar o participante validado.');
  return lvParticipant_(ctx, payload.on_behalf_of);
}
function lvCanReadSubmission_(actor, submission) {
  lvAssert_(submission && (actor.role !== 'ESTUDANTE' || actor.participant_id === submission.participant_id),
    'NOT_FOUND_OR_FORBIDDEN', 'Submissão inexistente ou não autorizada.');
}

