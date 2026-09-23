/**
 * Generates content_translations rows for new locales by machine-translating
 * an existing locale's text. Idempotent — content_items that already have a
 * row for a target locale are skipped, so re-running only fills gaps (and
 * only spends API quota on what's actually missing).
 *
 * Usage:
 *   npx tsx scripts/db/translate.ts --locales ta,te
 *   npx tsx scripts/db/translate.ts --locales ta --source en --provider mock
 *   GOOGLE_TRANSLATE_API_KEY=... npx tsx scripts/db/translate.ts --locales ta,te,kn,bn
 *
 * Flags:
 *   --locales   required, comma-separated target locale codes
 *   --source    locale to translate FROM (default: hi)
 *   --provider  mock | google (default: google if GOOGLE_TRANSLATE_API_KEY is
 *               set, otherwise mock)
 */
import { Client } from 'pg';

import { makeGoogleProvider } from './providers/google';
import { mockProvider } from './providers/mock';
import type { TranslateProvider } from './providers/types';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://localhost/supernova_dev';

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };
  const localesArg = get('--locales');
  if (!localesArg) {
    console.error('Usage: tsx scripts/db/translate.ts --locales ta,te [--source hi] [--provider mock|google]');
    process.exit(1);
  }
  return {
    locales: localesArg.split(',').map((l) => l.trim()),
    source: get('--source') ?? 'hi',
    providerName: get('--provider'),
  };
}

function resolveProvider(providerName: string | undefined): TranslateProvider {
  if (providerName === 'mock') return mockProvider;
  if (providerName === 'google') {
    const key = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!key) throw new Error('GOOGLE_TRANSLATE_API_KEY is not set.');
    return makeGoogleProvider(key);
  }
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  return key ? makeGoogleProvider(key) : mockProvider;
}

async function main() {
  const { locales, source, providerName } = parseArgs();
  const provider = resolveProvider(providerName);
  console.log(`Provider: ${provider.name} | source locale: ${source} | target locales: ${locales.join(', ')}`);

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  let translated = 0;
  let skipped = 0;

  for (const target of locales) {
    const { rows } = await client.query<{ content_item_id: string; fields: Record<string, string> }>(
      `select ci.id as content_item_id, ct.fields
       from content_items ci
       join content_translations ct on ct.content_item_id = ci.id and ct.locale = $1
       where not exists (
         select 1 from content_translations existing
         where existing.content_item_id = ci.id and existing.locale = $2
       )`,
      [source, target],
    );

    for (const row of rows) {
      const translatedFields: Record<string, string> = {};
      for (const [key, value] of Object.entries(row.fields)) {
        translatedFields[key] = await provider.translate(value, target, source);
      }
      await client.query(
        `insert into content_translations (content_item_id, locale, fields, source)
         values ($1, $2, $3, 'machine')`,
        [row.content_item_id, target, translatedFields],
      );
      translated++;
    }
  }

  const { rows: existingCount } = await client.query('select count(*) from content_translations');
  skipped = Number(existingCount[0].count) - translated;

  await client.end();
  console.log(`Inserted ${translated} new translation row(s). ${skipped} row(s) already existed across all locales.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
