
/* Gerador local de PDF 1.4 para a Aula 06 e da ficha da equipe, versão 2.0.0.
   Documento vetorial A4, sem captura de tela, fontes externas, rede ou execução de conteúdo do usuário. */
(() => {
  "use strict";
  const WIDTHS={"R":[250,333,408,500,500,833,778,180,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541,350,500,350,333,500,444,1000,500,500,333,1000,556,333,889,350,611,350,350,333,333,444,444,350,500,1000,333,980,389,333,722,350,444,722,250,333,500,500,500,500,200,500,333,760,276,500,564,333,760,333,400,564,300,300,333,500,453,250,333,300,310,500,750,750,750,444,722,722,722,722,722,722,889,667,611,611,611,611,333,333,333,333,722,722,722,722,722,722,722,564,722,722,722,722,722,722,556,500,444,444,444,444,444,444,667,444,444,444,444,444,278,278,278,278,500,500,500,500,500,500,500,564,500,500,500,500,500,500,500,500],"B":[250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,778,389,500,778,667,944,722,778,611,778,722,556,667,722,722,1000,722,722,667,333,278,333,581,500,333,500,556,444,556,444,333,500,556,278,333,556,278,833,556,500,556,556,444,389,333,556,500,722,500,500,444,394,220,394,520,350,500,350,333,500,500,1000,500,500,333,1000,556,333,1000,350,667,350,350,333,333,500,500,350,500,1000,333,1000,389,333,722,350,444,722,250,333,500,500,500,500,220,500,333,747,300,500,570,333,747,333,400,570,300,300,333,556,540,250,333,300,330,500,750,750,750,500,722,722,722,722,722,722,1000,722,667,667,667,667,389,389,389,389,722,722,778,778,778,778,778,570,778,722,722,722,722,722,611,556,500,500,500,500,500,500,722,444,444,444,444,444,278,278,278,278,500,556,500,500,500,500,500,570,500,556,556,556,556,500,556,500]};
  const SPECIAL={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};
  const ENCODE=new Map(Object.entries(SPECIAL).map(([b,u])=>[String.fromCodePoint(u),Number(b)]));
  const W=595.276,H=841.890,M=48,RIGHT=W-M,BOTTOM=H-60;
  const GREEN='0 0.4196 0.2353',GREEN_DARK='0 0.2902 0.1647',PALE='0.929 0.961 0.941',RED='0.843 0.098 0.125',INK='0.10 0.14 0.11',MUTED='0.34 0.42 0.37',WHITE='1 1 1',LINE='0.72 0.79 0.74';
  const num=x=>Number(x.toFixed(3)).toString();
  function clean(text){return String(text??'').normalize('NFC').replace(/\r\n?/g,'\n').replace(/\t/g,'    ');}
  function byte(ch){const c=ch.codePointAt(0);if((c>=32&&c<=126)||(c>=160&&c<=255))return c;if(ENCODE.has(ch))return ENCODE.get(ch);throw Error('O caractere “'+ch+'” não está disponível na fonte do PDF direto. Use “Ver versão de impressão” para preservar esse texto, ou revise o símbolo.');}
  function hex(s){return '<'+[...s].map(c=>byte(c).toString(16).padStart(2,'0')).join('')+'>';}
  function width(s,size=12,font='R'){return [...s].reduce((a,c)=>a+WIDTHS[font][byte(c)-32],0)*size/1000;}
  function wrap(text,size,font,max){const words=clean(text).trim().split(/\s+/).filter(Boolean),lines=[];let line='';for(const word of words){if(width(word,size,font)>max){if(line){lines.push(line);line='';}let chunk='';for(const ch of word){if(chunk&&width(chunk+ch,size,font)>max){lines.push(chunk);chunk='';}chunk+=ch;}line=chunk;continue;}const next=line?line+' '+word:word;if(width(next,size,font)>max){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
  function unicodeMap(){const pairs=[];for(let b=32;b<=255;b++){const u=SPECIAL[b]??b;if(b>=127&&b<160&&!SPECIAL[b])continue;pairs.push('<'+b.toString(16).padStart(2,'0')+'> <'+u.toString(16).padStart(4,'0')+'>');}let s='/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /PPI-WinAnsi-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00> <FF>\nendcodespacerange\n';for(let i=0;i<pairs.length;i+=90){const c=pairs.slice(i,i+90);s+=c.length+' beginbfchar\n'+c.join('\n')+'\nendbfchar\n';}return s+'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';}

  function generate(model) {
    // A pontuação é um retrato do modelo atual, nunca uma nota recalculada sobre
    // apenas as respostas presentes. A interface é responsável pela rubrica.
    if (!model || !Array.isArray(model.sections) || !Array.isArray(model.members)) {
      throw Error('O documento não contém uma estrutura válida.');
    }
    const scoring = model.scoring;
    if (scoring) {
      const keys = ['earned', 'max', 'answered', 'total', 'pending'];
      if (keys.some(k => !Number.isFinite(scoring[k]) || scoring[k] < 0) ||
          scoring.max <= 0 || scoring.earned > scoring.max ||
          scoring.answered + scoring.pending !== scoring.total) {
        throw Error('A pontuação precisa ser recalculada antes da exportação.');
      }
    }
    function check(value) {
      if (typeof value === 'string') {
        for (const ch of clean(value)) if (ch !== '\n') byte(ch);
      } else if (Array.isArray(value)) value.forEach(check);
      else if (value && typeof value === 'object') Object.values(value).forEach(check);
    }
    check(model);
    const pages = [];
    let commands = [], y = M;
    function text(value, x, baseline, size = 11.4, font = 'R', color = INK) {
      commands.push('BT /' + font + ' ' + num(size) + ' Tf ' + color +
        ' rg 0 Tw 1 0 0 1 ' + num(x) + ' ' + num(H - baseline) +
        ' Tm ' + hex(value) + ' Tj ET');
    }
    function fillRect(x, top, w, h, color) {
      commands.push(color + ' rg ' + num(x) + ' ' + num(H - top - h) +
        ' ' + num(w) + ' ' + num(h) + ' re f');
    }
    function line(x1, top1, x2, top2, color = LINE, weight = .6) {
      commands.push(color + ' RG ' + num(weight) + ' w ' + num(x1) + ' ' +
        num(H - top1) + ' m ' + num(x2) + ' ' + num(H - top2) + ' l S');
    }
    function pushPage() {
      if (commands.length) pages.push(commands);
      commands = [];
    }
    function pageHeader() {
      fillRect(0, 0, W, 7, GREEN);
      text('PPI I · AULA 06 · ÉTICA E PROTEÇÃO DE DADOS', M, 31, 8.8, 'B', GREEN_DARK);
      text('IFMA', RIGHT - width('IFMA', 9, 'B'), 31, 9, 'B', GREEN);
      line(M, 40, RIGHT, 40);
      y = 56;
    }
    function newPage() { pushPage(); pageHeader(); }
    function ensure(space) { if (y + space > BOTTOM) newPage(); }
    function paragraph(value, {font = 'R', size = 11.4, gap = 6, color = INK,
      max = RIGHT - M, x = M} = {}) {
      const content = clean(value || '[Não respondido]');
      for (const raw of content.split('\n')) {
        if (!raw.trim()) { ensure(size); y += size * .65; continue; }
        const lines = wrap(raw, size, font, max), leading = size * 1.45;
        ensure(leading * Math.min(2, lines.length));
        for (const currentLine of lines) {
          ensure(leading);
          text(currentLine, x, y + size, size, font, color);
          y += leading;
        }
        y += gap;
      }
    }
    function sectionHeading(value) {
      const lines = wrap(value, 13, 'B', RIGHT - M - 24);
      const h = lines.length * 17 + 12;
      ensure(h + 43);
      fillRect(M, y, RIGHT - M, h, PALE);
      fillRect(M, y, 4, h, RED);
      lines.forEach((v, i) => text(v, M + 13, y + 18 + 17 * i, 13, 'B', GREEN_DARK));
      y += h + 10;
    }
    function field(label, value) {
      const lines = wrap(label, 10.6, 'B', RIGHT - M);
      ensure(lines.length * 14 + 34);
      for (const v of lines) { text(v, M, y + 10.6, 10.6, 'B', GREEN_DARK); y += 14; }
      y += 2;
      paragraph(value);
    }
    pageHeader();
    paragraph(model.title || 'Registro da Aula 06', {size: 23, font: 'B', color: GREEN_DARK, gap: 8});
    paragraph(model.lesson || 'Aula 06 · Ética e Proteção de Dados', {size: 12, color: MUTED});
    paragraph('IFMA Campus Itapecuru-Mirim · Prática Profissional Integrada I', {size: 10, color: MUTED, gap: 12});
    if (scoring) {
      const label = scoring.label || 'Pontuação atual';
      const labelLines = wrap(label, 10, 'B', RIGHT - M - 30);
      const statusLines = wrap((scoring.status || 'Em andamento') + ' · ' +
        scoring.answered + ' de ' + scoring.total + ' respostas registradas · ' +
        scoring.pending + ' pendentes', 10.5, 'R', RIGHT - M - 30);
      const boxH = 72 + labelLines.length * 14 + statusLines.length * 15;
      ensure(boxH + 25);
      fillRect(M, y, RIGHT - M, boxH, PALE);
      fillRect(M, y, 5, boxH, GREEN);
      let top = y + 20;
      for (const v of labelLines) { text(v, M + 16, top, 10, 'B', GREEN_DARK); top += 14; }
      text(scoring.earned + ' / ' + scoring.max + ' XP', M + 16, top + 28, 26, 'B', GREEN_DARK);
      text('Nota: '+(scoring.earned/10).toFixed(1).replace('.',',')+' / 10', RIGHT - 170, top + 25, 13, 'B', GREEN_DARK);
      top += 48;
      for (const v of statusLines) { text(v, M + 16, top, 10.5, 'R', INK); top += 15; }
      y += boxH + 10;
      paragraph(scoring.description || 'A pontuação registra somente o progresso atual desta atividade.', {size: 10.4, color: MUTED});
      paragraph('Respostas pendentes valem zero. O máximo permanece ' + scoring.max +
        ' XP; exportar não completa respostas nem concede pontos.', {size: 10.4, color: MUTED, gap: 12});
    }
    sectionHeading('Identificação da atividade');
    for (const [label, value] of [
      ['Equipe', model.team], ['Integrantes (identificação informada)', model.members.join('; ')],
      ['Projeto ou atividade', model.project], ['Data da atividade', model.date],
      ['Professor', model.professor], ['Curso', model.course], ['Disciplina', model.discipline]
    ]) field(label, value || '[Não informado]');
    paragraph('Documento didático de planejamento e aprendizagem. A nota da atividade é XP / 10 e avalia preenchimento, não correção conceitual, autorização institucional ou parecer jurídico.',
      {size: 10.4, color: MUTED, gap: 12});
    if (scoring && Array.isArray(scoring.missions) && scoring.missions.length) {
      sectionHeading('Pontuação por missão');
      for (const mission of scoring.missions) {
        field(mission.label, mission.earned + ' / ' + mission.max + ' XP · ' + mission.status);
      }
    }
    for (const section of model.sections) {
      sectionHeading(section.title);
      for (const [label, value] of section.items) field(label, value);
    }
    pushPage();
    const generated = new Date().toLocaleDateString('pt-BR');
    for (let i = 0; i < pages.length; i++) {
      commands = pages[i];
      line(M, H - 43, RIGHT, H - 43);
      text('PPI I · Aula 06 · IFMA Itapecuru-Mirim', M, H - 27, 8.1, 'R', MUTED);
      const version = 'v' + (model.version || '2.0') + ' · ' + generated;
      text(version, M + (RIGHT - M - width(version, 8.1)) / 2, H - 27, 8.1, 'R', MUTED);
      const page = 'Página ' + (i + 1) + ' de ' + pages.length;
      text(page, RIGHT - width(page, 8.1), H - 27, 8.1, 'R', MUTED);
    }
    const objects = [null, '<< /Type /Catalog /Pages 2 0 R /Lang (pt-BR) >>', '',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding /ToUnicode 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding /ToUnicode 5 0 R >>'];
    const cmap = unicodeMap();
    objects.push('<< /Length ' + cmap.length + ' >>\nstream\n' + cmap + '\nendstream');
    const refs = [];
    for (const p of pages) {
      const pid = objects.length, cid = pid + 1, stream = p.join('\n');
      refs.push(pid + ' 0 R');
      objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H +
        '] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents ' + cid + ' 0 R >>');
      objects.push('<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream');
    }
    objects[2] = '<< /Type /Pages /Kids [' + refs.join(' ') + '] /Count ' + pages.length + ' >>';
    const info = objects.length;
    objects.push('<< /Title ' + hex(model.title || 'Aula 06') +
      ' /Creator (PPI I - Aula 06 2.0.0) /Producer (Gerador local PPI) >>');
    let pdf = '%PDF-1.4\n', offsets = [0];
    for (let i = 1; i < objects.length; i++) { offsets[i] = pdf.length; pdf += i + ' 0 obj\n' + objects[i] + '\nendobj\n'; }
    const xref = pdf.length;
    pdf += 'xref\n0 ' + objects.length + '\n0000000000 65535 f \n';
    for (let i = 1; i < objects.length; i++) pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    pdf += 'trailer\n<< /Size ' + objects.length + ' /Root 1 0 R /Info ' + info +
      ' 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    return new TextEncoder().encode(pdf);
  }
  window.PpiPdf = Object.freeze({generate, version: '2.0.0'});
})();
