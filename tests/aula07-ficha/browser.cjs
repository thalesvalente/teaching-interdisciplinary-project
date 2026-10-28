'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const pw = require('playwright');
const { ROOT, FOLDER, EVIDENCE, moduleFile, startServer, reporter, noOverflow, axe, download } = require('./harness.cjs');
const Model = require(moduleFile('model.js'));
const Rubric = require(moduleFile('rubric.js'));
const Storage = require(moduleFile('storage.js'));
const { completeFixture, partialFixture } = require('./fixtures.cjs');
const { rejectedDraftLifecycle } = require('./browser-storage.cjs');
const requested = (process.env.PPI_FICHA_BROWSERS || 'chromium,firefox,webkit').split(',').filter(Boolean);
const output = reporter('browser-report.json');
const VIEWPORTS = [[1280,650], [1366,768], [1920,1080], [390,844], [360,800], [320,568]];
const NOTICE = 'Pontuação automática de completude e processo. A qualidade técnica e ética permanece sujeita à revisão docente.';
const get = (obj, key) => key.split('.').reduce((value, part) => value?.[part], obj);

async function ready(page) {
  await page.waitForSelector('#nav-0');
  await page.waitForFunction(() => !!window.PPIModel && !!window.PPIRubric);
}

async function nav(page, number) {
  await page.locator('#nav-' + number).click();
  assert.equal(await page.locator('#mission-' + number).isVisible(), true);
}

async function importState(page, state, name = 'rascunho-sintetico.json') {
  await nav(page, 8);
  const raw = typeof state === 'string' ? state : JSON.stringify(state);
  await page.locator('#import-file').setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(raw) });
  let expected;
  try { expected = Model.validateImport(raw); } catch { expected = null; }
  if (expected) await page.waitForFunction(expected => JSON.stringify(window.PPIApp.getState()) === JSON.stringify(expected), expected);
  else await page.waitForFunction(() => !document.querySelector('#error-summary').hidden);
}

async function currentState(page) {
  return page.evaluate(() => window.PPIApp.getState());
}

async function assertScore(page, expected) {
  await page.waitForFunction(expected => Math.abs(window.PPIApp.score().xp - expected) < 1e-8, expected);
  const text = await page.locator('#xp-value').textContent();
  assert.match(text, new RegExp('^' + String(expected).replace('.', '[,.]') + '\\s*/\\s*100'));
}

async function reveal(page, selector) {
  const target = page.locator(selector);
  if (!await target.isVisible()) await page.locator('details').filter({ has: target }).locator('summary').first().click();
}

function skeleton(fixture) {
  const state = Model.createEmpty();
  state.members = fixture.members.map(item => ({ ...Model.member(), id: item.id }));
  state.m2.techniques.forEach((item, i) => { item.id = fixture.m2.techniques[i].id; });
  state.m3.questions.forEach((item, i) => { item.id = fixture.m3.questions[i].id; });
  state.m6.records.forEach((item, i) => { item.id = fixture.m6.records[i].id; });
  state.team.track = fixture.team.track;
  return state;
}

async function fillPanel(page, number, fixture) {
  await nav(page, number);
  const panel = page.locator('#mission-' + number);
  // A ficha agora mostra apenas uma parte da tarefa por vez. Abra as partes antes de preencher o fixture completo.
  await panel.locator('details.task-group').evaluateAll(groups => { for (const group of groups) group.open = true; });
  if (number === 3) await reveal(page, '[data-field="m3.ai.used"]');
  const fields = await panel.locator('[data-field]').evaluateAll(nodes => nodes.map(node => ({ key: node.dataset.field, tag: node.tagName, type: node.type })));
  let filled = 0;
  for (const item of fields) {
    const locator = panel.locator('[data-field="' + item.key + '"]');
    if (!await locator.isVisible() || !await locator.isEnabled()) continue;
    const value = get(fixture, item.key);
    if (value === undefined) continue;
    if (item.type === 'checkbox') await locator.setChecked(!!value);
    else if (item.tag === 'SELECT') await locator.selectOption(String(value));
    else await locator.fill(String(value));
    filled++;
  }
  if (number === 5) {
    for (const id of fixture.m5.participants) await panel.locator('[data-participant="' + id + '"]').check();
  }
  return filled;
}

