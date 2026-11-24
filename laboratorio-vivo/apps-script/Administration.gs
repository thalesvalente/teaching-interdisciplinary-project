/** Explicit versioned teacher/admin actions; never called automatically by doGet. */
function lvSetConfig_(ctx,key,value,actor,timestamp) {
  var data = {config_key:key,config_value:typeof value==='string'?value:JSON.stringify(value),
    value_type:typeof value==='number'?'integer':(typeof value==='object'?'json':'string'),
    version:ctx.config.plan_version || LV_VERSION_,approval_status:'APROVADA',
    updated_at:timestamp,updated_by:actor.participant_id};
  lvUpsert_(ctx,'Config',{config_key:key},data);
}
function saveActivityVersion(input) {
  return lvCall_('saveActivityVersion',input,true,function(ctx,actor) {
    lvTeacher_(actor);
    return lvMutation_(ctx,actor,'saveActivityVersion',input,function(c,a,p,k) {
      lvKeys_(p,['activity','rubric','change_reason'],['activity','rubric','change_reason']);
      lvText_(p.change_reason,1000,true);
      var v=p.activity;
      lvKeys_(v,['activity_id','activity_version','lesson_id','stage','track_id','title','kind','official_item_id',
        'official_max','xp_max','criteria_version','schema_version','questions'],
        ['activity_id','activity_version','lesson_id','stage','track_id','title','kind','official_item_id',
          'official_max','xp_max','criteria_version','schema_version','questions']);
      ['activity_id','activity_version','lesson_id','criteria_version'].forEach(function(field){lvId_(v[field]);});
      lvText_(v.title,200,true);
      lvAssert_(v.schema_version===LV_VERSION_ && [3,4].indexOf(v.stage)>=0 &&
        ['QUILOMBOLA','PERMANENCIA','AMBOS'].indexOf(v.track_id)>=0 && ['FORMATIVA','OFICIAL'].indexOf(v.kind)>=0,
        'CATALOG_INVALID','Metadados de atividade inválidos.');
      lvAssert_(!lvFind_(c,'Atividades',{activity_id:v.activity_id,activity_version:v.activity_version}),
        'IMMUTABLE_VERSION','Essa versão já existe; crie uma versão nova.');
      var history=lvRows_(c,'Atividades').filter(function(r){return r.activity_id===v.activity_id;});
      lvAssert_(!history.some(function(r){return r.criteria_version===v.criteria_version;}),
        'IMMUTABLE_VERSION','Uma nova versão exige novo identificador de rubrica.');
      if(v.kind==='OFICIAL') {
        lvAssert_(/^PPI1-[34][ABC]$/.test(v.activity_id) && v.official_item_id===v.activity_id &&
          v.stage===Number(v.activity_id.slice(5,6)) && typeof v.official_max==='number' &&
          v.official_max>0 && v.official_max<=10 && v.xp_max===0,
          'CATALOG_INVALID','Item oficial/limite inválido ou XP misturado à nota.');
      } else lvAssert_(v.official_item_id==='' && (v.official_max===null || v.official_max===0 || v.official_max==='') &&
        Number.isInteger(v.xp_max) && v.xp_max>=0 && v.xp_max<=100,
        'CATALOG_INVALID','Atividade formativa não pode mapear automaticamente para nota.');
      lvQuestions_({questions_json:JSON.stringify(v.questions)});
      lvAssert_(Array.isArray(p.rubric) && p.rubric.length>0 && p.rubric.length<=32,'RUBRIC_INVALID','Rubrica inválida.');
      var seen=Object.create(null),sum=0;
      p.rubric.forEach(function(r){
        lvKeys_(r,['criterion_id','label','max_points'],['criterion_id','label','max_points']);
        lvId_(r.criterion_id);lvText_(r.label,300,true);
        lvAssert_(!seen[r.criterion_id] && typeof r.max_points==='number' && Number.isFinite(r.max_points) &&
          r.max_points>=0 && r.max_points<=100,'RUBRIC_INVALID','Critério duplicado ou fora do limite.');
        seen[r.criterion_id]=true;sum+=r.max_points;
      });
      lvAssert_(Math.abs(sum-Number(v.kind==='OFICIAL'?v.official_max:v.xp_max))<1e-8,
        'RUBRIC_INVALID','A soma dos critérios precisa coincidir com o valor máximo.');
      if(v.kind==='FORMATIVA') {
        var expected={understood:30,evidence_checked:40,authorship_declared:30};
        lvAssert_(v.xp_max===100 && p.rubric.length===3 && p.rubric.every(function(r){return expected[r.criterion_id]===r.max_points;}),
          'RUBRIC_INVALID','Contrato formativo 1.0.0 usa três verificações 30/40/30; outra escala exige evolução do contrato.');
      }
      return {activity_id:v.activity_id,activity_version:v.activity_version,criteria_version:v.criteria_version,
        change_reason:p.change_reason};
    },function(c,a,plan,p){
      var v=Object.assign({},p.activity);
      delete v.questions;
      v.questions_json=JSON.stringify(p.activity.questions);v.status='RASCUNHO';v.updated_at=plan.timestamp;
      if(v.official_max===null)v.official_max='';
      lvEnsure_(c,'Atividades',v);
      p.rubric.forEach(function(r){
        var max=Number(v.kind==='OFICIAL'?v.official_max:v.xp_max);
        lvEnsure_(c,'Rubricas',{rubric_id:v.activity_id,criteria_version:v.criteria_version,activity_id:v.activity_id,
          criterion_id:r.criterion_id,label:r.label,evaluation_type:v.kind==='OFICIAL'?'DOCENTE_OFICIAL':'FORMATIVA',
          max_points:r.max_points,weight:max?r.max_points/max:0,status:'RASCUNHO',approved_by:'',approved_at:''});
      });
      return {activity_id:plan.activity_id,activity_version:plan.activity_version,criteria_version:plan.criteria_version,status:'RASCUNHO'};
    });
  });
}
function approveRubric(input) {
  return lvCall_('approveRubric',input,true,function(ctx,actor){
    lvTeacher_(actor);
    return lvMutation_(ctx,actor,'approveRubric',input,function(c,a,p,k){
      lvKeys_(p,['activity_id','activity_version','criteria_version','approval_ref'],
        ['activity_id','activity_version','criteria_version','approval_ref']);
      var activity=lvActivity_(c,p.activity_id,p.activity_version,false);
      lvAssert_(activity.criteria_version===p.criteria_version,'VERSION_MISMATCH','Rubrica divergente.');
      lvText_(p.approval_ref,300,true);
      lvAssert_(p.approval_ref.length>=8,'APPROVAL_REQUIRED','Registre referência explícita da aprovação docente.');
      var rubric=lvRubric_(c,activity,false);
      lvAssert_(rubric.every(function(r){return r.status==='RASCUNHO';}),'IMMUTABLE_VERSION','Rubrica já aprovada/arquivada; use nova versão.');
      return {activity_id:activity.activity_id,activity_version:activity.activity_version,criteria_version:activity.criteria_version,
        approval_ref:p.approval_ref};
    },function(c,a,plan,p){
      lvRows_(c,'Rubricas').filter(function(r){return r.activity_id===plan.activity_id && r.criteria_version===plan.criteria_version;})
        .forEach(function(r){lvPatch_(c,'Rubricas',r,{status:'APROVADA',approved_by:a.participant_id,approved_at:plan.timestamp});});
      return {activity_id:plan.activity_id,criteria_version:plan.criteria_version,status:'APROVADA'};
    });
  });
}
function activateActivity(input) {
  return lvCall_('activateActivity',input,true,function(ctx,actor){
    lvTeacher_(actor);
    return lvMutation_(ctx,actor,'activateActivity',input,function(c,a,p,k){
      lvKeys_(p,['activity_id','activity_version','status'],['activity_id','activity_version','status']);
      lvAssert_(['ATIVA','ARQUIVADA'].indexOf(p.status)>=0,'INVALID_STATUS','Estado de atividade inválido.');
      var activity=lvActivity_(c,p.activity_id,p.activity_version,false);
      if(p.status==='ATIVA') {
        lvRubric_(c,activity,true);
        if(activity.kind==='OFICIAL')lvPlanItem_(c,activity);
      }
      return {activity_id:activity.activity_id,activity_version:activity.activity_version,status:p.status};
    },function(c,a,plan,p){
      lvPatch_(c,'Atividades',lvFind_(c,'Atividades',{activity_id:plan.activity_id,activity_version:plan.activity_version}),
        {status:plan.status,updated_at:plan.timestamp});
      return {activity_id:plan.activity_id,activity_version:plan.activity_version,status:plan.status};
    });
  });
}
function approvePlan(input) {
  return lvCall_('approvePlan',input,true,function(ctx,actor){
    lvAdmin_(actor);
    return lvMutation_(ctx,actor,'approvePlan',input,function(c,a,p,k){
      lvKeys_(p,['plan_version','approval_ref','items'],['plan_version','approval_ref','items']);
      lvId_(p.plan_version);lvText_(p.approval_ref,300,true);
      lvAssert_(p.approval_ref.length>=8,'APPROVAL_REQUIRED','Registre referência institucional ou evidência sintética de QA.');
      lvAssert_(!lvCommitted_(c,'approvePlan').some(function(r){return r.plan.plan_version===p.plan_version;}),
        'IMMUTABLE_VERSION','Versão de plano já aprovada. Crie nova versão.');
      lvAssert_(Array.isArray(p.items) && p.items.length===6,'PLAN_INVALID','O plano precisa dos seis itens explícitos.');
      var seen=Object.create(null),sums={3:0,4:0},items=[];
      p.items.forEach(function(i){
        lvKeys_(i,['activity_id','activity_version','criteria_version'],['activity_id','activity_version','criteria_version']);
        lvAssert_(/^PPI1-[34][ABC]$/.test(i.activity_id) && !seen[i.activity_id],'PLAN_INVALID','Item oficial repetido/desconhecido.');
        seen[i.activity_id]=true;
        var activity=lvActivity_(c,i.activity_id,i.activity_version,false);
        lvAssert_(activity.kind==='OFICIAL' && activity.official_item_id===i.activity_id &&
          activity.criteria_version===i.criteria_version && Number(activity.stage)===Number(i.activity_id.slice(5,6)) &&
          Number(activity.xp_max)===0 && Number(activity.official_max)>0 && Number(activity.official_max)<=10,
          'PLAN_INVALID','Versão, etapa ou limite do item não corresponde ao catálogo.');
        lvRubric_(c,activity,true);
        sums[activity.stage]+=Number(activity.official_max);
        items.push({activity_id:activity.activity_id,activity_version:activity.activity_version,
          criteria_version:activity.criteria_version,official_max:Number(activity.official_max)});
      });
      lvAssert_(Math.abs(sums[3]-10)<1e-8 && Math.abs(sums[4]-10)<1e-8,'PLAN_INVALID','Cada etapa precisa totalizar dez pontos.');
      return {plan_version:p.plan_version,items:items};
    },function(c,a,plan,p){
      // Revoke the previous plan first. All totals fail closed during transition.
      lvSetConfig_(c,'plan_status','RASCUNHO',a,plan.timestamp);
      lvSetConfig_(c,'plan_version',plan.plan_version,a,plan.timestamp);
      lvSetConfig_(c,'plan_approval_ref',p.approval_ref,a,plan.timestamp);
      lvSetConfig_(c,'plan_approval_request_id',plan.key,a,plan.timestamp);
      lvSetConfig_(c,'plan_items_json',plan.items,a,plan.timestamp);
      plan.items.forEach(function(i){lvSetConfig_(c,'plan_max_'+i.activity_id,i.official_max,a,plan.timestamp);});
      return {plan_version:plan.plan_version,status:'EM_REVISAO',official_grade_posted:false};
    },function(c,a,plan,p,data){
      // An old replay cannot reactivate a superseded institutional plan.
      c.config=lvConfig_(c);
      if(c.config.plan_version!==plan.plan_version || c.config.plan_approval_request_id!==plan.key)
        return Object.assign({},data,{status:'SUPERADA'});
      lvSetConfig_(c,'plan_status','APROVADO',a,plan.timestamp);
      c.config=lvConfig_(c);
      return Object.assign({},data,{status:'APROVADO'});
    });
  });
}
function revokePlan(input) {
  return lvCall_('revokePlan',input,true,function(ctx,actor){
    lvAdmin_(actor);
    return lvMutation_(ctx,actor,'revokePlan',input,function(c,a,p,k){
      lvKeys_(p,['plan_version','reason'],['plan_version','reason']);
      lvText_(p.reason,1000,true);
      lvAssert_(p.plan_version===c.config.plan_version,'PLAN_VERSION_MISMATCH','Plano atual mudou.');
      return {plan_version:p.plan_version,reason:p.reason};
    },function(c,a,plan,p){
      lvSetConfig_(c,'plan_status','RASCUNHO',a,plan.timestamp);
      lvSetConfig_(c,'plan_approval_request_id',plan.key,a,plan.timestamp);
      return {plan_version:plan.plan_version,status:'RASCUNHO'};
    });
  });
}
function registerTeam(input) {
  return lvCall_('registerTeam',input,true,function(ctx,actor){
    lvTeacher_(actor);
    return lvMutation_(ctx,actor,'registerTeam',input,function(c,a,p,k){
      lvKeys_(p,['team_id','display_name','track_id'],['team_id','display_name','track_id']);
      lvId_(p.team_id);lvText_(p.display_name,100,true);
      lvAssert_(['QUILOMBOLA','PERMANENCIA'].indexOf(p.track_id)>=0,'INVALID_TRACK','Trilha desconhecida.');
      lvAssert_(!lvFind_(c,'Equipes',{team_id:p.team_id}),'ALREADY_EXISTS','Equipe já cadastrada.');
      return {team_id:p.team_id};
    },function(c,a,plan,p){
      lvEnsure_(c,'Equipes',{team_id:p.team_id,display_name:p.display_name,track_id:p.track_id,status:'ATIVA',created_at:plan.timestamp});
      return {team_id:p.team_id,status:'ATIVA'};
    });
  });
}
function registerParticipant(input) {
  return lvCall_('registerParticipant',input,true,function(ctx,actor){
    lvTeacher_(actor);
    return lvMutation_(ctx,actor,'registerParticipant',input,function(c,a,p,k){
      lvKeys_(p,['participant_id','team_id','display_name','authorship_validated'],
        ['participant_id','team_id','display_name','authorship_validated']);
      lvId_(p.participant_id);lvId_(p.team_id);lvText_(p.display_name,100,true);
      lvAssert_(typeof p.authorship_validated==='boolean','INVALID_PAYLOAD','Validação docente precisa ser explícita.');
      var team=lvFind_(c,'Equipes',{team_id:p.team_id});
      lvAssert_(team && team.status==='ATIVA','TEAM_INACTIVE','Equipe não está ativa.');
      lvAssert_(!lvFind_(c,'Participantes',{participant_id:p.participant_id}),'ALREADY_EXISTS','Participante já cadastrado.');
      return {participant_id:p.participant_id};
    },function(c,a,plan,p){
      lvEnsure_(c,'Participantes',{participant_id:p.participant_id,team_id:p.team_id,display_name:p.display_name,
        role:'ESTUDANTE',status:'ATIVA',authorship_validated:p.authorship_validated,created_at:plan.timestamp});
      return {participant_id:p.participant_id,status:'ATIVA',login_created:false};
    });
  });
}
