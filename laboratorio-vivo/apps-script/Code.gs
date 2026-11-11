/** Public RPC surface. Private helpers cannot be called through google.script.run. */
function doGet() {
  // Only the public application shell is returned here; each RPC performs fresh authentication.
  return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('PPI I — Laboratório Vivo')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}
function include_(name) {
  lvAssert_(['Styles','Client'].indexOf(name)>=0,'INVALID_TEMPLATE','Template não permitido.');
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}
function lvCall_(operation,input,writing,handler) {
  var lock = null, ctx = null, actor = null;
  try {
    if (writing) {
      lock = LockService.getScriptLock();
      lvAssert_(lock.tryLock(LV_LIMITS_.lockMs),'BUSY_RETRY','Outro pedido está em andamento. Tente novamente com o mesmo request_id.');
    }
    ctx = lvContext_(!!lock,writing);
    actor = lvAuthorize_(ctx);
    if (input!==undefined) {
      var canonical = lvCanonical_(input);
      lvAssert_(lvUtf8Length_(canonical)<=LV_LIMITS_.payloadBytes+2000,'PAYLOAD_TOO_LARGE','Pedido excede o limite de transporte.');
    }
    var result = handler(ctx,actor,input);
    return result && typeof result.ok==='boolean' ? result : {ok:true,code:'OK',data:result};
  } catch (error) {
    var code = error.lvCode || 'INTERNAL_ERROR';
    if (writing && ctx && actor && ctx.writeAllowed && code!=='CONFLICT' && code!=='RECOVERY_REQUIRED') {
      try { lvAudit_(ctx,actor,operation,'','REJECTED','', '',code); } catch(ignored) { /* No sensitive fallback logging. */ }
    }
    return {ok:false,code:code,error:{message:error.lvCode?error.message:'Falha interna. Preserve o pedido e solicite revisão docente.'}};
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
function getBootstrap() {
  return lvCall_('getBootstrap',undefined,false,function(ctx,actor) {
    return {schema_version:LV_VERSION_,environment:ctx.environment,timezone:'America/Fortaleza',
      writes_enabled:ctx.writeAllowed,student_access_enabled:lvBool_(ctx.config.student_access_enabled),
      plan:{version:ctx.config.plan_version,status:ctx.config.plan_status},viewer:actor,
      activities:lvCatalog_(ctx,actor),capabilities:{submit:ctx.writeAllowed,
        review:ctx.writeAllowed && actor.role!=='ESTUDANTE',admin:ctx.writeAllowed && actor.role==='ADMIN',export:true}};
  });
}
function getActivityCatalog() {
  return lvCall_('getActivityCatalog',undefined,false,function(ctx,actor) {return {activities:lvCatalog_(ctx,actor)};});
}
function saveDraft(input) {return lvSave_(input,false);}
function submitActivity(input) {return lvSave_(input,true);}
function lvSave_(input,submitted) {
  var operation = submitted?'submitActivity':'saveDraft';
  return lvCall_(operation,input,true,function(ctx,actor) {
    var validated = lvEnvelope_(input);
    lvSubmissionOwner_(ctx,actor,validated.payload);
    return lvMutation_(ctx,actor,operation,input,function(c,a,p,k,h) {
      return lvPrepareSubmission_(c,a,p,k,h,submitted);
    },lvApplySubmission_,lvProjectSubmission_);
  });
}
function getReceipt(input) {
  return lvCall_('getReceipt',input,false,function(ctx,actor) {return lvReceipt_(ctx,actor,input);});
}
function getTeamProgress(input) {
  return lvCall_('getTeamProgress',input || {},false,function(ctx,actor) {return lvProgress_(ctx,actor,input || {});});
}
function reviewSubmission(input) {
  return lvCall_('reviewSubmission',input,true,function(ctx,actor) {
    lvTeacher_(actor);
    return lvMutation_(ctx,actor,'reviewSubmission',input,lvPrepareReview_,lvApplyReview_,lvProjectReview_);
  });
}
function exportReport(input) {
  return lvCall_('exportReport',input,false,function(ctx,actor) {return lvExport_(ctx,actor,input);});
}
