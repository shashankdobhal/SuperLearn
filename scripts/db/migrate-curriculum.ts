/**
 * Loads the FULL curriculum blueprint — all 50 weeks / 350 days, the quest
 * type library, speaking rubric and design rules — from
 * content/curriculum/everyday-confidence/beginner/*.json into Postgres.
 *
 * Distinct from migrate-lessons.ts: this is the blueprint (which quests
 * exist, in what order, what each day is about) parsed straight from the
 * source workbook — it doesn't require authoring anything, so unlike lesson
 * content it can all be loaded in one shot. See docs/CONTENT_DATABASE.md.
 *
 * Usage: npm run db:migrate:curriculum
 */
import { Client } from 'pg';

import daysData from '../../content/curriculum/everyday-confidence/beginner/days.json';
import designRulesData from '../../content/curriculum/everyday-confidence/beginner/design-rules.json';
import questTypesData from '../../content/curriculum/everyday-confidence/beginner/quest-types.json';
import skillsData from '../../content/curriculum/everyday-confidence/beginner/skills.json';
import speakingRubricData from '../../content/curriculum/everyday-confidence/beginner/speaking-rubric.json';
import weeksData from '../../content/curriculum/everyday-confidence/beginner/weeks.json';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://localhost/supernova_dev';

// Only track that exists today — see docs/CURRICULUM_DATA.md.
const PERSONA = 'everyday-confidence';
const LEVEL = 'beginner';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  let weekCount = 0;
  for (const w of weeksData as Array<{
    week: number;
    week_arc: string;
    weekly_outcome: string;
    speaking_mission: string;
    primary_language_support: string;
  }>) {
    await client.query(
      `insert into weeks (persona, level, week, week_arc, weekly_outcome, speaking_mission, primary_language_support)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (persona, level, week) do update set
         week_arc = excluded.week_arc, weekly_outcome = excluded.weekly_outcome,
         speaking_mission = excluded.speaking_mission,
         primary_language_support = excluded.primary_language_support`,
      [PERSONA, LEVEL, w.week, w.week_arc, w.weekly_outcome, w.speaking_mission, w.primary_language_support],
    );
    weekCount++;
  }

  let dayCount = 0;
  for (const d of daysData as Array<Record<string, unknown>>) {
    await client.query(
      `insert into days (
         persona, level, week, day, week_arc, weekly_outcome, daily_mini_outcome, activity_mix,
         revision, quest_count, quest_1, quest_1_type, quest_2, quest_2_type, quest_3, quest_3_type,
         quest_4, quest_4_type, tasks_quest, repeat_track, primary_skills, grammar_language_focus,
         vocabulary_context, speaking_evidence, estimated_minutes
       ) values (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
       )
       on conflict (persona, level, week, day) do update set
         week_arc = excluded.week_arc, weekly_outcome = excluded.weekly_outcome,
         daily_mini_outcome = excluded.daily_mini_outcome, activity_mix = excluded.activity_mix,
         revision = excluded.revision, quest_count = excluded.quest_count,
         quest_1 = excluded.quest_1, quest_1_type = excluded.quest_1_type,
         quest_2 = excluded.quest_2, quest_2_type = excluded.quest_2_type,
         quest_3 = excluded.quest_3, quest_3_type = excluded.quest_3_type,
         quest_4 = excluded.quest_4, quest_4_type = excluded.quest_4_type,
         tasks_quest = excluded.tasks_quest, repeat_track = excluded.repeat_track,
         primary_skills = excluded.primary_skills, grammar_language_focus = excluded.grammar_language_focus,
         vocabulary_context = excluded.vocabulary_context, speaking_evidence = excluded.speaking_evidence,
         estimated_minutes = excluded.estimated_minutes`,
      [
        PERSONA,
        LEVEL,
        d.week,
        d.day,
        d.week_arc,
        d.weekly_outcome,
        d.daily_mini_outcome,
        d.activity_mix,
        d.revision === 'Yes',
        d.quest_count,
        d.quest_1,
        d.quest_1_type,
        d.quest_2,
        d.quest_2_type,
        d.quest_3,
        d.quest_3_type,
        d.quest_4,
        d.quest_4_type,
        d.tasks_quest,
        d.repeat_track,
        d.primary_skills,
        d.grammar_language_focus,
        d.vocabulary_context,
        d.speaking_evidence,
        d.estimated_minutes,
      ],
    );
    dayCount++;
  }

  let skillCount = 0;
  for (const s of skillsData as Array<{
    skill_id: string;
    skill: string;
    role: string;
    introduced_week: number;
    suggested_prerequisite_relationship: string;
  }>) {
    await client.query(
      `insert into skills (skill_id, label, role, introduced_week, prerequisite_note)
       values ($1, $2, $3, $4, $5)
       on conflict (skill_id) do update set
         label = excluded.label, role = excluded.role,
         introduced_week = excluded.introduced_week, prerequisite_note = excluded.prerequisite_note`,
      [s.skill_id, s.skill, s.role, s.introduced_week, s.suggested_prerequisite_relationship],
    );
    skillCount++;
  }

  let questTypeCount = 0;
  for (const q of questTypesData as Array<{
    quest_type: string;
    purpose: string;
    typical_task_count: string;
    example_task_mix: string;
    speaking_role: string;
    repeat_track_behaviour: string;
  }>) {
    await client.query(
      `insert into quest_types (quest_type, purpose, typical_task_count, example_task_mix, speaking_role, repeat_track_behaviour)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (quest_type) do update set
         purpose = excluded.purpose, typical_task_count = excluded.typical_task_count,
         example_task_mix = excluded.example_task_mix, speaking_role = excluded.speaking_role,
         repeat_track_behaviour = excluded.repeat_track_behaviour`,
      [q.quest_type, q.purpose, q.typical_task_count, q.example_task_mix, q.speaking_role, q.repeat_track_behaviour],
    );
    questTypeCount++;
  }

  let rubricCount = 0;
  for (const r of speakingRubricData as Array<{
    dimension: string;
    what_supernova_evaluates: string;
    beginner_target_by_week_50: string;
  }>) {
    await client.query(
      `insert into speaking_rubric (persona, level, dimension, what_supernova_evaluates, target_description)
       values ($1, $2, $3, $4, $5)
       on conflict (persona, level, dimension) do update set
         what_supernova_evaluates = excluded.what_supernova_evaluates,
         target_description = excluded.target_description`,
      [PERSONA, LEVEL, r.dimension, r.what_supernova_evaluates, r.beginner_target_by_week_50],
    );
    rubricCount++;
  }

  let ruleCount = 0;
  for (const r of designRulesData as Array<{ rule: string; specification: string }>) {
    await client.query(
      `insert into design_rules (rule, specification)
       values ($1, $2)
       on conflict (rule) do update set specification = excluded.specification`,
      [r.rule, r.specification],
    );
    ruleCount++;
  }

  await client.end();
  console.log(
    `Loaded curriculum blueprint for ${PERSONA}/${LEVEL}: ${weekCount} weeks, ${dayCount} days, ${skillCount} skills, ${questTypeCount} quest types, ${rubricCount} rubric dimensions, ${ruleCount} design rules.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
