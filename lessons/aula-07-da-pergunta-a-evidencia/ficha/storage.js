(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./model.js'):root.PPIModel);if(typeof module==='object'&&module.exports)module.exports=api;else root.PPIStorage=api;})(typeof globalThis!=='undefined'?globalThis:this,function(M){'use strict';
const LOCAL_KEY='ppi-aula07-ficha-v1',UI_KEY=LOCAL_KEY+'-ui';
function save(state,storage){try{storage.setItem(LOCAL_KEY,JSON.stringify(state));return {ok:true,message:'Rascunho salvo neste dispositivo.'};}catch{return {ok:false,message:'Não foi possível salvar neste dispositivo. Baixe o rascunho JSON para guardar suas respostas.'};}}
function load(storage){try{const raw=storage.getItem(LOCAL_KEY);return {ok:true,state:raw?M.validateImport(raw):null,message:raw?'Rascunho local retomado.':'Suas respostas ficam somente neste dispositivo.'};}catch(error){return {ok:false,state:null,message:'O rascunho local não pôde ser retomado: '+error.message+' O arquivo local foi preservado.'};}}
function saveUI(ui,storage){try{storage.setItem(UI_KEY,JSON.stringify(ui));}catch{/* Responses remain in memory; UI persistence is optional. */}}
function loadUI(storage){try{const v=JSON.parse(storage.getItem(UI_KEY)||'{}');return {mission:Number.isInteger(v.mission)&&v.mission>=0&&v.mission<=8?v.mission:0,contrast:v.contrast===true};}catch{return {mission:0,contrast:false};}}
return {LOCAL_KEY,UI_KEY,save,load,saveUI,loadUI};
});
