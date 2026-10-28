'use strict';

const assert = require('node:assert/strict');

// A rejected local draft must not be overwritten merely by leaving/reloading.
// An actual new edit may replace it, and must still survive an immediate reload.
async function rejectedDraftLifecycle(browser, url) {
  const context = await browser.newContext();
  const raw = '{broken-synthetic-draft';
  try {
    await context.addInitScript(raw => {
      if (!sessionStorage.getItem('qa-corrupt-seeded')) {
        localStorage.setItem('ppi-aula07-ficha-v1', raw);
        sessionStorage.setItem('qa-corrupt-seeded', 'true');
      }
    }, raw);
    const page = await context.newPage();
    await page.goto(url);
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.waitForFunction(() => !!window.PPIApp);
      assert.equal(await page.evaluate(() => localStorage.getItem('ppi-aula07-ficha-v1')), raw,
        'Rejected draft changed without editing, reload ' + attempt);
      assert.match(await page.locator('#save-status').textContent(), /não pôde ser retomado.*preservado/i);
      if (attempt < 2) await page.reload();
    }
    await page.locator('#nav-1').click();
    await page.locator('[data-field="m1.objective"]').fill('Nova resposta sintética após aviso.');
    await page.reload();
    await page.waitForFunction(() => !!window.PPIApp);
    assert.equal(await page.evaluate(() => window.PPIApp.getState().m1.objective),
      'Nova resposta sintética após aviso.');
    return { rejectedRawPreserved: true, reloadsWithoutEditing: 2, newEditSurvivesImmediateReload: true };
  } finally { await context.close(); }
}

module.exports = { rejectedDraftLifecycle };

if (require.main === module) {
  const pw = require('playwright');
  const { startServer, FOLDER, reporter } = require('./harness.cjs');
  const output = reporter('storage-lifecycle-report.json');
  (async () => {
    const server = await startServer();
    const url = 'http://127.0.0.1:' + server.address().port + '/' + FOLDER + '/';
    try {
      for (const engine of (process.env.PPI_FICHA_BROWSERS || 'chromium,firefox,webkit').split(',')) {
        const browser = await pw[engine].launch();
        try {
          output.report.versions[engine] = browser.version();
          await output.check(engine, 'STORAGE-LIFECYCLE', 'Rejected draft survives reload until an explicit edit',
            () => rejectedDraftLifecycle(browser, url));
        } finally { await browser.close(); }
      }
    } finally { await new Promise(resolve => server.close(resolve)); output.save(); }
    console.log(JSON.stringify(output.report.summary));
    if (output.report.summary.fail || output.report.summary.blocked) process.exitCode = 1;
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
