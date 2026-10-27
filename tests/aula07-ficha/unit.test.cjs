'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { moduleFile } = require('./harness.cjs');
const Model = require(moduleFile('model.js'));
const Rubric = require(moduleFile('rubric.js'));
const Export = require(moduleFile('export.js'));
const Storage = require(moduleFile('storage.js'));
const { completeFixture, partialFixture } = require('./fixtures.cjs');
const clone = value => JSON.parse(JSON.stringify(value));
const mission = (state, number) => Rubric.score(state).missions[number - 1];
const maxes = [10, 15, 20, 15, 20, 10, 10];

test('SCORE-01: empty worksheet is 0 XP / 0.0 and not started', () => {
  const result = Rubric.score(Model.createEmpty());
  assert.equal(result.xp, 0); assert.equal(Number(result.grade), 0);
  assert.equal(result.progress, 0); assert.equal(result.status, 'Não iniciada');
});

test('SCORE-02: seven mission maxima sum to exactly 100; stable criterion IDs are unique', () => {
  const result = Rubric.score(Model.createEmpty());
  assert.deepEqual(result.missions.map(item => item.max), maxes);
  assert.equal(result.missions.reduce((sum, item) => sum + item.max, 0), 100);
  const all = result.missions.flatMap(item => item.criteria);
  assert.equal(new Set(all.map(item => item.id)).size, all.length);
  assert.ok(all.every(item => typeof item.id === 'string' && item.id.length > 0 && item.weight > 0));
  for (const item of result.missions) assert.equal(item.criteria.reduce((sum, c) => sum + c.weight, 0), item.max);
});

for (const track of ['memorias', 'permanencia']) {
  test(`SCORE-03-${track}: independent full fixture reaches 100 and 10.0`, () => {
    const state = Model.validateImport(completeFixture(track));
    const result = Rubric.score(state);
    assert.equal(result.xp, 100); assert.equal(Number(result.grade), 10);
    assert.equal(result.progress, 100); assert.equal(result.status, 'Completa para revisão');
    assert.deepEqual(result.missions.map(item => item.xp), maxes);
    assert.equal(result.pending.length, 0);
  });
}

for (let number = 1; number <= 7; number++) {
  test(`SCORE-04-M${number}: mission never exceeds its ceiling and reset removes its points only`, () => {
    const state = completeFixture();
    assert.equal(mission(state, number).xp, maxes[number - 1]);
    const reset = Model.resetMission(state, number);
    assert.equal(mission(reset, number).xp, 0);
    assert.equal(Rubric.score(reset).xp, 100 - maxes[number - 1]);
    assert.equal(Rubric.score(state).xp, 100, 'reset must not mutate the input state');
  });
}

test('SCORE-05: deleting or replacing a scored answer with whitespace reduces score immediately', () => {
  const state = completeFixture(); state.m1.objective = '';
  assert.equal(Rubric.score(state).xp, 98);
  state.m1.objective = ' \n\t ';
  assert.equal(Rubric.score(state).xp, 98);
  state.m1.objective = 'Resposta sintética';
  assert.equal(Rubric.score(state).xp, 100);
});

test('SCORE-06: whitespace-only answers cannot earn mission points', () => {
  const state = Model.createEmpty();
  const fill = value => {
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string' && !['id', 'role', 'category', 'kind', 'answer', 'type', 'classification', 'confidence', 'used'].includes(key)) value[key] = ' \t\n ';
      else if (value[key] && typeof value[key] === 'object') fill(value[key]);
    }
  };
  for (let n = 1; n <= 6; n++) fill(state['m' + n]);
  assert.equal(Rubric.score(state).xp, 0);
});

test('SCORE-07: selecting ethical answers without decisions/mitigation earns no ethical credit', () => {
  const state = Model.createEmpty();
  for (const key of ['authorization', 'explained', 'refusal', 'recording', 'personal', 'substitution', 'ai']) state.m4[key].answer = 'yes';
  assert.equal(mission(state, 4).xp, 0);
});

test('SCORE-08: testing mission cannot reach full points without explicit post-test revision', () => {
  const state = completeFixture();
  for (const key of ['change', 'reason', 'before', 'after', 'summary']) state.m5[key] = '';
  assert.equal(mission(state, 5).xp, 16);
});

test('SCORE-09: a duplicate complementary technique cannot satisfy triangulation', () => {
  const state = completeFixture(); state.m2.techniques[1].kind = 'entrevista';
  assert.ok(mission(state, 2).xp < 15);
});

test('SCORE-10: questionnaire cannot replace the principal core technique', () => {
  const state = completeFixture(); state.m2.techniques[0].kind = 'questionario';
  assert.ok(mission(state, 2).xp < 15);
});

