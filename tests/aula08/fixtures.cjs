'use strict';
const {moduleFile}=require('./harness.cjs');
const Content=require(moduleFile('content.js'));
const Model=require(moduleFile('model.js'));
function complete(track='memorias') {
  const state=Model.createState();Model.switchTrack(state,track);
  for(const mission of Content.missions)for(const question of Content.tracks[track].missions[mission.id].questions)Model.answer(state,mission.id,question.id,question.correct);
  return state;
}
function withCatalog(track='memorias') {
  const state=complete(track);
  for(const [type,example]of Object.entries(Content.tracks[track].catalogExamples))for(const field of ['text','source','sourceStatus','criterion','priority'])if(example[field]!==undefined)Model.setCatalog(state,type,field,example[field]);
  Model.setExit(state,'Rascunho sintético: preciso conferir fonte, mensurabilidade e escopo antes da validação docente.');
  return state;
}
module.exports={Content,Model,complete,withCatalog};
