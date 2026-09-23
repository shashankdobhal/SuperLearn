# Curriculum seed data

`content/curriculum/<persona-slug>/<level-slug>/` holds the structured
curriculum for one persona × level track, parsed directly from the source
spreadsheet(s) in `docs/sources/`. This is *seed* data now — `npm run
db:migrate:curriculum` loads all of it into Postgres (`weeks`/`days`/
`skills`/`quest_types`/`speaking_rubric`/`design_rules`, see
`docs/CONTENT_DATABASE.md`), and the running app reads it from there via
`server/curriculum.ts` + `src/lib/api/curriculum.ts`, not by importing these
JSON files. Edit the JSON (or re-parse the source workbook), then re-run the
migration — it's idempotent.

## `everyday-confidence/beginner/` (source of truth — see CURRICULUM_PHILOSOPHY.md)

- **`weeks.json`** (50 records) — one per week: `week`, `week_arc` (the
  10-week arc name), `weekly_outcome`, `speaking_mission`,
  `primary_language_support`.
- **`days.json`** (350 records) — one per day: `week`, `week_arc`,
  `weekly_outcome`, `day` (1–7 within the week), `daily_mini_outcome`,
  `activity_mix`, `revision` ("Yes"/"No"), `quest_count`, `quest_1..4` (quest
  title) + `quest_1..4_type` (quest type, matches `quest-types.json`
  `quest_type`), `tasks_quest` (range, e.g. "5–8"), `repeat_track`,
  `primary_skills` (skill id(s), matches `skills.json` `skill_id`),
  `grammar_language_focus`, `vocabulary_context`, `speaking_evidence`,
  `estimated_minutes`.
- **`quest-types.json`** (10 records) — the reusable quest-type library:
  `quest_type`, `purpose`, `typical_task_count`, `example_task_mix`,
  `speaking_role`, `repeat_track_behaviour`.
- **`skills.json`** (49 records) — the competency graph nodes: `skill_id`,
  `skill` (label), `role` (`primary`/…), `introduced_week`,
  `suggested_prerequisite_relationship` (free-text prerequisite skills/
  grammar — not yet normalized into `skill_id` references, see below).
- **`speaking-rubric.json`** (7 records) — assessment dimensions:
  `dimension`, `what_supernova_evaluates`, `beginner_target_by_week_50`.
- **`design-rules.json`** (13 records) — product rules as `rule` /
  `specification` pairs (daily load, quest size, speaking priority, etc.) —
  a machine-readable mirror of `CURRICULUM_PHILOSOPHY.md`.

## Known gaps to close before this is a real content pipeline

- `skills.json.suggested_prerequisite_relationship` and `days.json.primary_skills`
  are free text, not normalized arrays of `skill_id`s — needed for an actual
  prerequisite graph / mastery engine.
- The `content_items` layer (§23 of the philosophy doc) — the actual tasks/
  sentences inside each quest, as opposed to `days.json`'s quest *shape*
  (titles + types) — now exists for Week 1 / Days 1–2 as hand-authored
  `src/content/lessons/**` files, migrated into Postgres and served to the
  app through `server/`'s API (`docs/CONTENT_DATABASE.md` /
  `supabase/migrations/` / `scripts/db/`). Still only 2 of 350 days, and no
  hosted Supabase project exists yet (local Postgres only) — see
  `docs/CONTENT_DATABASE.md`'s "what's not done yet" for the rest.
- Only one of the eventual 21 tracks (7 personas × 3 levels) exists.