test('SCORE-11: missing interview purpose/category and unsupported finding reduce credit', () => {
  const state = completeFixture(); state.m3.questions[0].purpose = ' ';
  assert.ok(mission(state, 3).xp < 20);
  const state2 = completeFixture(); state2.m3.questions[0].category = '';
  assert.ok(mission(state2, 3).xp < 20);
  const state3 = completeFixture(); state3.m6.records[0].source = ' ';
  assert.ok(mission(state3, 6).xp < 10);
});

test('SCORE-12: no AI is optional and carries no point penalty', () => {
  const state = completeFixture(); const before = Rubric.score(state).xp;
  state.m3.ai.used = ''; assert.equal(Rubric.score(state).xp, before);
  state.m3.ai.used = 'yes'; assert.equal(Rubric.score(state).xp, before);
});

test('SCORE-13: every discovery field and every observation/document field affects its declared criterion',()=>{
  for(const field of ['objective','need','decision','source','assumption']) {
    const state=completeFixture(); state.m1[field]=' ';
    assert.equal(mission(state,1).xp,8,field);
  }
  for(const field of ['activity','boundaries','people','tools','transfers','delays','practice','record']) {
    const state=completeFixture(); state.m3.observation[field]='';
    assert.equal(mission(state,3).xp,14,'observation.'+field);
  }
  for(const field of ['name','author','version','purpose','terms','rules','gaps','restrictions','unanswered']) {
    const state=completeFixture(); state.m3.document[field]='';
    assert.equal(mission(state,3).xp,14,'document.'+field);
  }
});

test('SCORE-14: questionnaire is accepted as complementary; interview upper/lower bounds are enforced',()=>{
  const state=completeFixture(); state.m2.techniques[1].kind='questionario';
  assert.equal(mission(state,2).xp,15);
  const eight=completeFixture(); eight.m3.questions.splice(6,0,{id:'q-extra',category:'contexto',text:'Como verificar outro aspecto?',purpose:'Aprofundar o contexto.'});
  assert.equal(mission(eight,3).xp,20); assert.doesNotThrow(()=>Model.validateImport(eight));
  const nine=clone(eight); nine.m3.questions.splice(7,0,{...eight.m3.questions[6],id:'q-extra-2'});
  assert.throws(()=>Model.validateImport(nine),/quantidade/i);
  const five=completeFixture(); five.m3.questions=five.m3.questions.slice(0,5);
  assert.throws(()=>Model.validateImport(five),/quantidade/i);
});

test('SCORE-15: missing ethical access/provenance/mitigation text or simulation roles reduces the expected group',()=>{
  for(const field of ['access','validator','citation','publication','risks','mitigation']) {
    const state=completeFixture(); state.m4[field]=''; assert.equal(mission(state,4).xp,12,field);
  }
  const state=completeFixture(); state.m5.roles=''; assert.equal(mission(state,5).xp,16);
});

test('SCORE-16: confidence labels carry equal points; missing required evidence classes remain pending',()=>{
  const state=completeFixture(); state.m6.records.forEach(item=>{item.confidence='baixa';});
  assert.equal(mission(state,6).xp,10);
  for(const classification of ['achado','hipotese','pendencia']) {
    const partial=completeFixture(); partial.m6.records=partial.m6.records.filter(item=>item.classification!==classification);
    assert.equal(mission(partial,6).xp,8,classification);
  }
});

test('TEAM-01: authorship proportional to active member completion; zero members = zero authorship', () => {
  const state = completeFixture();
  for (const key of ['contribution', 'improvement', 'risk', 'learning']) state.members[1][key] = '';
  state.members[1].reviewed = false;
  assert.equal(mission(state, 7).xp, 5);
  assert.deepEqual(Rubric.score(state).authors.map(item => item.complete), [5, 0]);
  state.members = []; assert.equal(mission(state, 7).xp, 0);
});

test('TEAM-02: renaming a member preserves ID/authorship; removing clears only dependent references', () => {
  const state = completeFixture(); const originalID = state.members[0].id;
  state.members[0].name = 'Apelido acadêmico sintético';
  assert.equal(state.members[0].id, originalID); assert.equal(mission(state, 7).xp, 10);
  state.m3.ai.validator = originalID;
  const result = Model.removeMember(state, originalID);
  assert.equal(result.members.length, 1); assert.equal(result.members[0].id, 'm-qa-2');
  assert.equal(result.m2.techniques[0].responsible, ''); assert.equal(result.m3.ai.validator, '');
  assert.deepEqual(result.m5.participants, ['m-qa-2']);
  assert.equal(result.members[0].contribution, state.members[1].contribution);
  assert.doesNotThrow(() => Model.validateImport(result));
});

