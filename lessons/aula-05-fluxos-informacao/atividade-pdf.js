/* Gerador local de PDF 1.4 para a ficha PPI. Texto vetorial, sem captura de tela, fontes externas, rede ou execução de conteúdo do usuário.
   Fontes padrão Times-Roman/Times-Bold; métricas de avanço em unidades de 1/1000 em. */
(() => {
  "use strict";
  const WIDTHS = {"R":[250,333,408,500,500,833,778,180,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541,350,500,350,333,500,444,1000,500,500,333,1000,556,333,889,350,611,350,350,333,333,444,444,350,500,1000,333,980,389,333,722,350,444,722,250,333,500,500,500,500,200,500,333,760,276,500,564,333,760,333,400,564,300,300,333,500,453,250,333,300,310,500,750,750,750,444,722,722,722,722,722,722,889,667,611,611,611,611,333,333,333,333,722,722,722,722,722,722,722,564,722,722,722,722,722,722,556,500,444,444,444,444,444,444,667,444,444,444,444,444,278,278,278,278,500,500,500,500,500,500,500,564,500,500,500,500,500,500,500,500],"B":[250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,778,389,500,778,667,944,722,778,611,778,722,556,667,722,722,1000,722,722,667,333,278,333,581,500,333,500,556,444,556,444,333,500,556,278,333,556,278,833,556,500,556,556,444,389,333,556,500,722,500,500,444,394,220,394,520,350,500,350,333,500,500,1000,500,500,333,1000,556,333,1000,350,667,350,350,333,333,500,500,350,500,1000,333,1000,389,333,722,350,444,722,250,333,500,500,500,500,220,500,333,747,300,500,570,333,747,333,400,570,300,300,333,556,540,250,333,300,330,500,750,750,750,500,722,722,722,722,722,722,1000,722,667,667,667,667,389,389,389,389,722,722,778,778,778,778,778,570,778,722,722,722,722,722,611,556,500,500,500,500,500,500,722,444,444,444,444,444,278,278,278,278,500,556,500,500,500,500,500,570,500,556,556,556,556,500,556,500]};
  const SPECIAL = {128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};
  const ENCODE = new Map(Object.entries(SPECIAL).map(([b,u])=>[String.fromCodePoint(u),Number(b)]));
  const W=595.276,H=841.890,M=70.866,RIGHT=W-M,BOTTOM=H-M;
  const num = x => Number(x.toFixed(3)).toString();
  function clean(text){return String(text??'').normalize('NFC').replace(/\r\n?/g,'\n').replace(/\t/g,'    ');}
  function byte(ch){const c=ch.codePointAt(0);if(c>=32&&c<=126||c>=160&&c<=255)return c;if(ENCODE.has(ch))return ENCODE.get(ch);throw Error('O caractere “'+ch+'” não está disponível na fonte do PDF direto. Use “Ver documento para impressão” para preservar esse texto, ou revise o símbolo antes de gerar.');}
  function hex(s){return '<'+[...s].map(c=>byte(c).toString(16).padStart(2,'0')).join('')+'>';}
  function width(s,size=12,font='R'){return [...s].reduce((a,c)=>a+WIDTHS[font][byte(c)-32],0)*size/1000;}
  function wrap(text,size,font,max){
    const words=text.trim().split(/\s+/).filter(Boolean),lines=[];let line='';
    for(const word of words){
      if(width(word,size,font)>max){if(line){lines.push(line);line='';}let chunk='';for(const ch of word){if(chunk&&width(chunk+ch,size,font)>max){lines.push(chunk);chunk='';}chunk+=ch;}line=chunk;continue;}
      const next=line?line+' '+word:word;if(width(next,size,font)>max){lines.push(line);line=word;}else line=next;
    }
    if(line)lines.push(line);return lines;
  }
  function unicodeMap(){const pairs=[];for(let b=32;b<=255;b++){const u=SPECIAL[b]??b;if(b>=127&&b<160&&!SPECIAL[b])continue;pairs.push('<'+b.toString(16).padStart(2,'0')+'> <'+u.toString(16).padStart(4,'0')+'>');}let s='/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /PPI-WinAnsi-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00> <FF>\nendcodespacerange\n';for(let i=0;i<pairs.length;i+=90){const chunk=pairs.slice(i,i+90);s+=chunk.length+' beginbfchar\n'+chunk.join('\n')+'\nendbfchar\n';}return s+'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';}
  function generate(model){
    // Validate every string first: never drop unsupported characters or silently alter names.
    function check(v){if(typeof v==='string'){for(const ch of clean(v))if(ch!=='\n')byte(ch);}else if(Array.isArray(v))v.forEach(check);else if(v&&typeof v==='object')Object.values(v).forEach(check);}
    check(model);
    const pages=[];let commands=[],y=M;
    function text(s,x,baseline,size=12,font='R',spacing=0,color='0.08 0.08 0.08'){
      commands.push('BT /'+font+' '+num(size)+' Tf '+color+' rg '+num(spacing)+' Tw 1 0 0 1 '+num(x)+' '+num(H-baseline)+' Tm '+hex(s)+' Tj ET');
    }
    function rule(top){commands.push('0.65 0.72 0.67 RG 0.5 w '+num(M)+' '+num(H-top)+' m '+num(RIGHT)+' '+num(H-top)+' l S');}
    function newPage(){if(commands.length)pages.push(commands);commands=[];y=M;text('PPI I · Aula 05 · Registro do caminho da informação',M,43,9,'R',0,'0.3 0.35 0.32');rule(52);}
    function ensure(space){if(y+space>BOTTOM)newPage();}
    function paragraph(value,{font='R',size=12,justify=true,gap=7,center=false}={}){
      const paras=clean(value||'[Não preenchido]').split('\n');
      for(const raw of paras){if(!raw.trim()){y+=size*.6;continue;}const lines=wrap(raw,size,font,RIGHT-M),leading=size*1.5;
        // Keep a two-line start when the paragraph spans several lines.
        ensure(leading*Math.min(2,lines.length));
        for(let i=0;i<lines.length;i++){
          ensure(leading);const s=lines[i],spaces=(s.match(/ /g)||[]).length;
          const spread=justify&&!center&&i<lines.length-1&&spaces>0?Math.max(0,(RIGHT-M-width(s,size,font))/spaces):0;
          const x=center?M+(RIGHT-M-width(s,size,font))/2:M;
          text(s,x,y+size,size,font,spread);y+=leading;
        }
        y+=gap;
      }
    }
    function heading(s){const lines=wrap(s,14,'B',RIGHT-M);ensure(lines.length*21+54);y+=9;paragraph(s,{font:'B',size:14,justify:false,gap:7});}
    function field(label,value){const ll=wrap(label,12,'B',RIGHT-M);ensure(ll.length*18+36);paragraph(label,{font:'B',justify:false,gap:1});paragraph(value);}
    newPage();
    paragraph('INSTITUTO FEDERAL DO MARANHÃO',{font:'B',size:14,center:true,justify:false,gap:0});
    paragraph('Campus Itapecuru-Mirim',{size:12,center:true,justify:false,gap:10});
    paragraph(model.title,{font:'B',size:17,center:true,justify:false,gap:10});
    for(const [l,t]of [['Curso',model.course],['Disciplina',model.discipline],['Aula','05 — Seguir a informação'],['Professor',model.professor],['Equipe',model.team],['Projeto / eixo',model.project],['Data da atividade',model.date],['Caso de treino',model.caseTitle]])paragraph(l+': '+t,{size:11,justify:false,gap:3});
    ensure(40);paragraph('Componentes da equipe',{font:'B',size:12,justify:false,gap:3});
    (model.members.length?model.members:['[A preencher]']).forEach((n,i)=>paragraph((i+1)+'. '+n,{size:12,justify:false,gap:0}));
    y+=7;paragraph('Respostas da equipe sobre um caso fictício. Documento gerado no dispositivo; não constitui envio da atividade.',{size:10,justify:false,gap:8});
    for(const section of model.sections){heading(section.title);for(const [label,value]of section.items)field(label,value);}
    if(commands.length)pages.push(commands);
    const generated=new Date().toLocaleDateString('pt-BR');
    // Add footers after pagination so that every page has the correct total.
    for(let i=0;i<pages.length;i++){commands=pages[i];rule(H-48);text('PPI I · IFMA Itapecuru-Mirim · Gerado em '+generated,M,H-33,9,'R',0,'0.3 0.35 0.32');const p='Página '+(i+1)+' de '+pages.length;text(p,RIGHT-width(p,9),H-33,9,'R',0,'0.3 0.35 0.32');}
    // All PDF syntax is ASCII; user text is encoded in hexadecimal string operands.
    const objects=[null,'<< /Type /Catalog /Pages 2 0 R /Lang (pt-BR) >>','',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding /ToUnicode 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding /ToUnicode 5 0 R >>'];
    const cmap=unicodeMap();objects.push('<< /Length '+cmap.length+' >>\nstream\n'+cmap+'\nendstream');
    const refs=[];
    for(const p of pages){const pid=objects.length,cid=pid+1,stream=p.join('\n');refs.push(pid+' 0 R');objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents '+cid+' 0 R >>');objects.push('<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream');}
    objects[2]='<< /Type /Pages /Kids ['+refs.join(' ')+'] /Count '+pages.length+' >>';
    const info=objects.length;objects.push('<< /Title '+hex(model.title)+' /Creator (PPI I - Ficha 2.0.0) /Producer (Gerador local PPI) >>');
    let pdf='%PDF-1.4\n',offsets=[0];
    for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}
    const xref=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R /Info '+info+' 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';
    return new TextEncoder().encode(pdf);
  }
  window.PpiPdf=Object.freeze({generate,version:'2.0.0'});
})();
