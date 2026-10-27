'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium, firefox, webkit } = require('playwright');

const ROOT = process.cwd();
const LESSON_PATH = '/lessons/aula-07-da-pergunta-a-evidencia/';
const OUTPUT_DIR = process.env.AULA07_EVIDENCE_DIR || path.join(ROOT, 'tmp', 'aula07-qa');
const requested = (process.env.AULA07_BROWSERS || 'chromium,firefox')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);
const engines = { chromium, firefox, webkit };

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
  })[ext] || 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      } catch {
        response.writeHead(400).end('Bad request');
        return;
      }
      const relative = pathname.replace(/^\/+/, '');
      let target = path.resolve(ROOT, relative || 'index.html');
      if (!target.startsWith(path.resolve(ROOT) + path.sep) && target !== path.resolve(ROOT)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      try {
        if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      } catch {
        response.writeHead(404).end('Not found');
        return;
      }
      fs.readFile(target, (error, data) => {
        if (error) {
          response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
          return;
        }
        response.writeHead(200, {
          'Content-Type': mime(target),
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        });
        response.end(data);
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function openIndexSlide(page, number) {
  await page.locator('#index-btn').click();
  const dialog = page.locator('#index-dialog');
  await assertVisible(dialog, 'diálogo de índice');
  await dialog.getByRole('button', { name: new RegExp(`^${String(number).padStart(2, '0')} ·`) }).click();
  await page.waitForTimeout(80);
}

async function assertVisible(locator, label) {
  assert.equal(await locator.isVisible(), true, `${label} deveria estar visível`);
}

async function assertActiveSlideFits(page, label) {
  const geometry = await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    const viewport = document.documentElement.getBoundingClientRect();
    const rect = active?.getBoundingClientRect();
    const offenders = active ? [...active.querySelectorAll('*')].filter(node => {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const box = node.getBoundingClientRect();
      if (box.width === 0 && box.height === 0) return false;
      return box.left < rect.left - 2 || box.right > rect.right + 2 || box.top < rect.top - 2 || box.bottom > rect.bottom + 2;
    }).slice(0, 8).map(node => ({ tag: node.tagName, id: node.id, className: String(node.className), text: node.textContent.trim().slice(0, 80) })) : [];
    return {
      rect: rect && { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      viewport: { width: viewport.width, height: viewport.height },
      offenders,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  assert.ok(geometry.rect, `${label}: slide ativo ausente`);
  assert.ok(geometry.rect.left >= -2, `${label}: corte à esquerda: ${JSON.stringify(geometry.rect)}`);
  assert.ok(geometry.rect.right <= geometry.viewport.width + 2, `${label}: corte à direita: ${JSON.stringify(geometry.rect)}`);
  assert.ok(geometry.rect.top >= -2, `${label}: corte no topo: ${JSON.stringify(geometry.rect)}`);
  assert.ok(geometry.rect.bottom <= geometry.viewport.height + 2, `${label}: corte no rodapé: ${JSON.stringify(geometry.rect)}`);
  assert.equal(geometry.offenders.length, 0, `${label}: descendentes fora do canvas: ${JSON.stringify(geometry.offenders)}`);
  assert.ok(geometry.scrollWidth <= geometry.viewport.width + 2, `${label}: rolagem horizontal inesperada: ${geometry.scrollWidth} > ${geometry.viewport.width}`);
}

async function runAxe(page, browserName) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const result = await page.evaluate(async () => axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    rules: {
      'color-contrast': { enabled: true },
      'region': { enabled: false },
    },
  }));
  const blocking = result.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
  fs.writeFileSync(path.join(OUTPUT_DIR, `${browserName}-axe.json`), JSON.stringify(result, null, 2));
  assert.equal(blocking.length, 0, `${browserName}: violações axe sérias/críticas: ${blocking.map(v => `${v.id} (${v.nodes.length})`).join(', ')}`);
}

// Regressão visual: leitura do slide 24 em projetor 720p.
async function verifySlide24Readability(page, browserName) {
  await openIndexSlide(page, 24);
  await assertActiveSlideFits(page, browserName + ' 1280x650 gate etico');
  const audit = await page.evaluate(() => {
    const slide = document.querySelector('#s24');
    const common = slide.querySelector('.gate-common');
    const tracks = [...slide.querySelectorAll('.gate-track')];
    const commonBox = common.getBoundingClientRect();
    const trackBoxes = tracks.map(x => x.getBoundingClientRect());
    const checkSize = parseFloat(getComputedStyle(common.querySelector('li')).fontSize);
    const trackSizes = tracks.map(x => parseFloat(getComputedStyle(x.querySelector('p')).fontSize));
    const contentsFit = [...common.querySelectorAll('li'), ...tracks.flatMap(x => [x.querySelector('h2'), x.querySelector('p')])]
      .every(x => {
        const r = x.getBoundingClientRect();
        const parent = x.closest('.gate-common,.gate-track').getBoundingClientRect();
        return r.left >= parent.left - 2 && r.right <= parent.right + 2 && r.bottom <= parent.bottom + 2;
      });
    return {
      checkSize, trackSizes, contentsFit,
      topSeparated: commonBox.bottom <= Math.min(...trackBoxes.map(x => x.top)) + 2,
      sideBySide: trackBoxes[0].right <= trackBoxes[1].left + 2
    };
  });
  assert.ok(audit.checkSize >= 24, browserName + ': texto do checklist pequeno: ' + JSON.stringify(audit));
  assert.ok(audit.trackSizes.every(x => x >= 22), browserName + ': texto dos cartoes pequeno: ' + JSON.stringify(audit));
  assert.ok(audit.contentsFit && audit.topSeparated && audit.sideBySide,
    browserName + ': layout do slide 24 precisa manter separacao: ' + JSON.stringify(audit));
  await page.screenshot({ path: path.join(OUTPUT_DIR, browserName + '-1280x650-slide24.png') });
}


async function assertGuidedStageFits(page, slideNumber, browserName) {
  await assertActiveSlideFits(page, `${browserName} slide ${slideNumber} `);
  const info = await page.evaluate(number => {
    const slide=document.querySelector('#s'+number);
    const body=slide.querySelector('.guided-lesson');
    const scene=body.querySelector('.guided-scene');
    const stage=scene.querySelector('.guided-stage:not([hidden])');
    const br=body.getBoundingClientRect(), sr=scene.getBoundingClientRect(), cr=stage.getBoundingClientRect();
    return {
      stageVisible:!!stage,
      stageFullyInside:cr.left>=sr.left-2 && cr.right<=sr.right+2 && cr.top>=sr.top-2 && cr.bottom<=sr.bottom+2,
      bodyFits:body.scrollHeight<=body.clientHeight+3 && scene.scrollHeight<=scene.clientHeight+3 && stage.scrollHeight<=stage.clientHeight+3,
      stageCount:scene.querySelectorAll('.guided-stage:not([hidden])').length,
      bodyTop:br.top, bodyBottom:br.bottom
    };
  },slideNumber);
  assert.ok(info.stageVisible && info.stageFullyInside && info.bodyFits && info.stageCount===1,
    `${browserName} slide ${slideNumber}: conteúdo das etapas fora do espaço: ${JSON.stringify(info)}`);
}

async function verifyGuidedSlides(page,browserName) {
  const score=await page.locator('#lesson-score').innerText();
  await openIndexSlide(page,12);
  const slide12='#s12';
  assert.equal(await page.locator(slide12+' .guided-stage').count(),2);
  assert.equal(await page.locator(slide12+' .guided-stage:not([hidden])').count(),1);
  assert.match(await page.locator(slide12+' .guided-step-status').innerText(),/Etapa 1 de 2/);
  await assertGuidedStageFits(page,12,browserName);
  const firstSize=await page.locator(slide12+' .guided-stage:not([hidden]) .question-example').evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
  assert.ok(firstSize>=33,browserName+' slide 12: texto da pergunta pequeno: '+firstSize);
  await page.screenshot({path:path.join(OUTPUT_DIR,`${browserName}-1280x650-slide12-indutiva.png`)});
  await page.locator(slide12+' [data-guided-next]').click();
  assert.equal(await page.locator(slide12+' #s12-step2').isVisible(),true,'slide 12: exemplo neutro visível');
  assert.equal(await page.locator(slide12+' #s12-step1').isVisible(),false,'slide 12: indutiva oculta');
  await assertGuidedStageFits(page,12,browserName);
  await page.screenshot({path:path.join(OUTPUT_DIR,`${browserName}-1280x650-slide12-neutra.png`)});
  assert.equal(await page.locator(slide12+' [data-guided-next]').isDisabled(),true);
  await page.locator(slide12+' [data-guided-prev]').click();
  assert.equal(await page.locator(slide12+' #s12-step1').isVisible(),true);
  await page.locator(slide12+' [data-guided-target="0"]').focus();
  await page.locator(slide12+' [data-guided-target="0"]').press('ArrowRight');
  assert.equal(await page.locator(slide12+' #s12-step2').isVisible(),true,'slide 12: navegação por seta');
  assert.equal(await page.locator(slide12+' [data-guided-target="1"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator(slide12+' [data-guided-target="1"]').evaluate(n=>n===document.activeElement),true);
  assert.equal(await page.locator('#lesson-score').innerText(),score,'slide 12 não concede XP');

  await openIndexSlide(page,16);
  const slide16='#s16';
  assert.equal(await page.locator(slide16+' .guided-stage').count(),4);
  assert.equal(await page.locator(slide16+' .guided-stage:not([hidden])').count(),1);
  await assertGuidedStageFits(page,16,browserName);
  const listSize=await page.locator(slide16+' .guided-checkstage li').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
  assert.ok(listSize>=26,browserName+' slide 16: itens pequenos: '+listSize);
  await page.screenshot({path:path.join(OUTPUT_DIR,`${browserName}-1280x650-slide16-sinais.png`)});
  for(let i=1;i<4;i++){
    await page.locator(slide16+' [data-guided-next]').click();
    assert.equal(await page.locator(slide16+' .guided-step-status').innerText(),`Etapa ${i+1} de 4`);
    assert.equal(await page.locator(slide16+' #s16-step'+(i+1)).isVisible(),true);
    await assertGuidedStageFits(page,16,browserName);
    const typeSize=await page.locator(slide16+' .guided-stage:not([hidden]) p').evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
    assert.ok(typeSize>=38,browserName+' slide 16: fala/observação/julgamento pequeno: '+typeSize);
    await page.screenshot({path:path.join(OUTPUT_DIR,`${browserName}-1280x650-slide16-etapa${i+1}.png`)});
  }
  assert.equal(await page.locator(slide16+' [data-guided-next]').isDisabled(),true);
  await page.locator(slide16+' [data-guided-target="0"]').click();
  assert.equal(await page.locator(slide16+' #s16-step1').isVisible(),true);
  assert.equal(await page.locator('#lesson-score').innerText(),score,'slide 16 não concede XP');
}

async function verifySlide15Tabs(page, browserName) {
  await openIndexSlide(page, 15);
  await assertActiveSlideFits(page, browserName + ' slide15');
  const geometry = await page.evaluate(() => {
    const slide = document.querySelector('#s15');
    const title = slide.querySelector('.title').getBoundingClientRect();
    const tabs = slide.querySelector('.tab-list').getBoundingClientRect();
    const panel = slide.querySelector('[role="tabpanel"]:not([hidden])').getBoundingClientRect();
    const font = parseFloat(getComputedStyle(slide.querySelector('.question-cloud span')).fontSize);
    return { titleBottom:title.bottom, tabsTop:tabs.top, tabsBottom:tabs.bottom, panelTop:panel.top, font };
  });
  assert.ok(geometry.tabsTop > geometry.titleBottom + 10, browserName + ': abas colidem com titulo: ' + JSON.stringify(geometry));
  assert.ok(geometry.panelTop > geometry.tabsBottom + 7, browserName + ': abas colidem com painel: ' + JSON.stringify(geometry));
  assert.ok(geometry.font >= 21, browserName + ': perguntas do slide 15 pequenas: ' + JSON.stringify(geometry));
  await page.locator('#tab-eda').click();
  assert.equal(await page.locator('#panel-eda').isVisible(), true, 'tab EDA precisa exibir conteúdo');
  assert.equal(await page.locator('#panel-map').isVisible(), false, 'tab Mapa precisa ocultar conteúdo');
  assert.equal(await page.locator('#tab-eda').getAttribute('aria-selected'), 'true');
  await page.locator('#tab-eda').press('ArrowLeft');
  assert.equal(await page.locator('#panel-map').isVisible(), true, 'seta esquerda reativa Mapa');
  assert.equal(await page.locator('#panel-eda').isVisible(), false, 'seta esquerda oculta EDA');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'tab-map', 'foco deve acompanhar seleção');
  await page.screenshot({path:path.join(OUTPUT_DIR, browserName + '-1280x650-slide15.png')});
}

async function verifyMissionThree(page, browserName) {
  await openIndexSlide(page, 17);
  await assertActiveSlideFits(page, browserName + ' slide17');
  const host = '#mission-host-3';
  const geometry = await page.evaluate(() => {
    const slide = document.querySelector('#s17');
    const shell = slide.querySelector('.mission-shell');
    const r = shell.getBoundingClientRect();
    const body = slide.querySelector('.body').getBoundingClientRect();
    return {
      promptSize:parseFloat(getComputedStyle(slide.querySelector('.stepper-question legend')).fontSize),
      choiceSize:parseFloat(getComputedStyle(slide.querySelector('.mission-option')).fontSize),
      boxInside:r.top >= body.top - 3 && r.bottom <= body.bottom + 3,
      overflowing:shell.scrollHeight > shell.clientHeight + 3
    };
  });
  assert.ok(geometry.promptSize >= 28 && geometry.choiceSize >= 24, browserName + ': tipografia pequena: ' + JSON.stringify(geometry));
  assert.ok(geometry.boxInside && !geometry.overflowing, browserName + ': missão 3 cortada: ' + JSON.stringify(geometry));
  assert.equal(await page.locator(host + ' .stepper-question').count(), 1);
  assert.equal(await page.locator(host + ' .stepper-question input').count(), 4);
  assert.equal((await page.locator(host + ' .stepper-step-label').innerText()).trim(), 'Etapa 1 de 4');
  await page.screenshot({path:path.join(OUTPUT_DIR, browserName + '-1280x650-slide17.png')});
  const before = parseInt((await page.locator('#lesson-score').innerText()).split('/')[0], 10);
  await page.locator(host + ' input[value="judgment"]').check();
  assert.match(await page.locator(host + ' .question-feedback').innerText(), /Ainda não/);
  assert.equal(await page.locator(host + ' .stepper-nav button').last().isDisabled(),true,'resposta incorreta não avança');
  await page.locator(host + ' input[value="fact"]').check();
  await page.locator(host + ' .stepper-nav button').last().click();
  assert.equal((await page.locator(host + ' .stepper-step-label').innerText()).trim(), 'Etapa 2 de 4');
  await page.locator(host + ' input[value="interpretation"]').check();
  await page.locator(host + ' .stepper-nav button').first().click();
  assert.equal(await page.locator(host + ' input[value="fact"]').isChecked(),true,'voltar preserva resposta');
  await page.locator(host + ' .stepper-nav button').last().click();
  assert.equal(await page.locator(host + ' input[value="interpretation"]').isChecked(),true);
  await page.locator(host + ' .stepper-nav button').last().click();
  await page.locator(host + ' input[value="judgment"]').check();
  await page.locator(host + ' .stepper-nav button').last().click();
  await page.locator(host + ' input[value="validation"]').check();
  await page.locator(host + ' .stepper-nav button').last().click();
  assert.equal(parseInt((await page.locator('#lesson-score').innerText()).split('/')[0],10),before+15,'missão 3 concede somente 15 XP');
  assert.match(await page.locator(host + ' .mission-status').innerText(),/concluída/);
  await page.locator(host).getByRole('button',{name:'Reiniciar missão'}).click();
  assert.equal(parseInt((await page.locator('#lesson-score').innerText()).split('/')[0],10),before,'reinício retira apenas XP da missão 3');
}

async function verifyMissionOne(page, browserName) {
  await openIndexSlide(page, 10);
  const host = '#mission-host-1';
  assert.equal(await page.locator(host+' .stepper-question').count(), 1,
    'missão 1: somente uma questão deve estar visível');
  assert.equal(await page.locator(host+' .stepper-question input').count(), 3,
    'missão 1: três alternativas por etapa');
  assert.match(await page.locator(host+' .stepper-step-label').innerText(), /Etapa 1 de 3/);
  assert.match(await page.locator(host+' .stepper-stages').getAttribute('aria-label'), /Missão 1/);
  assert.match(await page.locator('#lesson-score').innerText(), /^0 \/ 100 XP de treino$/);

  async function assertLegible(label) {
    await assertActiveSlideFits(page, browserName + ' ' + label);
    const metrics = await page.evaluate(() => {
      const shell=document.querySelector('#mission-host-1 .mission-shell');
      const active=document.querySelector('#s10 .stepper-question');
      const body=document.querySelector('#s10 .body');
      const box=shell.getBoundingClientRect();
      const parent=body.getBoundingClientRect();
      return {
        prompt:parseFloat(getComputedStyle(active.querySelector('legend')).fontSize),
        choice:parseFloat(getComputedStyle(active.querySelector('.mission-option')).fontSize),
        shellFits:shell.scrollHeight <= shell.clientHeight+3,
        shellScrollHeight:shell.scrollHeight,
        shellClientHeight:shell.clientHeight,
        childFits:active.scrollHeight <= active.clientHeight+3,
        bodyFits:box.top>=parent.top-3 && box.bottom<=parent.bottom+3,
        childHeights:[...shell.children].map(e=>({role:e.className,height:Math.round(e.getBoundingClientRect().height)})),
      };
    });
    assert.ok(metrics.prompt>=28 && metrics.choice>=24,
      browserName + ' ' + label + ': fonte pequena: ' + JSON.stringify(metrics));
    assert.ok(metrics.shellFits && metrics.childFits && metrics.bodyFits,
      browserName + ' ' + label + ': conteudo cortado: ' + JSON.stringify(metrics));
  }
  await assertLegible('1280x720 etapa 1');
  await page.screenshot({path:path.join(OUTPUT_DIR,browserName+'-1280x720-slide10-etapa1.png')});
  await page.setViewportSize({width:1280,height:650});
  await page.waitForTimeout(65);
  await assertLegible('1280x650 etapa 1');
  await page.locator(host+' input[value="document-only"]').check();
  assert.match(await page.locator(host+' .question-feedback').innerText(), /Ainda não/);
  assert.equal(await page.locator(host+' .stepper-nav button').last().isDisabled(), true,
    'missão 1: erro oferece feedback e não avança');
  await page.locator(host+' input[value="interview-observation"]').check();
  await page.locator(host+' .stepper-nav button').last().click();
  assert.match(await page.locator(host+' .stepper-step-label').innerText(), /Etapa 2 de 3/);
  assert.equal(await page.locator(host+' .stepper-question').count(),1);
  await assertLegible('1280x650 etapa 2');
  await page.screenshot({path:path.join(OUTPUT_DIR,browserName+'-1280x650-slide10-etapa2.png')});
  await page.locator(host+' input[value="observation-document"]').check();
  await page.locator(host+' .stepper-nav button').first().click();
  assert.equal(await page.locator(host+' input[value="interview-observation"]').isChecked(),true,
    'missão 1: voltar preserva resposta anterior');
  await page.locator(host+' .stepper-nav button').last().click();
  assert.equal(await page.locator(host+' input[value="observation-document"]').isChecked(),true);
  await page.locator(host+' .stepper-nav button').last().click();
  assert.match(await page.locator(host+' .stepper-step-label').innerText(),/Etapa 3 de 3/);
  await assertLegible('1280x650 etapa 3');
  await page.screenshot({path:path.join(OUTPUT_DIR,browserName+'-1280x650-slide10-etapa3.png')});
  assert.equal(await page.locator('#lesson-score').innerText(),'0 / 100 XP de treino',
    'missão 1: não conceder XP antes de concluir');
  await page.locator(host+' input[value="document-validation"]').check();
  await page.locator(host+' .stepper-nav button').last().click();
  assert.equal(await page.locator('#lesson-score').innerText(),'10 / 100 XP de treino');
  assert.match(await page.locator('#lesson-progress-text').innerText(), /1 de 6 missões concluídas/);
  assert.match(await page.locator(host+' .mission-status').innerText(),/Missão concluída/);
  await page.locator('#reset-btn').click();
  assert.equal(await page.locator('#lesson-score').innerText(),'0 / 100 XP de treino');
  assert.match(await page.locator(host+' .stepper-step-label').innerText(),/Etapa 1 de 3/);
  assert.equal(await page.locator(host+' input:checked').count(),0,
    'missão 1: reinício zera respostas e etapa');
  await page.setViewportSize({width:1280,height:720});
  await page.waitForTimeout(65);
}

async function verifyMissionFour(page) {
  await openIndexSlide(page, 19);
  for (const value of ['author', 'version', 'ambiguous', 'privacy', 'conflict', 'formula']) {
    await page.locator(`#mission-host-4 input[value="${value}"]`).check();
  }
  await page.locator('#mission-host-4').getByRole('button', { name: 'Conferir seleção' }).click();
  await page.waitForTimeout(40);
  assert.match(await page.locator('#lesson-score').innerText(), /^20 \/ 100 XP de treino$/);
}

async function chooseRadio(page, host, value) {
  await page.locator(`${host} input[value="${value}"]`).check();
  await page.waitForTimeout(25);
}

async function verifyMissionSix(page) {
  await openIndexSlide(page, 25);
  const host = '#mission-host-6';
  await page.locator(host).getByRole('button', { name: 'Mapa Quilombola' }).click();
  for (const answer of ['m-tech', 'm-question', 'm-location', 'm-pending']) {
    await chooseRadio(page, host, answer);
    const next = page.locator(`${host} .scenario-nav button`).last();
    assert.equal(await next.isEnabled(), true, `missão 6: botão de avanço deveria estar habilitado após ${answer}`);
    await next.click();
  }
  await page.waitForTimeout(50);
  assert.match(await page.locator('#lesson-score').innerText(), /^20 \/ 100 XP de treino$/);
}

async function runDesktop(browserName, browserType, baseUrl) {
  const browser = await browserType.launch({ headless: true });
  try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  await page.goto(baseUrl + LESSON_PATH, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.documentElement.classList.contains('no-js'));

  assert.equal(await page.locator('.slide').count(), 26, `${browserName}: quantidade de slides`);
  assert.equal(await page.locator('.mission-slide').count(), 6, `${browserName}: quantidade de missões`);
  assert.equal(await page.locator('body').evaluate(node => node.classList.contains('reading')), false, `${browserName}: 1280×720 deve abrir em apresentação`);
  assert.match(await page.locator('#lesson-progress-text').innerText(), /não vale nota/i);
  await assertActiveSlideFits(page, `${browserName} 1280×720 capa`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, `${browserName}-1280x720-capa.png`) });

  await runAxe(page, browserName);
  await verifyMissionOne(page, browserName);

  await openIndexSlide(page, 1);
  await page.locator('body').press('ArrowRight');
  assert.equal((await page.locator('#counter').innerText()).trim(), '2 / 26', `${browserName}: navegação por teclado`);

  await page.locator('#contrast-btn').click();
  assert.equal(await page.locator('html').evaluate(node => node.classList.contains('high-contrast')), true, `${browserName}: alto contraste`);
  await page.locator('#contrast-btn').click();

  await page.setViewportSize({ width: 1280, height: 650 });
  if (await page.locator('body').evaluate(node => node.classList.contains('reading'))) {
    await page.locator('#read-btn').click();
  }
  assert.equal(await page.locator('body').evaluate(node => node.classList.contains('reading')),false,'1280x650 deve testar o modo apresentação');
  await openIndexSlide(page, 19);
  await assertActiveSlideFits(page, `${browserName} 1280×650 missão 4`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, `${browserName}-1280x650-missao4.png`) });
  await verifyMissionFour(page);
  await verifyGuidedSlides(page,browserName);
  await verifySlide15Tabs(page, browserName);
  await verifyMissionThree(page, browserName);
  await verifySlide24Readability(page, browserName);

  if (browserName === 'chromium') {
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => { try { localStorage.clear(); } catch {} });
    await page.reload({ waitUntil: 'networkidle' });
    await verifyMissionSix(page);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'chromium-missao6-concluida.png') });
  }

  assert.deepEqual(errors, [], `${browserName}: erros no navegador: ${errors.join(' | ')}`);
  } finally { await browser.close(); }
}

