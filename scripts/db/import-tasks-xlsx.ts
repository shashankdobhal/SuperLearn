/**
 * Imports a filled-in Tasks sheet (docs/templates/supernova_content_template.xlsx)
 * straight into content_items + content_translations — the human/Excel
 * counterpart to scripts/db/migrate-lessons.ts (which reads
 * src/content/lessons/**.ts instead). See
 * docs/CONTENT_AUTHORING_TEMPLATE.md for the full design and why this
 * exists as a second, independent way to author courses (no LLM, no
 * Claude Code session involved at all).
 *
 * Always re-validates the sheet first via
 * scripts/templates/validate_tasks_xlsx.py — that script is the actual
 * source of truth for "is this sheet safe to import" (cell locking in the
 * .xlsx itself is only a soft deterrent, see
 * docs/CONTENT_AUTHORING_TEMPLATE.md's "Why v1 needed a v2"), and this
 * importer refuses to write anything if it reports even one failure.
 *
 * Usage:
 *   npx tsx scripts/db/import-tasks-xlsx.ts path/to/filled.xlsx
 *   DATABASE_URL=postgres://... npx tsx scripts/db/import-tasks-xlsx.ts path/to/filled.xlsx
 */
import { spawnSync } from 'child_process';
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { Client } from 'pg';

import { xlsxRowsToRows, type XlsxTaskRow } from './lib/fromXlsxRow';
import { insertContentRows } from './lib/insertRows';

const REPO = path.join(__dirname, '..', '..');
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://localhost/supernova_dev';

function validateAndDump(xlsxPath: string): XlsxTaskRow[] {
  const workDir = mkdtempSync(path.join(tmpdir(), 'supernova-import-'));
  const jsonOut = path.join(workDir, 'rows.json');
  try {
    console.log(`Validating ${xlsxPath} (scripts/templates/validate_tasks_xlsx.py)...\n`);
    const result = spawnSync('python3', ['scripts/templates/validate_tasks_xlsx.py', xlsxPath, '--json-out', jsonOut], {
      cwd: REPO,
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      console.log('\nImport aborted — fix the failures above and re-validate before importing anything.');
      process.exit(1);
    }
    return JSON.parse(readFileSync(jsonOut, 'utf-8')) as XlsxTaskRow[];
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

async function main() {
  const xlsxPath = process.argv[2];
  if (!xlsxPath) {
    console.error('Usage: npx tsx scripts/db/import-tasks-xlsx.ts path/to/filled.xlsx');
    process.exit(1);
  }

  const rows = validateAndDump(xlsxPath);
  const { items, translations } = xlsxRowsToRows(rows);

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { itemCount, translationCount } = await insertContentRows(client, items, translations);
  await client.end();

  const slots = new Set(items.map((i) => `${i.week}-${i.day}-${i.questIndex}`)).size;
  console.log(`\nImported ${itemCount} content_item(s) (${translationCount} translation(s)) across ${slots} quest slot(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