async function keyboardTarget(page, selector, limit = 350, key = 'Tab') {
  for (let i = 0; i < limit; i++) {
    if (await page.evaluate(selector => document.activeElement?.matches(selector), selector)) return i;
    await page.keyboard.press(key);
  }
  throw Error('Keyboard could not reach ' + selector);
}

async function printMode(page, engine, mode) {
  const data = mode === 'partial' ? partialFixture() : completeFixture();
  await importState(page, data);
  await nav(page, 8);
  if (mode === 'blank') await reveal(page, '#print-blank');
  await page.locator(mode === 'blank' ? '#print-blank' : '#print-filled').click();
  assert.equal(await page.locator('#document-view').isVisible(), true);
  const text = await page.locator('#document-content').textContent();
  assert.ok(text.includes(NOTICE)); assert.match(text, /PPI1-3B/); assert.match(text, /Aula 08/);
  if (mode === 'blank') {
    assert.doesNotMatch(text, /QA_FINAL_EVIDENCE_MARKER/);
    assert.match(text, /FICHA EM BRANCO/);
    const spaces = await page.locator('#document-content .unanswered').count();
    assert.ok(spaces > 90, 'Blank worksheet needs space for every task field');
  }
  if (mode === 'partial') { assert.match(text, /Pendente/); assert.match(text, /QA_PARTIAL_RESPONSE_MARKER/); }
  assert.ok(await page.locator('#document-content .print-section h2').evaluateAll(nodes=>nodes.some(n=>/^7\s*·/.test(n.textContent))), 'Every print mode must retain fields for individual authorship');
  if (mode === 'filled') assert.match(text, /100\/100 XP/);
  await page.evaluate(() => { window.__qaPrintCalled = 0; window.print = () => { window.__qaPrintCalled++; }; });
  await page.locator('#print-document').click();
  assert.equal(await page.evaluate(() => window.__qaPrintCalled), 1);
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('#app').isVisible(), false);
  assert.equal(await page.locator('.document-actions').isVisible(), false);
  const controlsVisible = await page.locator('#document-content').evaluate(el => [...el.querySelectorAll('button,input,select,textarea')].filter(x => x.getClientRects().length).length);
  assert.equal(controlsVisible, 0);
  if (engine === 'chromium') await page.pdf({ path: path.join(EVIDENCE, 'ficha-' + mode + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: 'screen' });
  await page.locator('#back-to-form').click();
  assert.equal(await page.locator('#app').isVisible(), true);
  assert.equal(Rubric.score(await currentState(page)).xp, mode === 'partial' ? 2 : 100, 'Print preview must not change saved answers');
  return { mode, nativePrintTriggered: true, pdfGenerated: engine === 'chromium' };
}

