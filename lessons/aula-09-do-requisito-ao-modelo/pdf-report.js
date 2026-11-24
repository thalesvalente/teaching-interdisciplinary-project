(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.PPIReportPDF = factory(root.PDFLib);
})(typeof globalThis === 'object' ? globalThis : this, function (lib) {
  'use strict';
  const FORMAT = 'PPI-A09-PDF-1';
  const MAX_POINTS = 10;
  const QUESTION_POINTS = MAX_POINTS / 16;
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 39;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const ENROLLMENT = /^[0-9]{8}\.ITA[0-9]{4}$/;
  const grade = (value, digits = 2) => Number(value).toFixed(digits).replace('.', ',');
  function validate(payload) {
    if (!payload || !['eda', 'memorias'].includes(payload.track)) throw Error('Trilha inválida.');
    if (!Array.isArray(payload.enrollments) || !payload.enrollments.length ||
        payload.enrollments.some(id => !ENROLLMENT.test(id)) ||
        new Set(payload.enrollments).size !== payload.enrollments.length) throw Error('Matrículas inválidas.');
    if (!Array.isArray(payload.answers) || payload.answers.length !== 16) throw Error('Questões incompletas no relatório.');
    const prefix = payload.track === 'eda' ? 'EDA' : 'MEM';
    payload.answers.forEach((answer, i) => {
      const expected = prefix + '-Q' + String(i + 1).padStart(2, '0');
      if (answer.id !== expected || ![0, QUESTION_POINTS].includes(answer.points) ||
          (answer.selectedId !== null && !/^O[1-4]$/.test(answer.selectedId))) throw Error('Registro de questão inválido.');
      if (answer.points === QUESTION_POINTS && (answer.selectedId === null || answer.selectedId !== answer.correctId)) throw Error('Pontuação inconsistente.');
    });
    const resolved = payload.answers.filter(a => a.points === QUESTION_POINTS).length;
    const points = resolved * QUESTION_POINTS;
    if (payload.score.grade !== points || payload.completed !== (resolved === 16)) throw Error('Nota inconsistente.');
    return {points, resolved};
  }
  async function generate(payload) {
    if (!lib) throw Error('Gerador PDF indisponível.');
    const result = validate(payload);
    const {PDFDocument, StandardFonts, rgb} = lib;
    const pdf = await PDFDocument.create();
    pdf.setTitle('PPI I - Aula 09 - Comprovante de avaliação');
    pdf.setAuthor('IFMA - PPI I');
    pdf.setSubject(FORMAT);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const mono = await pdf.embedFont(StandardFonts.Courier);
    const ink = rgb(.10, .19, .15);
    const muted = rgb(.30, .37, .32);
    const green = rgb(0, .30, .17);
    const pale = rgb(.92, .97, .94);
    const line = rgb(.75, .83, .78);
    let page, y;
    // Preserve Portuguese text in WinAnsi. Substitute rare glyphs outside the
    // standard embedded font, including diagram arrows and mathematical symbols.
    function clean(value, face = font) {
      const text = String(value ?? '').normalize('NFC')
        .replace(/\r\n?/g, '\n').replace(/\t/g, ' ')
        .replace(/→/g, ' -> ').replace(/←/g, ' <- ')
        .replace(/−/g, '-').replace(/≤/g, '<=').replace(/≥/g, '>=')
        .replace(/✓/g, 'OK').replace(/\u00a0/g, ' ');
      return Array.from(text).map(ch => {
        if (ch === '\n') return ch;
        try { face.encodeText(ch); return ch; } catch { return '?'; }
      }).join('');
    }
    function wrap(text, width, size, face) {
      const lines = [];
      for (const paragraph of clean(text, face).split('\n')) {
        let current = '';
        for (let word of paragraph.split(/\s+/).filter(Boolean)) {
          if (current && face.widthOfTextAtSize(current + ' ' + word, size) <= width) {
            current += ' ' + word;
            continue;
          }
          if (current) { lines.push(current); current = ''; }
          while (face.widthOfTextAtSize(word, size) > width) {
            let end = word.length - 1;
            while (end > 0 && face.widthOfTextAtSize(word.slice(0, end), size) > width) end--;
            if (!end) throw Error('Não foi possível ajustar o texto.');
            lines.push(word.slice(0, end)); word = word.slice(end);
          }
          current = word;
        }
        lines.push(current);
      }
      return lines;
    }
    function text(value, x, top, size = 10, face = font, color = ink) {
      page.drawText(clean(value, face), {x, y: top - size, size, font: face, color});
    }
    function newPage(title) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({x:0,y:PAGE_HEIGHT-7,width:PAGE_WIDTH,height:7,color:green});
      text('IFMA  |  PPI I  |  Aula 09', MARGIN, PAGE_HEIGHT - 24, 10, bold, green);
      text(title, MARGIN, PAGE_HEIGHT - 44, 17, bold);
      y = PAGE_HEIGHT - 76;
    }
    function ensure(height) {
      if (y - height < 42) newPage('Comprovante de avaliação - continuação');
    }
    function paragraph(value, size = 10, face = font, color = ink, width = CONTENT_WIDTH, indent = 0) {
      for (const row of wrap(value, width, size, face)) {
        ensure(size + 5);
        text(row, MARGIN + indent, y, size, face, color);
        y -= size + 4;
      }
      y -= 5;
    }
    function heading(value) { ensure(36); y -= 5; text(value, MARGIN, y, 12, bold, green); y -= 20; }
    function fixed(value, face = mono, size = 10) {
      const sanitized = clean(value, face);
      if (face.widthOfTextAtSize(sanitized, size) > CONTENT_WIDTH) throw Error('Campo estruturado maior que a área do PDF.');
      ensure(size + 6); text(sanitized, MARGIN, y, size, face); y -= size + 5;
    }
    newPage('Comprovante de avaliação');
    paragraph(payload.project, 13, bold, green);
    fixed('FORMATO_PDF: ' + FORMAT);
    fixed('ATIVIDADE: PPI1-4B');
    fixed('VERSAO_ATIVIDADE: ' + payload.version);
    fixed('TRILHA: ' + payload.track.toUpperCase());
    fixed('STATUS: ' + (payload.completed ? 'CONCLUIDA' : 'PARCIAL'));
    ensure(83);
    page.drawRectangle({x:MARGIN,y:y-73,width:CONTENT_WIDTH,height:73,color:pale,borderColor:line,borderWidth:1});
    text('NOTA_FINAL: ' + grade(result.points), MARGIN + 13, y - 10, 22, bold, green);
    text('NOTA_MAXIMA: ' + grade(MAX_POINTS), MARGIN + 13, y - 39, 10, mono);
    text('QUESTOES_RESOLVIDAS: ' + result.resolved + '/16', MARGIN + 13, y - 54, 10, mono);
    text(String(result.resolved*6.25).replace('.',',')+' XP', PAGE_WIDTH - MARGIN - 83, y - 16, 13, bold, green);
    y -= 83;
    heading('Identificação dos integrantes');
    fixed('TOTAL_INTEGRANTES: ' + payload.enrollments.length);
    payload.enrollments.forEach(id => fixed('MATRICULA: ' + id));
    paragraph('Código da equipe: ' + (payload.team || '—'), 10);
    heading('Requisito recuperado da Aula 08');
    paragraph(payload.requirement || 'Não informado.', 10);
    heading('Resumo da avaliação');
    for (let i = 0; i < 4; i++) {
      const items = payload.answers.slice(i*4,i*4+4);
      const points = items.reduce((sum,a)=>sum+a.points,0);
      paragraph('Missão '+(i+1)+' | '+items[0].mission+' | '+grade(points,3)+' / 2,50',10);
    }
    paragraph('Acertos de primeira: '+payload.score.firstTry+'/16 | revisões: '+payload.score.revisions+' | pistas: '+payload.score.hints,9, font, muted);
    paragraph('Cada questão resolvida vale 0,625 ponto. A nota final é apresentada com duas casas decimais. Pistas e revisões não diminuem a nota. A avaliação da equipe é vinculada às matrículas informadas neste comprovante.',9,font,muted);
    newPage('Respostas e conferência');
    paragraph('Os identificadores QID e RESPOSTA permitem conferir a pontuação com o gabarito da versão da atividade.',9,font,muted);
    for (const answer of payload.answers) {
      const selected = answer.selected ?? 'Pendente';
      const key = answer.correct ?? 'Ainda não concluída';
      const details = [
        ['Enunciado: '+answer.question,bold],
        ['Resposta: '+selected,font],
        ['Gabarito: '+key,font],
        ['Histórico: '+(answer.history||'—'),font],
      ];
      const height = 23 + details.reduce((n,[v,face])=>n+wrap(v,CONTENT_WIDTH,9,face).length*13+5,0)+10;
      ensure(height);
      page.drawRectangle({x:MARGIN,y:y-17,width:CONTENT_WIDTH,height:17,color:pale});
      const record = 'QID: '+answer.id+' | RESPOSTA: '+(answer.selectedId||'PENDENTE')+' | PONTOS: '+grade(answer.points,3)+' | TENTATIVAS: '+answer.attempts+' | PISTAS: '+answer.hints;
      fixed(record, mono, 8.4);
      y -= 4;
      details.forEach(([value,face])=>paragraph(value,9,face));
      y -= 3;
    }
    if(payload.completed && payload.evolution){
      heading('Trecho de referência da evolução');
      paragraph(payload.evolution,8,mono,muted);
    }
    const pages = pdf.getPages();
    for (const [index, item] of pages.entries()) {
      item.drawLine({start:{x:MARGIN,y:33},end:{x:PAGE_WIDTH-MARGIN,y:33},color:line,thickness:.6});
      item.drawText('PPI I - Aula 09 | '+FORMAT, {x:MARGIN,y:20,size:8,font,color:muted});
      const label = (index+1)+' / '+pages.length;
      item.drawText(label,{x:PAGE_WIDTH-MARGIN-font.widthOfTextAtSize(label,8),y:20,size:8,font,color:muted});
    }
    return pdf.save({useObjectStreams:false});
  }
  return {generate, FORMAT};
});
