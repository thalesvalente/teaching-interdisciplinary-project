
/* Gerador local de PDF 1.4 para a ficha PPI 2.6.0.
   Documento vetorial A4, sem captura de tela, fontes externas, rede ou execução de conteúdo do usuário. */
(() => {
  "use strict";
  const WIDTHS={"R":[250,333,408,500,500,833,778,180,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541,350,500,350,333,500,444,1000,500,500,333,1000,556,333,889,350,611,350,350,333,333,444,444,350,500,1000,333,980,389,333,722,350,444,722,250,333,500,500,500,500,200,500,333,760,276,500,564,333,760,333,400,564,300,300,333,500,453,250,333,300,310,500,750,750,750,444,722,722,722,722,722,722,889,667,611,611,611,611,333,333,333,333,722,722,722,722,722,722,722,564,722,722,722,722,722,722,556,500,444,444,444,444,444,444,667,444,444,444,444,444,278,278,278,278,500,500,500,500,500,500,500,564,500,500,500,500,500,500,500,500],"B":[250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,778,389,500,778,667,944,722,778,611,778,722,556,667,722,722,1000,722,722,667,333,278,333,581,500,333,500,556,444,556,444,333,500,556,278,333,556,278,833,556,500,556,556,444,389,333,556,500,722,500,500,444,394,220,394,520,350,500,350,333,500,500,1000,500,500,333,1000,556,333,1000,350,667,350,350,333,333,500,500,350,500,1000,333,1000,389,333,722,350,444,722,250,333,500,500,500,500,220,500,333,747,300,500,570,333,747,333,400,570,300,300,333,556,540,250,333,300,330,500,750,750,750,500,722,722,722,722,722,722,1000,722,667,667,667,667,389,389,389,389,722,722,778,778,778,778,778,570,778,722,722,722,722,722,611,556,500,500,500,500,500,500,722,444,444,444,444,444,278,278,278,278,500,556,500,500,500,500,500,570,500,556,556,556,556,500,556,500]};
  const SPECIAL={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};
  const ENCODE=new Map(Object.entries(SPECIAL).map(([b,u])=>[String.fromCodePoint(u),Number(b)]));
  const W=595.276,H=841.890,M=70.866,RIGHT=W-M,BOTTOM=H-M;
  const GREEN='0 0.4196 0.2353',GREEN_DARK='0 0.2902 0.1647',PALE='0.929 0.961 0.941',RED='0.843 0.098 0.125',INK='0.10 0.14 0.11',MUTED='0.34 0.42 0.37',WHITE='1 1 1',LINE='0.72 0.79 0.74';
  const num=x=>Number(x.toFixed(3)).toString();
  function clean(text){return String(text??'').normalize('NFC').replace(/\r\n?/g,'\n').replace(/\t/g,'    ');}
  function byte(ch){const c=ch.codePointAt(0);if((c>=32&&c<=126)||(c>=160&&c<=255))return c;if(ENCODE.has(ch))return ENCODE.get(ch);throw Error('O caractere “'+ch+'” não está disponível na fonte do PDF direto. Use “Ver versão de impressão” para preservar esse texto, ou revise o símbolo.');}
  function hex(s){return '<'+[...s].map(c=>byte(c).toString(16).padStart(2,'0')).join('')+'>';}
  function width(s,size=12,font='R'){return [...s].reduce((a,c)=>a+WIDTHS[font][byte(c)-32],0)*size/1000;}
  function wrap(text,size,font,max){const words=clean(text).trim().split(/\s+/).filter(Boolean),lines=[];let line='';for(const word of words){if(width(word,size,font)>max){if(line){lines.push(line);line='';}let chunk='';for(const ch of word){if(chunk&&width(chunk+ch,size,font)>max){lines.push(chunk);chunk='';}chunk+=ch;}line=chunk;continue;}const next=line?line+' '+word:word;if(width(next,size,font)>max){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
  function unicodeMap(){const pairs=[];for(let b=32;b<=255;b++){const u=SPECIAL[b]??b;if(b>=127&&b<160&&!SPECIAL[b])continue;pairs.push('<'+b.toString(16).padStart(2,'0')+'> <'+u.toString(16).padStart(4,'0')+'>');}let s='/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /PPI-WinAnsi-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00> <FF>\nendcodespacerange\n';for(let i=0;i<pairs.length;i+=90){const c=pairs.slice(i,i+90);s+=c.length+' beginbfchar\n'+c.join('\n')+'\nendbfchar\n';}return s+'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';}

  function generate(model){
    function check(v){if(typeof v==='string'){for(const ch of clean(v))if(ch!=='\n')byte(ch);}else if(Array.isArray(v))v.forEach(check);else if(v&&typeof v==='object')Object.values(v).forEach(check);}check(model);
    const pages=[];let commands=[],y=M;
    function text(s,x,baseline,size=12,font='R',spacing=0,color=INK){commands.push('BT /'+font+' '+num(size)+' Tf '+color+' rg '+num(spacing)+' Tw 1 0 0 1 '+num(x)+' '+num(H-baseline)+' Tm '+hex(s)+' Tj ET');}
    function fillRect(x,top,w,h,color){commands.push(color+' rg '+num(x)+' '+num(H-top-h)+' '+num(w)+' '+num(h)+' re f');}
    function strokeRect(x,top,w,h,color=LINE,weight=.7){commands.push(color+' RG '+num(weight)+' w '+num(x)+' '+num(H-top-h)+' '+num(w)+' '+num(h)+' re S');}
    function line(x1,top1,x2,top2,color=LINE,weight=.7){commands.push(color+' RG '+num(weight)+' w '+num(x1)+' '+num(H-top1)+' m '+num(x2)+' '+num(H-top2)+' l S');}
    function pushPage(){if(commands.length)pages.push(commands);commands=[];}
    function pageHeader(){fillRect(0,0,W,7,GREEN);text('PPI I · AULA 05 · REGISTRO DO CAMINHO DA INFORMAÇÃO',M,31,8.8,'B',0,GREEN_DARK);text('IFMA',RIGHT-width('IFMA',9,'B'),31,9,'B',0,GREEN);line(M,40,RIGHT,40,LINE,.6);y=55;}
    function newBodyPage(){pushPage();pageHeader();}
    function ensure(space){if(y+space>BOTTOM-18)newBodyPage();}
    function paragraph(value,{font='R',size=11.4,justify=true,gap=6,center=false,color=INK,max=RIGHT-M,x=M}={}){const paras=clean(value||'[Não preenchido]').split('\n');for(const raw of paras){if(!raw.trim()){y+=size*.6;continue;}const lines=wrap(raw,size,font,max),leading=size*1.52;ensure(leading*Math.min(2,lines.length)+gap);for(let i=0;i<lines.length;i++){ensure(leading);const s=lines[i],spaces=(s.match(/ /g)||[]).length;const spread=justify&&!center&&i<lines.length-1&&spaces>0?Math.max(0,(max-width(s,size,font))/spaces):0;const tx=center?x+(max-width(s,size,font))/2:x;text(s,tx,y+size,size,font,spread,color);y+=leading;}y+=gap;}}
    function coverField(label,value,top){text(label.toUpperCase(),M+26,top,8.5,'B',0,MUTED);const lines=wrap(value,11.2,'R',RIGHT-(M+135));let yy=top;for(const s of lines.slice(0,4)){text(s,M+135,yy,11.2,'R',0,INK);yy+=15.5;}return Math.max(top+20,yy+2);}
    function sectionHeading(s){const lines=wrap(s,13.2,'B',RIGHT-M-20),h=Math.max(27,lines.length*17+8);ensure(h+22);fillRect(M,y,RIGHT-M,h,PALE);fillRect(M,y,4,h,RED);let yy=y+18;for(const l of lines){text(l,M+13,yy,13.2,'B',0,GREEN_DARK);yy+=17;}y+=h+10;}
    function field(label,value){const labelLines=wrap(label,10.6,'B',RIGHT-M);ensure(labelLines.length*14+35);for(const l of labelLines){text(l,M,y+10.6,10.6,'B',0,GREEN_DARK);y+=14;}y+=1;paragraph(value,{size:11.4,justify:true,gap:7});}

    // Capa formal
    fillRect(0,0,W,48,GREEN);text('INSTITUTO FEDERAL DO MARANHÃO',M,31,10,'B',0,WHITE);text('CAMPUS ITAPECURU-MIRIM',RIGHT-width('CAMPUS ITAPECURU-MIRIM',9,'B'),31,9,'B',0,WHITE);
    fillRect(M,112,6,118,RED);text('REGISTRO DO',M+22,132,23,'B',0,GREEN_DARK);text('CAMINHO DA INFORMAÇÃO',M+22,161,23,'B',0,GREEN_DARK);text('Prática Profissional Integrada I · Aula 05',M+22,191,12,'R',0,MUTED);
    fillRect(M+22,220,RIGHT-M-22,74,PALE);text('PROJETO ANALISADO',M+37,242,8.5,'B',0,MUTED);const projectLines=wrap(model.project,14,'B',RIGHT-M-52);let py=265;for(const l of projectLines.slice(0,2)){text(l,M+37,py,14,'B',0,GREEN_DARK);py+=18;}
    let cy=328;cy=coverField('Professor',model.professor,cy);cy=coverField('Equipe',model.team,cy);cy=coverField('Componentes',model.members.join('; ')||'[A preencher]',cy);cy=coverField('Data da atividade',model.date,cy);
    text('CONTROLE DO DOCUMENTO',M+22,525,10.5,'B',0,GREEN_DARK);line(M+22,533,RIGHT,533,GREEN,.8);let ty=554;ty=coverField('Versão',model.version||'1.0',ty);ty=coverField('Responsáveis',model.members.join('; ')||model.team,ty);ty=coverField('Finalidade','Registro acadêmico da atividade de fluxo de informação.',ty);
    text('Documento gerado localmente no navegador. As respostas usam uma situação de análise associada ao projeto.',M+22,735,8.8,'R',0,MUTED);pushPage();

    // Corpo do documento
    pageHeader();sectionHeading('Identificação do documento');
    for(const [l,t] of [['Instituição',model.institution],['Curso',model.course],['Disciplina',model.discipline],['Aula',model.lesson],['Professor',model.professor],['Equipe',model.team],['Componentes',model.members.join('; ')||'[A preencher]'],['Projeto analisado',model.project],['Data da atividade',model.date]])field(l,t);
    sectionHeading('Controle do documento');field('Versão',model.version||'1.0');field('Responsáveis',model.members.join('; ')||model.team);field('Descrição da versão','Registro de fluxo de informação produzido na Aula 05.');
    ensure(60);fillRect(M,y,RIGHT-M,50,'0.996 0.956 0.956');fillRect(M,y,4,50,RED);const note='As respostas abaixo se apoiam em uma situação de análise ligada ao projeto. O documento registra o raciocínio da equipe e não transforma hipóteses em fatos.';const nlines=wrap(note,10.5,'R',RIGHT-M-22);let ny=y+15;for(const l of nlines){text(l,M+13,ny,10.5,'R',0,INK);ny+=14;}y+=58;
    for(const section of model.sections){sectionHeading(section.title);for(const [label,value] of section.items)field(label,value);}
    pushPage();

    // Rodapés após conhecer o total de páginas
    const generated=new Date().toLocaleDateString('pt-BR');
    for(let i=0;i<pages.length;i++){const p=pages[i];commands=p;line(M,H-43,RIGHT,H-43,LINE,.55);const left='PPI I · Aula 05 · IFMA Itapecuru-Mirim';text(left,M,H-27,8.3,'R',0,MUTED);const mid='v'+(model.version||'1.0')+' · '+generated;text(mid,M+(RIGHT-M-width(mid,8.3,'R'))/2,H-27,8.3,'R',0,MUTED);const pg='Página '+(i+1)+' de '+pages.length;text(pg,RIGHT-width(pg,8.3,'R'),H-27,8.3,'R',0,MUTED);}

    const objects=[null,'<< /Type /Catalog /Pages 2 0 R /Lang (pt-BR) >>','',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding /ToUnicode 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding /ToUnicode 5 0 R >>'];
    const cmap=unicodeMap();objects.push('<< /Length '+cmap.length+' >>\nstream\n'+cmap+'\nendstream');
    const refs=[];for(const p of pages){const pid=objects.length,cid=pid+1,stream=p.join('\n');refs.push(pid+' 0 R');objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents '+cid+' 0 R >>');objects.push('<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream');}
    objects[2]='<< /Type /Pages /Kids ['+refs.join(' ')+'] /Count '+pages.length+' >>';const info=objects.length;objects.push('<< /Title '+hex(model.title)+' /Creator (PPI I - Ficha 2.2.0) /Producer (Gerador local PPI) >>');
    let pdf='%PDF-1.4\n',offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}const xref=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R /Info '+info+' 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';return new TextEncoder().encode(pdf);
  }
  window.PpiPdf=Object.freeze({generate,version:'2.1.0'});
})();

  