async function runMobile(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(baseUrl + LESSON_PATH, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('body').evaluate(node => node.classList.contains('reading')), true, 'mobile deve abrir em modo leitura');
  await openIndexSlide(page, 14);
  const mobile = await page.evaluate(() => {
    const slide = document.querySelector('#s14').getBoundingClientRect();
    const toolbar = document.querySelector('#toolbar').getBoundingClientRect();
    return {
      slideTop: slide.top,
      toolbarBottom: toolbar.bottom,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
    };
  });
  assert.ok(mobile.slideTop >= mobile.toolbarBottom - 4 && mobile.slideTop <= mobile.toolbarBottom + 24,
    `salto do índice deve alinhar slide abaixo dos controles: ${JSON.stringify(mobile)}`);
  assert.ok(mobile.scrollWidth <= mobile.innerWidth + 2, `mobile sem rolagem horizontal: ${JSON.stringify(mobile)}`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'chromium-390x844-missao2.png'), fullPage: false });
  for(const n of [12,16]){
    await openIndexSlide(page,n);
    const selector='#s'+n;
    const stages=await page.locator(selector+' .guided-stage').count();
    assert.equal(stages,n===12?2:4,'mobile: total de etapas do slide '+n);
    assert.equal(await page.locator(selector+' .guided-stage:not([hidden])').count(),1,'mobile: apenas uma etapa de cada vez');
    await page.locator(selector+' [data-guided-next]').click();
    assert.equal(await page.locator(selector+' .guided-step-status').innerText(),`Etapa 2 de ${stages}`);
    const geometry=await page.evaluate(number=>{
      const slide=document.querySelector('#s'+number);
      const body=slide.querySelector('.guided-lesson');
      const node=slide.querySelector('.guided-stage:not([hidden])');
      return{
        scrollWidth:document.documentElement.scrollWidth,innerWidth,
        stageOverflow:node.scrollWidth>node.clientWidth+2,
        bodyOverflow:body.scrollWidth>body.clientWidth+2
      };
    },n);
    // Medir a área legível, não o scrollWidth do slide que inclui seu pseudo-elemento decorativo recortado.
    assert.ok(!geometry.stageOverflow&&!geometry.bodyOverflow&&geometry.scrollWidth<=geometry.innerWidth+2,
      'mobile: sem rolagem horizontal nos slides 12/16: '+JSON.stringify(geometry));
    await page.screenshot({path:path.join(OUTPUT_DIR,'chromium-390x844-slide'+n+'.png')});
  }
  await openIndexSlide(page, 10);
  assert.equal(await page.locator('#mission-host-1 .stepper-question').count(),1,
    'mobile: Missão 1 mostra apenas uma questão por vez');
  const mobileLayout=await page.evaluate(()=>{
    const option=document.querySelector('#mission-host-1 .mission-option');
    const legend=document.querySelector('#mission-host-1 .stepper-question legend');
    return {
      optionFont:parseFloat(getComputedStyle(option).fontSize),
      promptFont:parseFloat(getComputedStyle(legend).fontSize),
      documentOverflow:document.documentElement.scrollWidth>innerWidth+2,
      stageOverflow:document.querySelector('#mission-host-1 .mission-shell').scrollWidth >
        document.querySelector('#mission-host-1 .mission-shell').clientWidth+2,
    };
  });
  assert.ok(mobileLayout.optionFont>=19 && mobileLayout.promptFont>=22 &&
    !mobileLayout.documentOverflow && !mobileLayout.stageOverflow,
    'mobile: Missão 1 deve manter fonte e reflow: '+JSON.stringify(mobileLayout));
  await page.locator('#mission-host-1 input[value="interview-observation"]').check();
  await page.locator('#mission-host-1 .stepper-nav button').last().click();
  assert.match(await page.locator('#mission-host-1 .stepper-step-label').innerText(),/Etapa 2 de 3/);
  await page.screenshot({path:path.join(OUTPUT_DIR,'chromium-390x844-slide10-etapa2.png')});
  await openIndexSlide(page, 15);
  await page.locator('#tab-eda').click();
  assert.equal(await page.locator('#panel-eda').isVisible(),true,'mobile: aba EDA deve responder ao toque');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),'mobile: slide 15 sem overflow horizontal');
  await page.screenshot({path:path.join(OUTPUT_DIR,'chromium-390x844-slide15.png')});
  await openIndexSlide(page, 17);
  assert.equal(await page.locator('#mission-host-3 .stepper-question input').count(),4,'mobile: apenas uma pergunta por etapa');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),'mobile: slide 17 sem overflow horizontal');
  await page.screenshot({path:path.join(OUTPUT_DIR,'chromium-390x844-slide17.png')});
  await openIndexSlide(page, 24);
  const mobileGate = await page.evaluate(() => ({
    font: parseFloat(getComputedStyle(document.querySelector('#s24 .gate-common li')).fontSize),
    overflow: document.documentElement.scrollWidth > innerWidth + 2
  }));
  assert.ok(mobileGate.font >= 19 && !mobileGate.overflow,
    'slide 24 mobile deve manter leitura e reflow: ' + JSON.stringify(mobileGate));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'chromium-390x844-slide24.png') });
  assert.deepEqual(errors, [], `mobile: erros no navegador: ${errors.join(' | ')}`);
  } finally { await browser.close(); }
}

(async () => {
  for (const name of requested) assert.ok(engines[name], `Navegador não suportado em AULA07_BROWSERS: ${name}`);
  const server = await startServer();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    for (const name of requested) await runDesktop(name, engines[name], baseUrl);
    await runMobile(baseUrl);
    console.log(`QA Aula 07: PASS em ${requested.join(', ')}; evidências em ${OUTPUT_DIR}`);
  } finally {
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
