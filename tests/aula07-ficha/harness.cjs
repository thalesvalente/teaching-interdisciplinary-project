'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const cp = require('node:child_process');

const ROOT = path.resolve(process.env.PPI_FICHA_ROOT || path.join(__dirname, '../..'));
const FOLDER = 'lessons/aula-07-da-pergunta-a-evidencia/ficha';
const EVIDENCE = path.resolve(process.env.PPI_FICHA_EVIDENCE_DIR || path.join(ROOT, 'tmp/aula07-ficha-qa'));

function codeIdentity() {
  const command = args => {
    try { return cp.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim(); }
    catch { return 'unavailable'; }
  };
  return { sha: command(['rev-parse', 'HEAD']), tree: command(['rev-parse', 'HEAD^{tree}']),
    worksheetTree: command(['rev-parse', 'HEAD:' + FOLDER]),
    dirty: command(['status', '--porcelain', '--', FOLDER]),
    testedAt: new Date().toISOString() };
}

function moduleFile(file) { return path.join(ROOT, FOLDER, file); }

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405).end('Read-only fixture server'); return;
      }
      let url;
      try { url = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
      catch { response.writeHead(400).end('Bad request'); return; }
      if (url.split('/').some(part => part.startsWith('.'))) {
        response.writeHead(403).end('Forbidden'); return;
      }
      let file = path.resolve(ROOT, '.' + url);
      if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
        response.writeHead(403).end('Forbidden'); return;
      }
      try {
        if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        const body = fs.readFileSync(file);
        const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
          '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf' };
        response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
          'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        response.end(request.method === 'HEAD' ? undefined : body);
      } catch { response.writeHead(404).end('Not found'); }
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function reporter(filename) {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  const report = { identity: codeIdentity(), versions: {}, results: [] };
  const save = () => {
    report.summary = Object.fromEntries(['PASS', 'FAIL', 'BLOCKED'].map(status =>
      [status.toLowerCase(), report.results.filter(item => item.status === status).length]));
    fs.writeFileSync(path.join(EVIDENCE, filename), JSON.stringify(report, null, 2) + '\n');
  };
  async function check(engine, id, label, operation) {
    try {
      const detail = await operation();
      report.results.push({ engine, id, label, status: 'PASS', ...(detail === undefined ? {} : { detail }) });
      console.log(`PASS ${engine} ${id}: ${label}`);
    } catch (error) {
      report.results.push({ engine, id, label, status: 'FAIL', error: error.message, stack: error.stack });
      console.error(`FAIL ${engine} ${id}: ${error.message}`);
    }
    save();
  }
  function blocked(engine, message) {
    report.results.push({ engine, id: 'ENVIRONMENT', label: 'Browser launch', status: 'BLOCKED', error: message });
    save();
  }
  return { report, check, blocked, save };
}

async function noOverflow(page) {
  const geometry = await page.evaluate(() => ({ viewport: innerWidth,
    document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert.ok(geometry.document <= geometry.viewport + 1, JSON.stringify(geometry));
  return geometry;
}

async function axe(page) {
  if (!await page.evaluate(() => !!window.axe)) await page.evaluate(require('axe-core').source);
  return page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return result.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description,
      nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
  });
}

async function download(page, trigger, filename) {
  const [item] = await Promise.all([page.waitForEvent('download'), trigger()]);
  const target = path.join(EVIDENCE, filename);
  await item.saveAs(target);
  assert.equal(await item.failure(), null);
  return { file: target, suggested: item.suggestedFilename() };
}

module.exports = { ROOT, FOLDER, EVIDENCE, moduleFile, codeIdentity, startServer, reporter, noOverflow, axe, download };
