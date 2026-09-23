# Content authoring template

The structure for authoring lesson task content (the actual sentences, MCQ
options, hints, speaking prompts — see `docs/CONTENT_DATABASE.md`'s
distinction between the curriculum *blueprint* and this, the *content*
layer) at scale, outside a conversation with Claude.

**File**: `docs/templates/supernova_content_template.xlsx` — a workbook with
three sheets:

- **Tasks** — the actual data-entry sheet. One row per task. 11 worked
  examples (real, shipped Week 1 content, light-blue fill) demonstrate every
  task type and field combination; 40 blank rows (yellow fill) below are
  ready to fill in. Dropdowns are wired for `task_type`, `quest_type_ref`,
  and every Y/N column.
- **Instructions** — column-by-column reference, what each `task_type` is,
  and the pedagogical guardrails (continuity, real speaking output, no
  dead columns) a content writer should hold to, not just the schema.
- **Skills Reference** — a mirror of `skills.json` to pick `skill_id` from.

## Why this shape

It mirrors `content_items`/`content_translations` (the Postgres tables in
`supabase/migrations/0001_content_translations.sql`) almost exactly, so
converting a filled sheet into rows is mechanical — the same kind of
conversion `scripts/db/migrate-curriculum.ts` already does for the
blueprint, not a redesign. Concretely:

- `week`, `day`, `quest_index`, `task_type`, `skill_id` → `content_items`'
  identity columns directly. `task_index` is **not** a column — it's taken
  from row order within a `(week, day, quest_index)` group, so a content
  writer never has to hand-maintain a counter.
- `pattern`/`example`/`emoji`/options/`answer`/`distractors`/`audio_text_en`
  → `content_items.payload` (the language-invariant part).
- `text_hi`/`text_en`/`prompt_hi`/`prompt_en`/`explanation_hi`/
  `explanation_en` → `content_translations.fields` for locale `hi` and `en`
  respectively (one sheet row expands into up to 2 translation rows).
- `quest_type_ref` is the one column that ISN'T imported — it's a
  cross-check for the content writer (and reviewer) against
  `days.json`'s `quest_N_type`, not data the app reads.

Task types stay exactly the 5 the app already renders (`intro`/`rule`/
`mcq`/`build`/`speak`) — Week 1's Days 3–7 already showed that Listen &
Notice / Talk with Nova / Build It in Writing / Warm-up / Weekly Mission
all reuse these 5 via `audio_text_en` and `mission_label` rather than
needing new ones (see `docs/CONTENT_DATABASE.md`'s "what's not done yet"
#5). A filled sheet shouldn't need a new task type invented per row; if a
day's content genuinely doesn't fit `intro`/`rule`/`mcq`/`build`/`speak`,
that's worth flagging before filling the row, not encoding into free text.

## What importing this still won't automate

The sheet's job is to make conversion mechanical once content is *written*
well — it doesn't make the writing itself mechanical. A row that's
schema-valid (right columns filled, `correct_count_check` reads 1) can
still be pedagogically bad: disconnected from what a prior day taught,
repetitive, or not producing real spoken output. That's what the
"Pedagogical guardrails" section of the Instructions sheet is for, and
it's still a human (or model) judgment call per row, not something a
column can enforce. A validation pass before import should check the
mechanical stuff (schema, skill_id exists, `correct_count_check` = 1 for
every mcq row, week/day/quest_index match the blueprint's quest_count and
quest_N_type) — worth building once a filled sheet exists to validate
against; not built yet, since there's nothing to validate against yet.

## Turning a filled sheet into the database

Not built yet (same reason — no filled sheet exists yet to build/test it
against). When one exists, the importer is a new script (e.g.
`scripts/db/import-tasks-xlsx.ts`) that: reads the **Tasks** sheet, groups
rows by `(persona, level, week, day, quest_index)` preserving row order for
`task_index`, and inserts directly into `content_items` +
`content_translations` — parallel to, but independent of,
`scripts/db/migrate-lessons.ts` (which stays the path for lessons authored
as `src/content/lessons/**/*.ts`, e.g. Week 1). Both end at the same two
tables.
