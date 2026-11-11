const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const schema = read('contracts/sheets-schema.json');
const production = read('fixtures/workbook-production.json');
const qa = read('fixtures/workbook-qa-delta.json');
const catalog = read('fixtures/catalogo.json');

test('schema has unique tables, stable keys and valid foreign-key targets', () => {
  assert.equal(schema.tables.length, 15);
  assert.equal(new Set(schema.tables.map(t => t.name)).size, 15);
  for (const table of schema.tables) {
    assert.equal(new Set(table.headers).size, table.headers.length);
    assert.deepEqual(table.columns.map(c => c.name), table.headers);
    for (const key of table.primary_key) assert.ok(table.headers.includes(key));
    for (const foreign of table.foreign_keys || []) {
      const target = schema.tables.find(t => t.name === foreign.references.table);
      assert.ok(target);
      for (const key of foreign.references.columns) assert.ok(target.headers.includes(key));
    }
  }
});

test('production starts with disabled access, draft plan and no educational records', () => {
  assert.equal(production.environment, 'PRODUCTION');
  assert.equal(production.contains_student_records, false);
  const cfg = Object.fromEntries(production.tables.Config.rows.map(r => [r.config_key, String(r.config_value)]));
  assert.equal(cfg.environment, 'PRODUCTION');
  assert.equal(cfg.writes_enabled, 'false');
  assert.equal(cfg.student_access_enabled, 'false');
  assert.equal(cfg.plan_status, 'RASCUNHO');
  assert.equal(cfg.plan_approval_ref, '');
  assert.equal(cfg.spreadsheet_id, '');
  assert.equal(cfg.binding_nonce, '');
  assert.equal(cfg.timezone, 'America/Fortaleza');
  for (const table of schema.tables) {
    assert.deepEqual(production.tables[table.name].headers, table.headers);
    if (!['Config', 'Atividades', 'Rubricas'].includes(table.name)) assert.equal(production.tables[table.name].rows.length, 0, table.name);
  }
  assert.ok(production.tables.Atividades.rows.every(r => r.status === 'RASCUNHO'));
  assert.ok(production.tables.Rubricas.rows.every(r => r.status === 'RASCUNHO'));
});

test('QA delta is isolated, synthetic and does not claim a connected pass', () => {
  assert.equal(qa.environment, 'QA');
  assert.equal(qa.synthetic, true);
  assert.equal(qa.config_overrides.writes_enabled, 'false');
  assert.equal(qa.config_overrides.student_access_enabled, 'false');
  assert.equal(qa.config_overrides.spreadsheet_id, '');
  assert.equal(qa.config_overrides.binding_nonce, '');
  assert.equal(qa.tables.Equipes.length, 2);
  assert.equal(qa.tables.Participantes.length, 2);
  for (const p of qa.tables.Participantes) {
    assert.match(p.display_name, /fictício/);
    assert.ok(qa.tables.Equipes.some(t => t.team_id === p.team_id));
    assert.ok(!Object.keys(p).some(k => /email|cpf|matricula|token|password/i.test(k)));
  }
  assert.ok(qa.tables.Verificacao_QA.every(r => r.status === 'NOT_RUN'));
});

test('draft institutional rubrics reconcile to 2+3+5 and 2+4+4 without formative XP', () => {
  const expected = {'PPI1-3A':2,'PPI1-3B':3,'PPI1-3C':5,'PPI1-4A':2,'PPI1-4B':4,'PPI1-4C':4};
  const activities = production.tables.Atividades.rows;
  const rubrics = production.tables.Rubricas.rows;
  for (const [id, max] of Object.entries(expected)) {
    const activity = activities.find(a => a.activity_id === id);
    assert.equal(activity.kind, 'OFICIAL');
    assert.equal(activity.official_max, max);
    assert.equal(activity.xp_max, 0);
    const criteria = rubrics.filter(r => r.activity_id === id);
    assert.ok(criteria.length > 0);
    assert.ok(Math.abs(criteria.reduce((v, r) => v + r.max_points, 0) - max) < 1e-9);
    assert.ok(criteria.every(r => r.evaluation_type === 'DOCENTE_OFICIAL' && r.status === 'RASCUNHO'));
  }
  const formative = activities.find(a => a.activity_id === 'AULA08-FORMATIVA');
  assert.equal(formative.kind, 'FORMATIVA');
  assert.equal(formative.official_max, null);
  assert.equal(formative.official_item_id, '');
  assert.equal(formative.xp_max, 100);
});

test('Apps Script repository headers match the authoritative sheet contract', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'apps-script/Schema.gs'), 'utf8'), context);
  const headers = vm.runInContext('JSON.stringify(Object.fromEntries(Object.entries(LV_TABLES_).map(([name, table]) => [name, table.headers])))', context);
  assert.deepEqual(JSON.parse(headers), Object.fromEntries(schema.tables.map(t => [t.name, t.headers])));
});

test('Apps Script deployment is owner-only and contains no public anonymous writer', () => {
  const manifest = read('apps-script/appsscript.json');
  assert.equal(manifest.timeZone, 'America/Fortaleza');
  assert.equal(manifest.webapp.access, 'MYSELF');
  assert.equal(manifest.webapp.executeAs, 'USER_DEPLOYING');
  assert.equal(manifest.exceptionLogging, 'NONE');
  assert.ok(!manifest.oauthScopes.some(scope => /drive|gmail|external_request/.test(scope)));
});