test('TRACK-01: changing track preserves only compatible identification, clears all task content/authorship', () => {
  const state = completeFixture(); const next = Model.switchTrack(state, 'permanencia');
  assert.equal(next.team.track, 'permanencia'); assert.equal(next.team.name, state.team.name);
  assert.deepEqual(next.members.map(({ id, name, role }) => ({ id, name, role })), state.members.map(({ id, name, role }) => ({ id, name, role })));
  assert.equal(Rubric.score(next).xp, 0); assert.equal(Rubric.score(state).xp, 100);
  assert.equal(next.m1.objective, ''); assert.equal(next.members[0].contribution, '');
  assert.deepEqual(Rubric.score(next).missions.map(item => item.max), maxes);
});

test('TRACK-02: selecting the same track preserves all answers', () => {
  const state = completeFixture(); assert.deepEqual(Model.switchTrack(state, 'memorias'), state);
});

test('TRACK-03: zero-XP unfinished answers still count as content at risk of track switching',()=>{
  const empty=Model.createEmpty(); assert.equal(Model.hasMissionResponses(empty),false);
  empty.m3.questions[0].text='Pergunta sintética ainda sem categoria/finalidade.';
  assert.equal(Rubric.score(empty).xp,0); assert.equal(Model.hasMissionResponses(empty),true);
});

test('IMPORT-01: complete and partial JSON round-trip without trusting saved points', () => {
  for (const state of [completeFixture(), partialFixture()]) {
    const encoded = Export.exportJSON(state);
    assert.equal(typeof encoded, 'string');
    const imported = Model.validateImport(encoded);
    assert.deepEqual(imported, state);
    const tampered = JSON.parse(encoded); tampered.score = { xp: 1000000, grade: 9999, status: 'Aprovada' };
    const safe = Model.validateImport(tampered);
    assert.deepEqual(safe, state); assert.equal(Rubric.score(safe).xp, Rubric.score(state).xp);
  }
});

test('IMPORT-02: malformed JSON, unknown version, missing field and unexpected property are rejected', () => {
  assert.throws(() => Model.validateImport('{broken'), /JSON|válido/i);
  const version = completeFixture(); version.schemaVersion = '999.0';
  assert.throws(() => Model.validateImport(version), /versão/i);
  const missing = completeFixture(); delete missing.m1;
  assert.throws(() => Model.validateImport(missing), /ausente/i);
  const extra = completeFixture(); extra.m1.unexpected = 'untrusted';
  assert.throws(() => Model.validateImport(extra), /inesperada/i);
});

test('IMPORT-03: dangerous prototype properties are rejected at every depth', () => {
  for (const key of ['__proto__', 'prototype', 'constructor']) {
    const input = JSON.parse(JSON.stringify(completeFixture()));
    Object.defineProperty(input.m1, key, { value: { polluted: true }, enumerable: true });
    assert.throws(() => Model.validateImport(JSON.stringify(input)), /perigosa/i);
  }
  assert.equal({}.polluted, undefined);
});

test('IMPORT-04: oversized, excessively deep and excessively long text imports are rejected', () => {
  assert.throws(() => Model.validateImport(' '.repeat(Model.MAX_BYTES + 1)), /512 KB|maior/i);
  const deep = completeFixture(); let cursor = deep;
  for (let n = 0; n < Model.MAX_DEPTH + 2; n++) { cursor.extra = {}; cursor = cursor.extra; }
  assert.throws(() => Model.validateImport(deep), /profundidade/i);
  const long = completeFixture(); long.m1.objective = 'x'.repeat(Model.MAX_TEXT + 1);
  assert.throws(() => Model.validateImport(long), /longo/i);
});

test('IMPORT-05: duplicate IDs, unknown member references, invalid enums and wrong primitive types are rejected', () => {
  const duplicate = completeFixture(); duplicate.members[1].id = duplicate.members[0].id;
  assert.throws(() => Model.validateImport(duplicate), /duplicados/i);
  const reference = completeFixture(); reference.m2.techniques[0].responsible = 'm-missing';
  assert.throws(() => Model.validateImport(reference), /inexistente/i);
  const invalid = completeFixture(); invalid.m6.records[0].confidence = 'certeza-absoluta';
  assert.throws(() => Model.validateImport(invalid), /opção/i);
  const wrong = completeFixture(); wrong.team.declaration = 'true';
  assert.throws(() => Model.validateImport(wrong), /booleano/i);
});

test('IMPORT-06: optional repository only accepts safe HTTPS URLs and rejects credentials/active schemes', () => {
  for (const value of ['', 'https://example.org/repo']) assert.equal(Model.validURL(value), true);
  for (const value of ['javascript:alert(1)', 'data:text/html,unsafe', 'http://example.org/repo', 'https://user:password@example.org/repo', 'not a url']) assert.equal(Model.validURL(value), false);
});

