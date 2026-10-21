/**
 * Bateria isolada: executa o Code.gs REAL em VM com SpreadsheetApp simulado.
 * Nenhuma chamada à conta Google e nenhum dado real. Node.js >= 20.
 * Rodar: node --test tests/ppi-entregas.test.cjs
 */
'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {TextEncoder}=require('node:util');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'lessons','aula-06-etica-protecao-dados');
const source=fs.readFileSync(path.join(base,'appscript','Code.gs'),'utf8');
const pdfCode=fs.readFileSync(path.join(base,'atividade-pdf.js'),'utf8');
const auditHeaders=['Aluno','Equipe','Atividade','Data/hora BRT','Recebido UTC',
  'ID entrega','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC',
  'XP / 100','Nota / 10','Situação','Respostas JSON','Chave interna'];
const rubric=[
  'item','finalidade','fonte','acesso','identifica','sensivel','estrategia','minimizacao',
  'autorizacao','informar','publicacao','dataVersao','transformacoes','restricoes',
  'risco1','prob1','impacto1','mitigacao1','risco2','prob2','impacto2','mitigacao2',
  'regraEquipe','forca','ajuste','proximaAcao'
];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function fakeSheet(name,headers) {
  const sheet={name,rows:[headers.slice()],failOnWrite:false,
    getName(){return this.name;},
    getLastRow(){return this.rows.length;},
    getLastColumn(){return this.rows[0].length;},
    insertColumnBefore(col){
      for(const row of this.rows)row.splice(col-1,0,'');
    },
    getRange(r,c,rows=1,cols=1){
      if(r<1||c<1||rows<1||cols<1)throw Error('Range inválido');
      const sh=this;
      return {
        getValues(){return Array.from({length:rows},(_,i)=>
          Array.from({length:cols},(_,j)=>sh.rows[r+i-1]?.[c+j-1]??''));},
        setValues(arr){
          if(sh.failOnWrite)throw Error('Falha de escrita simulada');
          assert.equal(arr.length,rows);
          for(let i=0;i<rows;i++){
            assert.equal(arr[i].length,cols);
            while(sh.rows.length<r+i)sh.rows.push([]);
            for(let j=0;j<cols;j++)sh.rows[r+i-1][c+j-1]=arr[i][j];
          }
        },
        setValue(v){this.setValues([[v]]);},
        setFormulas(v){this.setValues(v);},
        setNumberFormat(){},
        sort(spec){
          const s=Array.isArray(spec)?spec:[{column:spec,ascending:true}];
          const begin=r-1,end=begin+rows;
          const slice=sh.rows.slice(begin,end);
          const sorted=slice.sort((a,b)=>{
            for(const rule of s){
              const av=String(a[rule.column-1]??'');
              const bv=String(b[rule.column-1]??'');
              const cmp=av.localeCompare(bv,'pt-BR',{sensitivity:'base'});
              if(cmp)return rule.ascending===false?-cmp:cmp;
            }
            return 0;
          });
          sh.rows.splice(begin,rows,...sorted);
        }
      };
    }
  };
  return sheet;
}
function makeFixture(script=source){
  const sheets=new Map([
    ['1º Bimestre',fakeSheet('1º Bimestre',['Aluno','Equipe','Média'])],
    ['2º Bimestre',fakeSheet('2º Bimestre',['Aluno','Equipe','Média'])],
    ['3º Bimestre',fakeSheet('3º Bimestre',['Aluno','Equipe','Aula 06','Média'])],
    ['4º Bimestre',fakeSheet('4º Bimestre',['Aluno','Equipe','Média'])],
    ['Auditoria',fakeSheet('Auditoria',auditHeaders)]
  ]);
  const properties={},metrics={lock:0,unlock:0,flush:0};
  let counter=0;
  const bytesToSigned=a=>Array.from(a,v=>v>127?v-256:v);
  const Utilities={
    DigestAlgorithm:{SHA_256:'SHA_256'},Charset:{UTF_8:'UTF_8'},
    computeDigest:(_alg,data)=>bytesToSigned(crypto.createHash('sha256').update(data).digest()),
    computeHmacSha256Signature:(data,key)=>bytesToSigned(
      crypto.createHmac('sha256',key).update(data).digest()),
    getUuid:()=> '00000000-0000-4000-8000-'+String(++counter).padStart(12,'0'),
    formatDate:(date)=>new Intl.DateTimeFormat('pt-BR',{
      timeZone:'America/Fortaleza',year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
    }).format(date).replace(', ',' ')
  };
  const sandbox={
    Utilities,
    SpreadsheetApp:{
      openById:()=>({
        getSheetByName:name=>sheets.get(name),
        getName:()=> 'interdisciplinary-project-2026'
      }),
      flush:()=>metrics.flush++
    },
    PropertiesService:{
      getScriptProperties:()=>({
        getProperty:key=>properties[key]||null,
        setProperty:(key,value)=>{properties[key]=value;}
      })
    },
    LockService:{getScriptLock:()=>({
      waitLock:()=>{metrics.lock++;},
      releaseLock:()=>{metrics.unlock++;}
    })},
    ContentService:{createTextOutput:s=>({getContent:()=>s})},
    HtmlService:{createHtmlOutput:s=>({content:s,setTitle(){return this;}})},
    console:{log(){}}
  };
  vm.createContext(sandbox);
  vm.runInContext(script,sandbox,{filename:'Code.gs'});
  return {
    sheets,properties,metrics,app:sandbox,
    grade:()=>sheets.get('3º Bimestre').rows,
    audit:()=>sheets.get('Auditoria').rows,
    submit:(members=['Ana Teste'],campos={},opt={})=>
      sandbox.processDelivery(JSON.stringify(envelope(members,campos,opt))),
    find:(name)=>sheets.get('Auditoria').rows.find(r=>r[0]===name),
    note:(name)=>sheets.get('3º Bimestre').rows.find(r=>r[0]===name)
  };
}
function envelope(members=['Ana Teste'],campos={},opt={}) {
  return {
    schema:opt.schema||'ppi-f02-v1',
    activity:opt.activity||'PPI1-AULA06-2026',
    pdfSha256:opt.pdfSha256||'a'.repeat(64),
    snapshot:{
      schema:opt.snapshotSchema||'ppi-f02-v1',
      identificacao:{
        equipe: opt.team===undefined ? 'Equipe Teste' : opt.team,
        componentes:members,
        projeto:opt.project||'memorias',data:'2026-10-21'
      },
      campos:Object.assign({
        item:'Dado sintético',finalidade:'Testar formulário',
        prob1:'2',impacto1:'3',prob2:'1',impacto2:'2'
      },campos),
      protocolo:[]
    }
  };
}
const fail=(f,p,pattern)=>assert.throws(()=>f.app.processDelivery(JSON.stringify(p)),pattern);
test('01 — esquema e fluxo compatíveis',()=>{
  const f=makeFixture();
  const out=f.submit();
  assert.equal(out.ok,true);
  assert.equal(out.gradeStatus,'pendente');
  assert.equal(f.grade()[1][2],0);
  assert.equal(f.audit()[1][11],'Avaliação pendente');
});
test('02 — grupo: uma linha por estudante em ordem alfabética',()=>{
  const f=makeFixture();
  const o=f.submit(['Zoe Teste','Ana Teste','Bruno Teste']);
  assert.equal(o.ok,true);
  assert.deepEqual(f.grade().slice(1).map(r=>r[0]),['Ana Teste','Bruno Teste','Zoe Teste']);
  assert.equal(f.audit().length,4);
  assert.equal(new Set(f.audit().slice(1).map(r=>r[5])).size,1);
});
test('03 — reenvio substitui o recibo e conserva os colegas',()=>{
  const f=makeFixture();
  f.submit(['Zoe Teste','Ana Teste'],{item:'Primeiro conteúdo'});
  const old=f.find('Ana Teste')[5];
  const next=f.submit(['Ana Teste'],{item:'Resposta revisada'});
  assert.notEqual(next.deliveryId,old);
  assert.equal(f.find('Ana Teste')[5],next.deliveryId);
  assert.equal(f.audit().length,3);
  assert.ok(f.find('Zoe Teste'));
});
test('04 — respostas diferentes produzem hashes diferentes',()=>{
  const f=makeFixture();
  const o=f.submit(['Ana Teste'],{item:'V1'});
  const n=f.submit(['Ana Teste'],{item:'V2'});
  assert.notEqual(o.answersSha256,n.answersSha256);
});
test('05 — mesmo conteúdo mantém digest e recebe novo recibo',()=>{
  const f=makeFixture();
  const a=f.submit();const b=f.submit();
  assert.equal(a.answersSha256,b.answersSha256);
  assert.notEqual(a.deliveryId,b.deliveryId);
});
test('06 — correção formativa parcial não exige preencher toda ficha',()=>{
  const f=makeFixture();
  const result=f.submit(['Ana Teste'],{item:'',finalidade:'',prob1:'',impacto1:'',prob2:'',impacto2:''});
  assert.equal(result.xp,0);
  assert.equal(f.find('Ana Teste')[9],0);
});
test('07 — rubrica completa resulta em 100 XP',()=>{
  const c=Object.fromEntries(rubric.map(k=>[k,'Conteúdo sintético']));
  Object.assign(c,{identifica:'Não identifica pessoa',sensivel:'Não parece envolver dado sensível',
    estrategia:'Sintético',prob1:'1',impacto1:'2',prob2:'3',impacto2:'2'});
  const f=makeFixture();assert.equal(f.submit(['Ana Teste'],c).xp,100);
});
test('08 — não confundir risco (6 e 2) com a nota acadêmica',()=>{
  const f=makeFixture();
  f.submit();
  assert.equal(f.note('Ana Teste')[2],0);
  assert.equal(f.find('Ana Teste')[10],'');
  const campos=JSON.parse(f.find('Ana Teste')[12]).campos;
  assert.equal(campos.score1,6);assert.equal(campos.score2,2);
});
test('09 — média simples com ausência = zero',()=>{
  const f=makeFixture();
  f.submit();
  assert.equal(f.note('Ana Teste')[3],'=SUM(C2:C2)/1');
  assert.equal(f.note('Ana Teste')[2],0);
});
test('10 — outras abas do bimestre permanecem inalteradas',()=>{
  const f=makeFixture();
  const before=[...['1º Bimestre','2º Bimestre','4º Bimestre']].map(x=>JSON.stringify(f.sheets.get(x).rows));
  f.submit();
  assert.deepEqual([...['1º Bimestre','2º Bimestre','4º Bimestre']].map(x=>JSON.stringify(f.sheets.get(x).rows)),before);
});
test('11 — atividade não cadastrada rejeitada',()=>{
  const f=makeFixture();fail(f,envelope(['Ana Teste'],{}, {activity:'DESCONHECIDA'}),/não habilitado/);
});
test('12 — esquema errado rejeitado',()=>{
  const f=makeFixture();fail(f,envelope(['Ana Teste'],{}, {snapshotSchema:'antigo'}),/incompatível/);
});
test('13 — SHA-256 inválido rejeitado',()=>{
  const f=makeFixture();fail(f,envelope(['Ana Teste'],{}, {pdfSha256:'0000'}),/SHA-256/);
});
test('14 — limite de payload aplicado',()=>{
  const f=makeFixture();assert.throws(()=>f.app.processDelivery('a'.repeat(120001)),/limite/);
});
test('15 — projeto desconhecido rejeitado',()=>{
  const f=makeFixture();fail(f,envelope(['Ana Teste'],{}, {project:'outro'}),/Projeto inválido/);
});
test('16 — respostas de alternativas fabricadas rejeitadas',()=>{
  const f=makeFixture();fail(f,envelope(['Ana Teste'],{identifica:'Resposta inventada'}),/Escolha inválida/);
});
test('17 — chance/impacto fora do intervalo rejeitados',()=>{
  const f=makeFixture();fail(f,envelope(['Ana Teste'],{prob1:'4'}),/Valor de risco inválido/);
});
test('18 — nomes duplicados por acento/caixa são rejeitados',()=>{
  const f=makeFixture();
  fail(f,envelope(['Ána Teste','ana teste']),/duplicado/);
  assert.equal(f.audit().length,1);
});
test('19 — entrada contendo fórmula no nome é rejeitada',()=>{
  const f=makeFixture();
  fail(f,envelope(['=IMPORTRANGE(A1)']),/Nome de aluno inválido/);
});
test('20 — equipe com prefixo de fórmula é gravada como texto',()=>{
  const f=makeFixture();
  f.submit(['Ana Teste'],{}, {team:'=SUM(A1:A3)'});
  assert.equal(f.note('Ana Teste')[1],"'=SUM(A1:A3)");
});
test('21 — campos desconhecidos são recusados sem escrita',()=>{
  const f=makeFixture();
  fail(f,envelope(['Ana Teste'],{forjado:'100'}),/não reconhecido/);
  assert.equal(f.audit().length,1);
});
test('22 — suporte a 30 integrantes, ordenação com acentos',()=>{
  const f=makeFixture();
  const names=Array.from({length:30},(_,i)=>'Aluno '+String(i+1).padStart(2,'0'));
  f.submit(names.reverse());
  assert.equal(f.audit().length,31);
  assert.equal(f.grade()[1][0],'Aluno 01');
  assert.equal(f.grade()[30][0],'Aluno 30');
});
test('23 — 31 integrantes são rejeitados',()=>{
  const f=makeFixture();
  const names=Array.from({length:31},(_,i)=>'Aluno '+(i+1));
  fail(f,envelope(names),/integrantes|Quantidade/);
});
test('24 — nome conflitante em outra equipe é recusado',()=>{
  const f=makeFixture();
  f.submit(['Ana Teste'],{}, {team:'Equipe Um'});
  fail(f,envelope(['Ana Teste'],{}, {team:'Equipe Dois'}),/Conflito/);
  assert.equal(f.note('Ana Teste')[1],'Equipe Um');
});
test('25 — colunas futuras podem ser inseridas sem perder notas anteriores',()=>{
  const dual=source.replace(
    "    })\n    // Para outras aulas",
    "    }),\n    'PPI1-AULA07-2026': Object.freeze({sheet:'3º Bimestre',column:'Aula 07',schema:'ppi-f02-v1',rubric:'aula07',gradeMode:'manual'})\n    // Para outras aulas"
  );
  assert.notEqual(dual,source,'ponto de extensão encontrado');
  const f=makeFixture(dual);
  f.submit(['Ana Teste']);
  f.app.processDelivery(JSON.stringify(envelope(['Ana Teste'],{}, {activity:'PPI1-AULA07-2026'})));
  assert.deepEqual(f.grade()[0],['Aluno','Equipe','Aula 06','Aula 07','Média']);
  f.sheets.get('3º Bimestre').getRange(2,4).setValue(8);
  f.submit(['Ana Teste'],{item:'Reenvio na 06'});
  assert.equal(f.note('Ana Teste')[3],8);
  assert.equal(f.note('Ana Teste')[4],'=SUM(C2:D2)/2');
});
test('26 — HMAC vincula a data, atividade, documento, XP e respostas',()=>{
  const f=makeFixture();const out=f.submit(['Ana Teste']);
  const message=JSON.stringify([
    out.deliveryId,out.receivedAt,'PPI1-AULA06-2026',out.pdfSha256,
    out.answersSha256,['ana teste'],out.xp,'aula06-xp-2.0','SEM_NOTA'
  ]);
  const signed=crypto.createHmac('sha256',f.properties.RECEIPT_HMAC_SECRET)
    .update(message).digest('hex');
  assert.equal(out.signature,signed);
  assert.notEqual(out.signature,crypto.createHmac('sha256',f.properties.RECEIPT_HMAC_SECRET)
    .update(message+'alterado').digest('hex'));
});
test('27 — chave secreta não aparece na resposta',()=>{
  const f=makeFixture();const out=f.submit();
  assert.ok(f.properties.RECEIPT_HMAC_SECRET);
  assert.ok(!JSON.stringify(out).includes(f.properties.RECEIPT_HMAC_SECRET));
});
test('28 — lock sempre é liberado após escrita',()=>{
  const f=makeFixture();f.submit();
  assert.equal(f.metrics.lock,1);
  assert.equal(f.metrics.unlock,1);
});
test('29 — falha de gravação NÃO retorna sucesso e solta lock',()=>{
  const f=makeFixture();
  f.sheets.get('Auditoria').failOnWrite=true;
  assert.throws(()=>f.submit(),/Falha de escrita simulada/);
  assert.equal(f.metrics.lock,f.metrics.unlock);
});
test('30 — cabeçalho de auditoria divergente impede submissão',()=>{
  const f=makeFixture();
  f.sheets.get('Auditoria').rows[0][2]='Bimestre';
  assert.throws(()=>f.submit(),/Cabeçalhos incompatíveis/);
});
test('31 — novos envios não apagaram notas de outras atividades',()=>{
  const f=makeFixture();
  f.sheets.get('3º Bimestre').rows[0]=['Aluno','Equipe','Aula 06','Aula 08','Média'];
  f.sheets.get('3º Bimestre').rows.push(['Ana Teste','Equipe Teste',7,9,'=SUM(C2:D2)/2']);
  f.submit(['Ana Teste']);
  assert.equal(f.note('Ana Teste')[2],0);
  assert.equal(f.note('Ana Teste')[3],9);
  assert.equal(f.note('Ana Teste')[4],'=SUM(C2:D2)/2');
});
test('32 — endpoints GET e POST não expõem informações pessoais',()=>{
  const f=makeFixture();const out=f.app.doGet().getContent();
  assert.match(out,/endpoint de entrega ativo/);
  assert.ok(!out.includes('1aziGb'));
  const body=f.app.doPost({parameter:{nonce:'testar',payload:JSON.stringify(envelope())}});
  assert.match(body.content,/ppi-entrega-aula06/);
  assert.ok(!body.content.includes('Equipe Teste'));
});
test('33 — PDF real tem header, EOF e SHA-256 verificável',()=>{
  const window={};
  const sandbox={window,TextEncoder};
  vm.createContext(sandbox);
  vm.runInContext(pdfCode,sandbox,{filename:'atividade-pdf.js'});
  const document={
    title:'Protocolo Ético e Matriz de Riscos',institution:'IFMA',
    course:'Técnico em Informática',discipline:'PPI I',
    lesson:'Aula 06',professor:'Professor',team:'Equipe Teste',
    members:['Ana Teste'],project:'Mapa de Memórias Quilombolas',
    date:'21/10/2026',version:'2.0',
    scoring:{earned:24,max:100,pending:20,answered:6,total:26},
    sections:[{title:'Informação planejada',items:[
      ['Dado','Dados sintéticos'],['Finalidade','Verificação de integridade']]}]
  };
  const pdf=window.PpiPdf.generate(document);
  const digest=sha(Buffer.from(pdf));
  assert.equal(Buffer.from(pdf).subarray(0,8).toString('latin1'),'%PDF-1.4');
  assert.match(Buffer.from(pdf).subarray(-12).toString('latin1'),/%%EOF/);
  assert.match(digest,/^[a-f0-9]{64}$/);
  const other=Uint8Array.from(pdf);other[20]^=1;
  assert.notEqual(digest,sha(Buffer.from(other)));
  const f=makeFixture();const receipt=f.submit(['Ana Teste'],{}, {pdfSha256:digest});
  assert.equal(f.find('Ana Teste')[6],digest);
  assert.equal(receipt.pdfSha256,digest);
});