(async () => {
  const server = await startServer();
  const origin = 'http://127.0.0.1:' + server.address().port;
  const url = origin + '/' + FOLDER + '/';
  try {
    for (const engine of requested) {
      let browser;
      try { browser = await pw[engine].launch({ headless: true }); output.report.versions[engine] = browser.version(); }
      catch (error) { output.blocked(engine, error.message); continue; }
      const context = await browser.newContext({ acceptDownloads: true, viewport: { width:1280, height:650 }, reducedMotion: 'reduce', timezoneId: 'America/Fortaleza' });
      const page = await context.newPage(); page.setDefaultTimeout(8000);
      const errors = [], warnings = [], requests = [], dialogs = [];
      let acceptDialogs = true;
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) warnings.push(message.text()); });
      page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));
      page.on('dialog', async dialog => { dialogs.push(dialog.message()); await (acceptDialogs ? dialog.accept() : dialog.dismiss()); });
      async function check(id, label, operation) {
        acceptDialogs = true;
        await output.check(engine, id, label, operation);
        acceptDialogs = true;
        if (output.report.results.at(-1).status !== 'PASS') {
          try { await context.setOffline(false); await page.emulateMedia({ media: 'screen', forcedColors: 'none' }); await page.goto(url); await ready(page); } catch {}
        }
      }

      await check( 'FLOW-01', 'Empty worksheet, notice and separate grading status', async () => {
        await page.goto(url); await ready(page);
        assert.match(await page.locator('#xp-value').textContent(), /^0\s*\/\s*100/);
        assert.match(await page.locator('#grade-value').textContent(), /0,0/);
        assert.equal((await page.locator('#xp-status').textContent()).trim(), 'Não iniciada');
        assert.match(await page.locator('body').textContent(), /Separada dos XP de treino dos slides/);
        assert.ok((await page.locator('body').textContent()).includes(NOTICE));
        await nav(page, 8);
        const text = await page.locator('#mission-8').textContent();
        assert.match(text, /Nota automática de processo/); assert.match(text, /Revisão docente/);
        assert.match(text, /Nota oficial PPI1-3B/); assert.match(text, /não calculada/i);
        return { initialXP:0, officialGrade:'not-calculated' };
      });

      for (const track of ['memorias','permanencia']) {
        await check( 'FLOW-02-' + track, 'Complete all seven missions through actual form controls: ' + track, async () => {
          const fixture = completeFixture(track);
          await importState(page, skeleton(fixture));
          let fields = 0;
          for (let number = 0; number <= 7; number++) fields += await fillPanel(page, number, fixture);
          await assertScore(page, 100);
          assert.match(await page.locator('#grade-value').textContent(), /10,0/);
          assert.equal((await page.locator('#xp-status').textContent()).trim(), 'Completa para revisão');
          const actual = await currentState(page);
          assert.deepEqual(Rubric.score(actual).missions.map(item => item.xp), [10,15,20,15,20,10,10]);
          assert.ok(fields > 100, 'Expected the complete form to be populated through UI controls');
          await nav(page, 8);
          const json = await download(page, () => page.locator('#export-json').click(), engine + '-' + track + '.json');
          assert.deepEqual(Model.validateImport(fs.readFileSync(json.file, 'utf8')), actual);
          await reveal(page, '#export-md');
          const md = await download(page, () => page.locator('#export-md').click(), engine + '-' + track + '.md');
          const markdown = fs.readFileSync(md.file, 'utf8');
          assert.match(markdown.replace(/\\_/g, '_'), /QA_FINAL_EVIDENCE_MARKER/);
          assert.match(markdown, /PPI1-3B/);
          return { fieldsFilled:fields, xp:100, grade:10, downloadRoundTrip:true };
        });
      }

      await check( 'FLOW-03', 'Deleting an answer recalculates XP; reload resumes answers and current mission', async () => {
        await importState(page, completeFixture()); await nav(page, 1);
        await page.locator('[data-field="m1.objective"]').fill(' \t ');
        await assertScore(page, 98);
        await page.locator('[data-field="m1.objective"]').fill('Dúvida sintética restaurada.');
        await assertScore(page, 100); await nav(page, 6); await page.reload(); await ready(page);
        assert.equal(await page.locator('#mission-6').isVisible(), true);
        await assertScore(page, 100);
      });

      await check('TEAM-UI','Renaming/removing members preserves remaining authorship by stable ID',async()=>{
        await importState(page,completeFixture()); await nav(page,0);
        await page.locator('[data-field="members.0.name"]').fill('Integrante sintético renomeado');
        const before=await currentState(page); assert.equal(before.members[0].id,'m-qa-1');
        await page.locator('#mission-0').getByRole('button',{name:'Remover integrante',exact:true}).first().click();
        const after=await currentState(page); assert.equal(after.members.length,1); assert.equal(after.members[0].id,'m-qa-2');
        assert.equal(after.members[0].contribution,before.members[1].contribution);
        await nav(page,7); assert.equal(await page.locator('[data-field="members.0.contribution"]').inputValue(),before.members[1].contribution);
        await nav(page,0); await page.locator('#add-member').click();
        const added=await currentState(page); assert.equal(added.members[0].id,'m-qa-2'); assert.notEqual(added.members[1].id,'m-qa-2');
      });

      await check('EVIDENCE-UI','An unused extra evidence card does not contradict rubric completion',async()=>{
        await importState(page,completeFixture()); await nav(page,6); await page.locator('#add-evidence').click();
        await assertScore(page,100); await page.locator('#validate-mission').click();
        assert.match(await page.locator('#error-summary').textContent(),/Campos conferidos/);
        assert.equal(await page.locator('#mission-6 [aria-invalid="true"]').count(),0);
      });

      await check( 'A11Y-01', 'Axe-core WCAG checks on all stages and validation errors', async () => {
        await importState(page, completeFixture()); const reports = [];
        for (let number = 0; number <= 8; number++) {
          await nav(page, number); const violations = await axe(page);
          reports.push({ mission:number, violations });
        }
        await importState(page, Model.createEmpty()); await nav(page, 1);
        await page.locator('#validate-mission').click();
        assert.equal(await page.locator('#error-summary').isVisible(), true);
        assert.equal(await page.evaluate(() => document.activeElement.id), 'error-summary');
        assert.ok(await page.locator('[aria-invalid="true"]').count() > 0);
        const links = page.locator('#error-summary a'); assert.ok(await links.count() > 0);
        await links.first().click();
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-invalid')), 'true');
        const errorViolations = await axe(page); reports.push({ mission:'error', violations:errorViolations });
        fs.writeFileSync(path.join(EVIDENCE, engine + '-axe.json'), JSON.stringify(reports, null, 2));
        const blocking = reports.flatMap(item => item.violations.filter(v => ['serious','critical'].includes(v.impact)).map(v => ({mission:item.mission,...v})));
        assert.deepEqual(blocking, []);
        return { auditedStates:reports.length, criticalOrSerious:0, allViolations:reports.reduce((s,x)=>s+x.violations.length,0) };
      });

      await check( 'VIEW-01', 'All stages fit six required viewports without page overflow', async () => {
        await importState(page, completeFixture()); const geometries = [];
        for (const [width,height] of VIEWPORTS) {
          await page.setViewportSize({width,height});
          for (let number=0; number<=8; number++) {
            await nav(page,number); geometries.push({mission:number,width,height,...await noOverflow(page)});
          }
          if (engine==='chromium' && [1280,390].includes(width)) {
            await nav(page,1);
            await page.screenshot({path:path.join(EVIDENCE, `chromium-${width}x${height}-mission1.png`)});
            await nav(page,8);
            await page.screenshot({path:path.join(EVIDENCE, `chromium-${width}x${height}-summary.png`)});
          }
        }
        return geometries;
      });

      await check( 'A11Y-02', 'Text zoom/spacing, reduced motion and high contrast remain usable', async () => {
        await page.setViewportSize({width:640,height:480}); await nav(page,1);
        await page.evaluate(() => {
          document.documentElement.style.fontSize='200%';
          for (const node of document.querySelectorAll('body *')) {
            node.style.lineHeight='1.5'; node.style.letterSpacing='.12em'; node.style.wordSpacing='.16em';
          }
        });
        await noOverflow(page);
        await page.reload(); await ready(page); await page.setViewportSize({width:1280,height:650});
        await page.locator('#contrast-toggle').click();
        assert.equal(await page.locator('#contrast-toggle').getAttribute('aria-pressed'),'true');
        await nav(page,4); await noOverflow(page);
        const violations = await axe(page); assert.deepEqual(violations.filter(v=>['serious','critical'].includes(v.impact)),[]);
        assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
        await page.emulateMedia({forcedColors:'active'}); await noOverflow(page);
        assert.notEqual(await page.locator('#next-mission').evaluate(node=>getComputedStyle(node).borderStyle),'none');
        await page.emulateMedia({forcedColors:'none'}); await page.locator('#contrast-toggle').click();
        return {textZoom:200,spacing:true,reducedMotion:true,highContrast:true,forcedColors:true};
      });

      await check( 'A11Y-03', 'Keyboard traverses all stages, edits answers and reaches reset without trapping focus', async () => {
        await importState(page, completeFixture()); await page.reload(); await ready(page);
        await page.keyboard.press('Control+Home');
        // Begin from the page's skip link using ordinary sequential keyboard focus.
        await page.keyboard.press('Tab'); await keyboardTarget(page,'.skip-link'); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(()=>document.activeElement.id),'worksheet');
        const traversed = [];
        for(let number=0;number<=8;number++) {
          const tabs=await keyboardTarget(page,'#nav-'+number,350,'Shift+Tab'); await page.keyboard.press('Enter');
          assert.equal(await page.locator('#mission-'+number).isVisible(),true);
          const active=await page.evaluate(()=>({id:document.activeElement.id,tag:document.activeElement.tagName}));
          assert.ok(active.tag!=='BODY','Mission navigation must move focus to meaningful content');
          traversed.push({mission:number,tabs,focus:active});
          if(number===1) {
            await keyboardTarget(page,'[data-field="m1.objective"]');
            await page.keyboard.press('Control+A'); await page.keyboard.type('Pergunta sintética editada apenas pelo teclado.');
            await page.keyboard.press('Tab'); await assertScore(page,100);
          }
        }
        await keyboardTarget(page,'#reset-all');
        const focus=await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle);
        assert.notEqual(focus,'none');
        return {stages:traversed,keyboardEdit:true,resetReachable:true};
      });

      await check( 'RESET-UI', 'Reset per mission/total and track switching require confirmation', async () => {
        await importState(page,completeFixture()); await nav(page,1);
        const before=dialogs.length; acceptDialogs=false; await page.locator('#reset-mission').click();
        await assertScore(page,100); assert.equal(dialogs.length,before+1);
        acceptDialogs=true; await page.locator('#reset-mission').click(); await assertScore(page,90);
        await importState(page,completeFixture()); await nav(page,0);
        acceptDialogs=false; await page.locator('[data-field="team.track"]').selectOption('permanencia'); await assertScore(page,100);
        assert.equal((await currentState(page)).team.track,'memorias');
        acceptDialogs=true; await page.locator('[data-field="team.track"]').selectOption('permanencia'); await assertScore(page,0);
        const changed=await currentState(page); assert.equal(changed.members[0].id,'m-qa-1'); assert.equal(changed.members[0].contribution,'');
        await importState(page,completeFixture()); await nav(page,8);
        acceptDialogs=false; await page.locator('#reset-all').click(); await assertScore(page,100);
        acceptDialogs=true; await page.locator('#reset-all').click();
        assert.match(await page.locator('#xp-value').textContent(),/^0\s*\/\s*100/);
        await nav(page,3); await page.locator('[data-field="m3.questions.0.text"]').fill('Pergunta sintética ainda sem categoria/finalidade.');
        await assertScore(page,0); await nav(page,0); const beforeInitial=dialogs.length;
        acceptDialogs=false; await page.locator('[data-field="team.track"]').selectOption('memorias');
        assert.equal(dialogs.length,beforeInitial+1); assert.equal((await currentState(page)).team.track,'');
        assert.equal((await currentState(page)).m3.questions[0].text,'Pergunta sintética ainda sem categoria/finalidade.');
        acceptDialogs=true;
        return {cancelPreserves:true,missionReset:true,totalReset:true,trackReset:true};
      });

      await check( 'IMPORT-UI', 'Invalid imports show accessible errors, preserve answers and reject hostile input', async () => {
        await importState(page,partialFixture()); const before=await currentState(page);
        const invalids = [
          ['broken','{bad'],
          ['version',JSON.stringify({...completeFixture(),schemaVersion:'999'})],
          ['oversized',' '.repeat(Model.MAX_BYTES+1)],
          ['dangerous',JSON.stringify(completeFixture()).replace('"m1":{','"m1":{"__proto__":{"polluted":true},')],
          ['unknown-property',JSON.stringify({...completeFixture(),untrustedCommand:'send-all-data'})]
        ];
        for(const [kind,raw] of invalids) {
          await importState(page,raw,kind+'.json');
          assert.equal(await page.locator('#error-summary').isVisible(),true,kind);
          assert.equal(await page.evaluate(()=>document.activeElement.id),'error-summary',kind);
          assert.deepEqual(await currentState(page),before,kind);
        }
        const tampered={...partialFixture(),score:{xp:100,grade:10}};
        await importState(page,tampered); await assertScore(page,2);
        const hostile=partialFixture(); hostile.m1.objective='<img src=x onerror="window.__qaPwned=true">';
        await importState(page,hostile); await nav(page,1);
        assert.equal(await page.locator('[data-field="m1.objective"]').inputValue(),hostile.m1.objective);
        assert.equal(await page.evaluate(()=>window.__qaPwned),undefined);
        assert.equal(await page.locator('img[src=x]').count(),0);
        await nav(page,8); await page.locator('#print-filled').click();
        assert.ok((await page.locator('#document-content').textContent()).includes(hostile.m1.objective));
        assert.equal(await page.locator('#document-content img').count(),0);
        await page.locator('#back-to-form').click();
        return {invalidImports:invalids.length,preserved:true,tamperedScoreRecomputed:true,xssNeutralized:true};
      });

      await check( 'URL-UI', 'Optional repository validation associates error and leaves input available to fix', async () => {
        await importState(page,completeFixture()); await nav(page,0);
        await page.locator('[data-field="team.repository"]').fill('javascript:alert(1)');
        await page.locator('#validate-mission').click();
        assert.equal(await page.locator('[data-field="team.repository"]').getAttribute('aria-invalid'),'true');
        assert.equal(await page.locator('#error-summary').isVisible(),true);
        await page.reload(); await ready(page);
        assert.equal((await currentState(page)).m1.objective,completeFixture().m1.objective);
        assert.equal((await currentState(page)).team.repository,'javascript:alert(1)');
        await nav(page,0);
        await page.locator('[data-field="team.repository"]').fill('');
        await page.locator('#validate-mission').click();
        assert.notEqual(await page.locator('[data-field="team.repository"]').getAttribute('aria-invalid'),'true');
      });

      for(const mode of ['filled','partial','blank']) {
        await check('PRINT-'+mode,'A4 '+mode+' preview, native print action and preserved answers',()=>printMode(page,engine,mode));
      }

      if(engine==='chromium') await check('PRINT-long','A valid long multiline answer remains complete across A4 page boundaries',async()=>{
        const state=completeFixture();
        state.m1.objective='Observação sintética sem julgamento; registro de teste.\n'.repeat(100)+'QA_LONG_TEXT_END';
        assert.ok(state.m1.objective.length<Model.MAX_TEXT);
        await importState(page,state); await nav(page,8); await page.locator('#print-filled').click();
        assert.match(await page.locator('#document-content').textContent(),/QA_LONG_TEXT_END/);
        await page.emulateMedia({media:'print'});
        await page.pdf({path:path.join(EVIDENCE,'ficha-long.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
        await page.emulateMedia({media:'screen'}); await page.locator('#back-to-form').click();
        assert.equal((await currentState(page)).m1.objective,state.m1.objective);
        return {answerCharacters:state.m1.objective.length};
      });

      await check('STORAGE-UI','Unavailable storage allows export; rejected local draft survives reload until editing',async()=>{
        const probe=await context.newPage();
        try {
          await probe.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
          await probe.goto(url); await ready(probe); await nav(probe,1);
          await probe.locator('[data-field="m1.objective"]').fill('Resposta sintética em memória.');
          assert.match(await probe.locator('#xp-value').textContent(),/^2\s*\/\s*100/);
          assert.match(await probe.locator('#save-status').textContent(),/JSON|não foi possível|indisponível/i);
          await nav(probe,8); const item=await download(probe,()=>probe.locator('#export-json').click(),engine+'-storage-fallback.json');
          assert.equal(Model.validateImport(fs.readFileSync(item.file,'utf8')).m1.objective,'Resposta sintética em memória.');
        } finally { await probe.close(); }
        return rejectedDraftLifecycle(browser,url);
      });

      await check('OFFLINE-UI','Loaded static application remains usable offline with local downloads',async()=>{
        await importState(page,partialFixture());
        await context.setOffline(true);
        try {
          await nav(page,1); await page.locator('[data-field="m1.need"]').fill('Necessidade sintética escrita offline.');
          await assertScore(page,4); await nav(page,8);
          const item=await download(page,()=>page.locator('#export-json').click(),engine+'-offline.json');
          assert.equal(Rubric.score(Model.validateImport(fs.readFileSync(item.file,'utf8'))).xp,4);
        } finally {await context.setOffline(false);}
      });

      await check('NOJS-UI','Essential seven-mission paper worksheet works with JavaScript disabled',async()=>{
        const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:568}});
        try {
          const probe=await nojs.newPage(); await probe.goto(url);
          assert.match(await probe.locator('body').textContent(),/JavaScript está desativado/);
          await probe.goto(url+'papel.html'); const text=await probe.locator('body').textContent();
          for(const fragment of ['Definir a descoberta','Escolher as técnicas','Construir o protocolo','Testar o roteiro','Autoria individual','100','Aula 08']) assert.ok(text.includes(fragment),fragment);
          assert.ok(text.includes(NOTICE)); await noOverflow(probe);
        } finally {await nojs.close();}
      });

      await check('PRIVACY-UI','No answers sent over network and console is clean',async()=>{
        assert.deepEqual(requests.filter(item=>!item.url.startsWith(origin)&&!item.url.startsWith('blob:')&&!item.url.startsWith('data:')),[]);
        assert.deepEqual(requests.filter(item=>item.method!=='GET'||item.body),[]);
        assert.deepEqual(errors,[]); assert.deepEqual(warnings,[]);
        return {requests:requests.length,externalRequests:0,submissions:0,pageErrors:0,warnings:0};
      });
      await context.close(); await browser.close();
    }
  } finally {await new Promise(resolve=>server.close(resolve)); output.save();}
  console.log(JSON.stringify({summary:output.report.summary,versions:output.report.versions,evidence:EVIDENCE},null,2));
  if(output.report.summary.fail||output.report.summary.blocked)process.exitCode=1;
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