test('IMPORT-07: real calendar dates are validated', () => {
  const state = completeFixture(); state.team.date = '2026-02-30';
  assert.throws(() => Model.validateImport(state), /data/i);
});

test('RESET-01: total reset returns zero and cannot mutate prior answers', () => {
  const full = completeFixture(); const clean = Model.resetAll();
  assert.equal(Rubric.score(clean).xp, 0); assert.equal(Rubric.score(full).xp, 100);
});

test('STORAGE-01: local save/reload validates and resumes the same answers', () => {
  const memory = new Map();
  const storage = { setItem: (key, value) => memory.set(key, value), getItem: key => memory.get(key) || null };
  const state = completeFixture(); assert.equal(Storage.save(state, storage).ok, true);
  const loaded = Storage.load(storage); assert.equal(loaded.ok, true); assert.deepEqual(loaded.state, state);
  assert.equal(Rubric.score(loaded.state).xp, 100);
});

test('STORAGE-02: quota/unavailable storage returns actionable error without losing in-memory answers', () => {
  const state = completeFixture();
  const storage = { setItem() { throw Error('QuotaExceededError'); }, getItem() { throw Error('SecurityError'); } };
  const saved = Storage.save(state, storage); assert.equal(saved.ok, false); assert.match(saved.message, /JSON/i);
  const loaded = Storage.load(storage); assert.equal(loaded.ok, false); assert.equal(loaded.state, null);
  assert.equal(Rubric.score(state).xp, 100);
});

test('STORAGE-03: corrupt local payload is rejected and is not overwritten', () => {
  const raw = '{corrupt'; let writes = 0;
  const storage = { getItem() { return raw; }, setItem() { writes++; } };
  const result = Storage.load(storage); assert.equal(result.ok, false); assert.equal(result.state, null);
  assert.equal(writes, 0); assert.match(result.message, /preservado/i);
});

test('STORAGE-04: an invalid draft repository URL cannot erase other locally saved answers', () => {
  const state = completeFixture(); state.team.repository = 'https://unfinished';
  const memory = new Map(); const storage = { setItem:(k,v)=>memory.set(k,v), getItem:k=>memory.get(k)||null };
  assert.equal(Storage.save(state, storage).ok, true);
  const loaded=Storage.load(storage); assert.equal(loaded.ok,true); assert.deepEqual(loaded.state,state);
  assert.throws(()=>Model.validateImport(state),/HTTPS/i);
});

test('EXPORT-01: partial Markdown states pending criteria and separates official assessment', () => {
  const markdown = Export.exportMarkdown(partialFixture());
  assert.match(markdown.replace(/\\_/g, '_'), /QA_PARTIAL_RESPONSE_MARKER/);
  assert.match(markdown, /pend[eê]n/i); assert.match(markdown, /PPI1-3B/);
  assert.match(markdown, /Pontuação automática de completude e processo/);
  assert.match(markdown, /Aula 08/);
});

test('EXPORT-02: Markdown and filenames neutralize hostile markup and path delimiters', () => {
  const state = partialFixture(); state.team.name = '../../<script>alert(1)</script>\\unsafe';
  state.m1.objective = '<img src=x onerror=alert(1)> [click](javascript:alert(2))';
  const markdown = Export.exportMarkdown(state);
  assert.doesNotMatch(markdown, /<img\s|<script>|\]\(javascript:/i);
  const name = Export.filename(state, 'json');
  assert.doesNotMatch(name, /[\\/<>:"|?*]/); assert.ok(name.endsWith('.json'));
});

test('EXPORT-03: JSON retains text safely; content is data, never executable', () => {
  const state = partialFixture(); state.m1.objective = '<script>window.pwned=true</script>';
  const safe = Model.validateImport(Export.exportJSON(state));
  assert.equal(safe.m1.objective, state.m1.objective);
});

test('SCHEMA-01: versioned JSON schema is published and restricts unknown properties', () => {
  const schema = JSON.parse(fs.readFileSync(moduleFile('schema.json'), 'utf8'));
  assert.ok(schema.$schema); assert.ok(schema.properties.schemaVersion);
  assert.equal(schema.additionalProperties, false);
});

test('PRIVACY-01: production modules have no dynamic-code or network submission primitives', () => {
  const files = fs.readdirSync(moduleFile('')).filter(file => file.endsWith('.js'));
  for (const file of files) {
    const source = fs.readFileSync(moduleFile(file), 'utf8');
    assert.doesNotMatch(source, /\beval\s*\(|new\s+Function\s*\(|\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/, file);
  }
});
