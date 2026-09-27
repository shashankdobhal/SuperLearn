/**
 * Converts the authored lesson files under src/content/lessons/** into
 * content_items + content_translations rows and upserts them into Postgres
 * (local dev DB by default, or DATABASE_URL — a hosted Supabase project's
 * connection string works here unchanged, since it's plain Postgres).
 *
 * Idempotent: re-running after editing a lesson file updates existing rows
 * instead of duplicating them.
 *
 * Usage:
 *   npx tsx scripts/db/migrate-lessons.ts
 *   DATABASE_URL=postgres://... npx tsx scripts/db/migrate-lessons.ts
 */
import { Client } from 'pg';

import skillsData from '../../content/curriculum/everyday-confidence/beginner/skills.json';
import { loadAllLessons } from '../lib/loadAllLessons';
import { insertContentRows } from './lib/insertRows';
import { lessonToRows } from './lib/toRows';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://localhost/supernova_dev';

async function main() {
  const LESSONS = await loadAllLessons();
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  const skillIdsUsed = new Set(LESSONS.map((l) => l.skillId));
  let skillCount = 0;
  for (const skill of skillsData as Array<{
    skill_id: string;
    skill: string;
    role: string;
    introduced_week: number;
    suggested_prerequisite_relationship: string;
  }>) {
    if (!skillIdsUsed.has(skill.skill_id)) continue;
    await client.query(
      `insert into skills (skill_id, label, role, introduced_week, prerequisite_note)
       values ($1, $2, $3, $4, $5)
       on conflict (skill_id) do update set
         label = excluded.label, role = excluded.role,
         introduced_week = excluded.introduced_week, prerequisite_note = excluded.prerequisite_note`,
      [skill.skill_id, skill.skill, skill.role, skill.introduced_week, skill.suggested_prerequisite_relationship],
    );
    skillCount++;
  }

  let itemCount = 0;
  let translationCount = 0;

  for (const lesson of LESSONS) {
    const { items, translations } = lessonToRows(lesson);
    const counts = await insertContentRows(client, items, translations);
    itemCount += counts.itemCount;
    translationCount += counts.translationCount;
  }

  await client.end();
  console.log(
    `Migrated ${LESSONS.length} lesson(s): ${skillCount} skill(s), ${itemCount} content_item(s), ${translationCount} translation(s).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
