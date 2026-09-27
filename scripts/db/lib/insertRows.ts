import type { Client } from 'pg';

import type { ContentItemRow, TranslationRow } from './toRows';

/**
 * Upserts content_items + content_translations rows — the shared write path
 * for both scripts/db/migrate-lessons.ts (src/content/lessons/**.ts) and
 * scripts/db/import-tasks-xlsx.ts (a filled Tasks sheet). Both end at the
 * same two tables (see docs/CONTENT_AUTHORING_TEMPLATE.md), so the insert
 * logic lives in one place rather than being copy-pasted per source format.
 */
export async function insertContentRows(
  client: Client,
  items: ContentItemRow[],
  translations: TranslationRow[],
): Promise<{ itemCount: number; translationCount: number }> {
  // content_items' id is DB-generated; look it up by the (week, day,
  // quest_index, task_index) unique key so translations can reference it
  // in the same pass.
  const idByKey = new Map<string, string>();

  let itemCount = 0;
  for (const item of items) {
    const result = await client.query<{ id: string }>(
      `insert into content_items (week, day, quest_index, task_index, task_type, skill_id, payload)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (week, day, quest_index, task_index) do update set
         task_type = excluded.task_type, skill_id = excluded.skill_id, payload = excluded.payload
       returning id`,
      [item.week, item.day, item.questIndex, item.taskIndex, item.taskType, item.skillId, item.payload],
    );
    idByKey.set(`${item.week}-${item.day}-${item.questIndex}-${item.taskIndex}`, result.rows[0].id);
    itemCount++;
  }

  let translationCount = 0;
  for (const t of translations) {
    const contentItemId = idByKey.get(`${t.week}-${t.day}-${t.questIndex}-${t.taskIndex}`);
    if (!contentItemId) throw new Error(`No content_item id for ${JSON.stringify(t)}`);
    await client.query(
      `insert into content_translations (content_item_id, locale, fields, source)
       values ($1, $2, $3, $4)
       on conflict (content_item_id, locale) do update set
         fields = excluded.fields, source = excluded.source, updated_at = now()`,
      [contentItemId, t.locale, t.fields, t.source ?? 'human'],
    );
    translationCount++;
  }

  return { itemCount, translationCount };
}
