import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const source = process.argv[2];
const outputDir = process.argv[3];
if (!source || !path.isAbsolute(outputDir || '')) throw new Error('Usage: build-workbook.mjs SOURCE_DIRECTORY ABSOLUTE_OUTPUT_DIRECTORY');
const schema = JSON.parse(await fs.readFile(path.join(source, 'contracts/sheets-schema.json'), 'utf8'));
const seed = JSON.parse(await fs.readFile(path.join(source, 'fixtures/workbook-production.json'), 'utf8'));
assert.equal(seed.environment, 'PRODUCTION');
assert.equal(seed.contains_student_records, false);
const workbook = Workbook.create();
await fs.mkdir(outputDir, { recursive: true });
const verification = { schema_version: schema.schema_version, environment: 'PRODUCTION', records: {}, formula_checks: [], rendered: [] };
for (const table of schema.tables) workbook.worksheets.add(table.name);
for (const table of schema.tables) {
  const sheet = workbook.worksheets.getItem(table.name);
  const data = seed.tables[table.name];
  assert.deepEqual(data.headers, table.headers);
  verification.records[table.name] = data.rows.length;
  const rows = [table.headers, ...data.rows.map(record => table.headers.map(header => record[header] ?? null))];
  sheet.getRangeByIndexes(0, 0, rows.length, table.headers.length).values = rows;
  const area = sheet.getRangeByIndexes(0, 0, Math.max(rows.length, 2), table.headers.length);
  area.format = { fill: '#FFFFFF', font: { name: 'Arial', size: 11, color: '#202723' }, verticalAlignment: 'center', rowHeight: 28, columnWidth: 24 };
  const header = sheet.getRangeByIndexes(0, 0, 1, table.headers.length);
  header.format = { fill: '#E8EEEA', font: { name: 'Arial', size: 11, bold: true, color: '#183B2B' }, wrapText: true, rowHeight: 48, verticalAlignment: 'center', horizontalAlignment: 'left' };
  sheet.freezePanes.freezeRows(1);
  sheet.freezePanes.freezeColumns(1);
  sheet.showGridLines = false;
  if (table.name === 'Config' || table.name === 'Progresso') sheet.tabColor = '#255D3C';
  for (let c = 0; c < table.columns.length; c++) {
    const column = table.columns[c];
    const range = sheet.getRangeByIndexes(1, c, 200, 1);
    if (column.enum && column.enum.every(v => typeof v === 'string')) range.dataValidation = { rule: { type: 'list', values: column.enum } };
    if (column.type === 'number' || column.type === 'integer') range.setNumberFormat(column.type === 'integer' ? '0' : '0.00');
    if (['label', 'title', 'display_name', 'config_value', 'detail_code', 'justification', 'expected', 'actual'].includes(column.name)) {
      sheet.getRangeByIndexes(0, c, Math.max(rows.length, 2), 1).format.columnWidth = column.name === 'config_value' ? 34 : 44;
      if (rows.length > 1) sheet.getRangeByIndexes(1, c, rows.length - 1, 1).format.wrapText = true;
    }
    if (column.name.endsWith('_json') || column.name === 'source_evaluation_ids') sheet.getRangeByIndexes(0, c, Math.max(rows.length, 2), 1).format.columnWidth = 52;
  }
  if (table.name === 'Atividades') sheet.getRangeByIndexes(1, 0, rows.length - 1, table.headers.length).format.rowHeight = 62;
  if (table.name === 'Rubricas') sheet.getRangeByIndexes(1, 0, rows.length - 1, table.headers.length).format.rowHeight = 44;
  if (seed.formulas[table.name]) sheet.getRange('H2').formulas = [[seed.formulas[table.name].formula_template.replaceAll('{row}', '2')]];
}
const config = workbook.worksheets.getItem('Config');
const configRow = key => seed.tables.Config.rows.findIndex(r => r.config_key === key) + 2;
for (const [name, scores] of [['Notas_3a_Etapa', [2,3,5]], ['Notas_4a_Etapa', [2,4,4]]]) {
  const sheet = workbook.worksheets.getItem(name);
  const planVersion = seed.tables.Config.rows.find(r => r.config_key === 'plan_version').config_value;
  const original = sheet.getRange('A2:L2').values;
  sheet.getRange('A2:G2').values = [['QA-FORMULA-SYNTHETIC', scores[0], 'APROVADA', scores[1], 'APROVADA', scores[2], 'APROVADA']];
  sheet.getRange('I2:J2').values = [[planVersion, 'APROVADO']];
  assert.equal(sheet.getRange('H2').values[0][0], '');
  config.getRange(`B${configRow('plan_status')}`).values = [['APROVADO']];
  config.getRange(`B${configRow('plan_approval_ref')}`).values = [['QA-LOCAL-FORMULA-ONLY']];
  workbook.recalculate();
  assert.equal(sheet.getRange('H2').values[0][0], 10);
  sheet.getRange('B2').values = [[3]];
  assert.equal(sheet.getRange('H2').values[0][0], '');
  sheet.getRange('B2').values = [[scores[0]]];
  sheet.getRange('C2').values = [['PROPOSTA']];
  assert.equal(sheet.getRange('H2').values[0][0], '');
  sheet.getRange('C2').values = [['APROVADA']];
  sheet.getRange('D2').values = [[null]];
  assert.equal(sheet.getRange('H2').values[0][0], '');
  sheet.getRange('D2').values = [[0]];
  assert.equal(sheet.getRange('H2').values[0][0], scores[0] + scores[2]);
  config.getRange(`B${configRow('plan_status')}`).values = [['RASCUNHO']];
  assert.equal(sheet.getRange('H2').values[0][0], '');
  config.getRange(`B${configRow('plan_approval_ref')}`).values = [['']];
  sheet.getRange('A2:L2').clear({applyTo:'contents'});
  sheet.getRange('H2').formulas = [[seed.formulas[name].formula_template.replaceAll('{row}', '2')]];
  verification.formula_checks.push({sheet: name, max_total: 10, unapproved_blank: true, over_limit_blank: true, proposed_blank: true, absent_blank: true, approved_zero_retained: true, revoked_plan_blank: true});
}
workbook.recalculate();
const errors = await workbook.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},summary:'Production template formula verification'});
await fs.writeFile(path.join(outputDir, 'formula-inspection.ndjson'), errors.ndjson);
for (const table of schema.tables) {
  const rowCount = table.name === 'Config' ? seed.tables.Config.rows.length + 1 : Math.min(seed.tables[table.name].rows.length + 1, 8);
  const col = n => { let s=''; for(let v=n;v>0;v=Math.floor((v-1)/26)) s=String.fromCharCode(65+(v-1)%26)+s; return s; };
  const range = `A1:${col(table.headers.length)}${Math.max(3,rowCount)}`;
  const preview = await workbook.render({sheetName:table.name,range,scale:1,format:'png'});
  await fs.writeFile(path.join(outputDir, table.name+'.png'), new Uint8Array(await preview.arrayBuffer()));
  verification.rendered.push({sheet:table.name,range});
}
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outputDir, 'PPI-Laboratorio-Vivo-Producao-NOVO.xlsx'));
await fs.writeFile(path.join(outputDir, 'workbook-verification.json'), JSON.stringify(verification,null,2)+'\n');
console.log(JSON.stringify(verification));
