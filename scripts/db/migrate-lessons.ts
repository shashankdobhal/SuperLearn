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
import { week01Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-01';
import { week01Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-02';
import { week01Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-03';
import { week01Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-04';
import { week01Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-05';
import { week01Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-06';
import { week01Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-07';
import { week02Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-01';
import { week02Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-02';
import { week02Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-03';
import { week02Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-04';
import { week02Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-05';
import { week02Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-06';
import { week02Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-07';
import { week03Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-01';
import { week03Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-02';
import { week03Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-03';
import { week03Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-04';
import { week03Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-05';
import { week03Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-06';
import { week03Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-07';
import { week04Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-01';
import { week04Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-02';
import { week04Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-03';
import { week04Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-04';
import { week04Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-05';
import { week04Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-06';
import { week04Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-07';
import { lessonToRows } from './lib/toRows';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://localhost/supernova_dev';

const LESSONS = [
  week01Day01, week01Day02, week01Day03, week01Day04, week01Day05, week01Day06, week01Day07,
  week02Day01, week02Day02, week02Day03, week02Day04, week02Day05, week02Day06, week02Day07,
  week03Day01, week03Day02, week03Day03, week03Day04, week03Day05, week03Day06, week03Day07,
  week04Day01, week04Day02, week04Day03, week04Day04, week04Day05, week04Day06, week04Day07,
];

async function main() {
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

    // content_items id is generated by the DB; look it up by the
    // (week, day, quest_index, task_index) unique key so translations can
    // reference it in the same pass.
    const idByKey = new Map<string, string>();

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

    for (const t of translations) {
      const contentItemId = idByKey.get(`${t.week}-${t.day}-${t.questIndex}-${t.taskIndex}`);
      if (!contentItemId) throw new Error(`No content_item id for ${JSON.stringify(t)}`);
      await client.query(
        `insert into content_translations (content_item_id, locale, fields, source)
         values ($1, $2, $3, 'human')
         on conflict (content_item_id, locale) do update set
           fields = excluded.fields, updated_at = now()`,
        [contentItemId, t.locale, t.fields],
      );
      translationCount++;
    }
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
