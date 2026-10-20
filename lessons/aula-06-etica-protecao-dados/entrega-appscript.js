/* Aula 06: recibo de entrega via formulário oculto para Apps Script. */
(() => {
 'use strict';
 // Cole aqui exclusivamente a URL /exec produzida pela implantação do Apps Script.
 // Sem endpoint configurado, nenhum dado é transmitido.
 const ENDPOINT = '';
 const origemGoogle = origin => /^https:\/\/([a-z0-9-]+\.)?script\.googleusercontent\.com$/.test(origin) || origin==='https://script.google.com';
 let busy = false;
 function sha256(bytes) {
   return crypto.subtle.digest('SHA-256',bytes).then(buf=>
     [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,'0')).join(''));
 }
 async function enviar(snapshot,bytes) {
   if(busy)throw Error('Já existe uma entrega em andamento.');
   if(!ENDPOINT)throw Error('Integração ainda não ativada pelo professor. O PDF foi gerado localmente, mas não foi entregue.');
   if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(ENDPOINT))throw Error('URL de envio inválida.');
   if(!crypto?.subtle)throw Error('Esta página precisa de HTTPS para registrar o hash.');
   busy=true;
   const nonce=crypto.randomUUID(),hash=await sha256(bytes);
   try {
     return await new Promise((resolve,reject)=>{
       const frame=document.createElement('iframe');
       frame.hidden=true;
       frame.name='entrega-'+nonce;
       frame.title='Confirmação automática da entrega';
       const form=document.createElement('form');
       form.hidden=true;form.method='POST';form.action=ENDPOINT;form.target=frame.name;
       const fields={nonce,payload:JSON.stringify({schema:'ppi-f02-v1',activity:'PPI1-AULA06-2026',snapshot,pdfSha256:hash})};
       for(const [name,value] of Object.entries(fields)){
         const field=document.createElement('input');field.name=name;field.value=value;form.append(field);
       }
       let done=false;
       const finish=(err,result)=>{
         if(done)return;done=true;
         clearTimeout(timer);window.removeEventListener('message',receive);
         frame.remove();form.remove();
         err?reject(err):resolve(result);
       };
       const receive=e=>{
         if(!origemGoogle(e.origin))return;
         const d=e.data;
         if(!d || d.channel!=='ppi-entrega-aula06'||d.nonce!==nonce)return;
         if(!d.ok)finish(Error(d.error||'Envio rejeitado.'));
         else if(d.pdfSha256!==hash)finish(Error('Hash não corresponde ao PDF enviado.'));
         else finish(null,d);
       };
       const timer=setTimeout(()=>finish(Error('Não foi possível confirmar o recebimento. Verifique antes de reenviar.')),45000);
       window.addEventListener('message',receive);
       document.body.append(frame,form);
       form.submit();
     });
   }finally{busy=false;}
 }
 window.PpiEntrega=Object.freeze({enviar,get configurado(){return !!ENDPOINT;}});
})();
