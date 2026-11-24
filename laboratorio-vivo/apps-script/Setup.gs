/** Run manually in the NEW native Apps Script editor only. Not callable by google.script.run. */
function initializeBinding_() {
  var lock=LockService.getScriptLock();
  try {
    lvAssert_(lock.tryLock(LV_LIMITS_.lockMs),'BUSY_RETRY','Outra operação está em andamento.');
    var props=PropertiesService.getScriptProperties();
    var binding=lvPrivateBinding_(props);
    var book=SpreadsheetApp.openById(binding.spreadsheet_id);
    lvAssert_(book.getId()===binding.spreadsheet_id && book.getName()===binding.expected_title,
      'BLOCKED_TARGET_AMBIGUOUS','Readback de ID/título diverge do recurso novo autorizado.');
    lvAssert_(book.getSpreadsheetTimeZone()==='America/Fortaleza' && book.getSpreadsheetLocale()==='pt_BR',
      'CONFIGURATION_REQUIRED','Defina timezone America/Fortaleza e locale pt_BR no workbook novo.');
    var ctx={properties:props,binding:binding,environment:binding.environment,book:book,locked:true,writeAllowed:false};
    Object.keys(LV_TABLES_).forEach(function(table){lvSheet_(ctx,table);});
    ctx.config=lvConfig_(ctx);
    lvAssert_(ctx.config.schema_version===LV_VERSION_ && ctx.config.environment===binding.environment &&
      ctx.config.timezone==='America/Fortaleza','BLOCKED_TARGET_AMBIGUOUS','Esquema/ambiente do workbook não corresponde.');
    lvAssert_((!ctx.config.spreadsheet_id || ctx.config.spreadsheet_id===binding.spreadsheet_id) &&
      (!ctx.config.binding_nonce || ctx.config.binding_nonce===binding.binding_nonce),
      'BLOCKED_TARGET_AMBIGUOUS','Workbook já vinculado a outro ID/nonce; não sobrescreva configuração.');
    var actor=lvAuthorize_(ctx);
    lvAdmin_(actor);
    // Gates are closed BEFORE any initialization writes; initialization never enables a service.
    var changed=0;
    if(props.getProperty('PPI_WRITES_ENABLED')!=='false'){props.setProperty('PPI_WRITES_ENABLED','false');changed++;}
    ctx.writeAllowed=true; // Editor-only maintenance capability, bounded by the verified binding.
    var now=new Date().toISOString();
    [['writes_enabled','false'],['student_access_enabled','false'],['spreadsheet_id',binding.spreadsheet_id],
      ['binding_nonce',binding.binding_nonce]].forEach(function(pair){
      if(String(ctx.config[pair[0]])===pair[1])return;
      changed++;
      lvUpsert_(ctx,'Config',{config_key:pair[0]},{config_key:pair[0],config_value:pair[1],
        value_type:pair[0].indexOf('enabled')>=0?'boolean':'string',version:LV_VERSION_,approval_status:'APROVADA',
        updated_at:now,updated_by:actor.participant_id});
    });
    var auditId='init-'+lvSha_(binding.script_id+':'+binding.binding_nonce);
    if(!lvFind_(ctx,'Auditoria',{event_id:auditId})){
      changed++;
      lvAudit_(ctx,actor,'initializeBinding','', 'SUCCESS','','','INITIALIZED_WITH_WRITES_DISABLED',auditId,now);
    }
    SpreadsheetApp.flush();
    return {ok:true,code:changed?'CREATED':'NO_OP',data:{environment:binding.environment,schema_version:LV_VERSION_,
      initialized:true,writes_enabled:false,student_access_enabled:false,browserRoundTrip:false,connected_qa:'NOT_RUN'}};
  } catch(error) {
    return {ok:false,code:error.lvCode||'INITIALIZATION_FAILED',error:{message:error.lvCode?error.message:
      'Inicialização interrompida. Confira o vínculo e repita no editor; nenhuma ativação foi feita.'}};
  } finally {if(lock.hasLock())lock.releaseLock();}
}
