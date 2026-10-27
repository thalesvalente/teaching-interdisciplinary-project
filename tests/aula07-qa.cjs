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

async function verifyMissionOne(page) {
  await openIndexSlide(page, 10);
  await page.locator('#mission-host-1 input[value="interview-observation"]').check();
  await page.locator('#mission-host-1 input[value="observation-document"]').check();
  await page.locator('#mission-host-1 input[value="document-validation"]').check();
  await page.waitForTimeout(60);
  assert.match(await page.locator('#lesson-score').innerText(), /^10 \/ 100 XP de treino$/);
  assert.match(await page.locator('#lesson-progress-text').innerText(), /1 de 6 missões concluídas/);
  await page.locator('#reset-btn').click();
  await page.waitForTimeout(40);
  assert.match(await page.locator('#lesson-score').innerText(), /^0 \/ 100 XP de treino$/);
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
  await verifyMissionOne(page);

  await openIndexSlide(page, 1);
  await page.locator('body').press('ArrowRight');
  assert.equal((await page.locator('#counter').innerText()).trim(), '2 / 26', `${browserName}: navegação por teclado`);

  await page.locator('#contrast-btn').click();
  assert.equal(await page.locator('html').evaluate(node => node.classList.contains('high-contrast')), true, `${browserName}: alto contraste`);
  await page.locator('#contrast-btn').click();

  await page.setViewportSize({ width: 1280, height: 650 });
  await openIndexSlide(page, 19);
  await assertActiveSlideFits(page, `${browserName} 1280×650 missão 4`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, `${browserName}-1280x650-missao4.png`) });
  await verifyMissionFour(page);
  await verifySlide24Readability(page, browserName);

  if (browserName === 'chromium') {
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => { try { localStorage.clear(); } catch {} });
    await page.reload({ waitUntil: 'networkidle' });
    await verifyMissionSix(page);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'chromium-missao6-concluida.png') });
  }

  assert.deepEqual(errors, [], `${browserName}: erros no navegador: ${errors.join(' | ')}`);
  await browser.close();
}

async function runMobile(baseUrl) {
  const browser = await chromium.launch({ headless: true });
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
  await openIndexSlide(page, 24);
  const mobileGate = await page.evaluate(() => ({
    font: parseFloat(getComputedStyle(document.querySelector('#s24 .gate-common li')).fontSize),
    overflow: document.documentElement.scrollWidth > innerWidth + 2
  }));
  assert.ok(mobileGate.font >= 19 && !mobileGate.overflow,
    'slide 24 mobile deve manter leitura e reflow: ' + JSON.stringify(mobileGate));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'chromium-390x844-slide24.png') });
  assert.deepEqual(errors, [], `mobile: erros no navegador: ${errors.join(' | ')}`);
  await browser.close();
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
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
