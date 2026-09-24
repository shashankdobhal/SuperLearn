# Content database & multi-language pipeline

Answers "what database are we using" and "how do we add more Indian
languages" — see `docs/CURRICULUM_PHILOSOPHY.md` §23/§28 for the product
rationale this implements.

## Current state (as of this writing)

**The running app reads everything — the full 50-week/350-day curriculum
blueprint AND the authored lesson content — from Postgres**, via a small
local API server (`server/`, `npm run server`). Two separate migrations,
because they're fundamentally different kinds of data:

- `npm run db:migrate:curriculum` loads the **blueprint** — all 50 weeks,
  all 350 days, the quest-type library, speaking rubric, design rules —
  straight from `content/curriculum/**/*.json` (which came from the source
  workbook). This is mechanical: the data already existed in full, nothing
  needed authoring, so all 350 days went in in one shot.
- `npm run db:migrate` loads the **authored task content** — the actual
  sentences, MCQ options, hints, speak prompts inside each quest — from
  `src/content/lessons/**/*.ts`. This is NOT mechanical: the source workbook
  only ever specified quest *shape* (titles + types + task counts), never
  the actual exercises, so this only covers what's been hand-authored so
  far (Weeks 1–4 / Days 1–28 of 350). See "why lesson content can't be
  bulk-loaded" below for why these two are different problems.

`content/curriculum/**/*.json` and `src/content/lessons/**/*.ts` remain on
disk as the *source* for both migrations (edit them, re-run the migration —
both are idempotent) — the app no longer imports either directly. See
"What's not done yet" below for what's still missing (a real hosted Supabase
project, chief among them).

## Why lesson content can't be bulk-loaded the way the blueprint was

The blueprint (weeks/days) answers "what quests exist, in what order, about
what." It came out of the Excel workbook complete, so migrating it was a
data-format conversion — no new thinking required, hence all 350 days at
once. Lesson content answers "what specific sentence, what specific wrong
answer, what specific hint" — none of that exists in the workbook. It's
generated per the rules in `docs/CURRICULUM_PHILOSOPHY.md` §29/§33 (define
the skill, the grammar support, the speaking evidence, the likely failure
modes, ...) and reviewed against the running app before being called done —
which is why it's gone one (or a couple of) day(s) at a time rather than
all 350 at once. That pace can speed up (batching several days per pass
instead of one), but "instant, like the blueprint" isn't really available
for this half — there's no source data to convert, only content to write.

## Why a database, and why this split

A day's lesson content has two kinds of text:

- **Target-language content** — the English being taught: grammar patterns,
  example sentences, MCQ options, correct answers. This never changes
  per learner, regardless of what support language they picked.
- **Support-language / instructional copy** — the Hindi (or English)
  instructions, prompts and explanations wrapped around that content. This
  is exactly what needs to exist in Tamil, Telugu, Bengali, etc. too.

Baking both into one hardcoded TS file per lesson (what
`src/content/lessons/**` does today) means every new support language is a
copy-pasted file, and every new day is a code change + app rebuild. Splitting
them lets a new language be "run a translation job, insert rows" and a new
day be "insert rows," with no app rebuild.

**Database: Postgres, via Supabase.** Supabase because it's a hosted
Postgres with auth/storage built in for when learner accounts exist, and
because the schema below is *plain* Postgres — nothing Supabase-specific —
so `DATABASE_URL` pointed at any Postgres works identically (including the
local one these scripts were validated against).

## Schema

`supabase/migrations/0001_content_translations.sql` — authored lesson content:

```
skills                 -- mirrors skills.json; content_items.skill_id → here
content_items           -- one row per learn/speak task
  (week, day, quest_index, task_index) unique
  task_type: intro | rule | mcq | build | speak
  payload: jsonb        -- INVARIANT target-language content (see below)
content_translations
  (content_item_id, locale) primary key
  fields: jsonb          -- TRANSLATABLE copy for that locale
  source: human | machine | machine_reviewed
```

`supabase/migrations/0002_curriculum_blueprint.sql` — the curriculum
blueprint (persona/level-scoped since the product is 7 personas × 3 levels;
skills and quest_types are deliberately NOT scoped — they're meant to be
shared across personas per `docs/CURRICULUM_PHILOSOPHY.md` §4):

```
weeks           (persona, level, week) unique   -- the 50-week map
days            (persona, level, week, day) unique  -- the 350-day curriculum
quest_types     quest_type primary key           -- the reusable quest-type library
speaking_rubric (persona, level, dimension) unique
design_rules    id primary key
```

**One data-quality note surfaced by loading this**: `skills.json` has 49
rows but only 48 distinct `skill_id`s — `describe_place` appears twice
(introduced_week 2 and 39, slightly different prerequisite notes). Since
`skill_id` is the primary key, only the week-39 version survives in the
`skills` table. Not fixed — it's not obvious which was intended (could be a
genuine "revisit this skill later" or a workbook duplication), so flagging
it rather than guessing which one is "correct."

`payload` shape depends on `task_type` (pattern/example for `rule`,
options+hint for `mcq`, answer+hint for `build`, hint+isFinal for `speak`).
`fields` likewise depends on `task_type` (`text` for intro, `prompt`+
`explanation` for mcq, `prompt` for build/speak). See
`scripts/db/lib/toRows.ts` for the exact mapping — it's the single source of
truth for "what's invariant vs translatable" per task type.

English is **not** special-cased — it's `locale = 'en'` in
`content_translations` like any other language, because for intro/mcq/speak
steps the English line shown is instructional copy, not the taught content.

`rule` and `build` steps now respect the language toggle too
(`RuleCard`/`BuildCard` read an optional `textEn`/`promptEn` — see
`lesson-types.ts` — falling back to Hindi when a step predates the field,
which is every step authored before this). `build`'s `promptEn` is
deliberately only ever authored for "retell" steps (`audioTextEn` set) —
for a genuine translation exercise, `promptHi` *is* the exercise, so
showing its English translation would hand the learner the answer; those
steps simply don't get a `promptEn` and always show Hindi regardless of
the toggle. Only a handful of steps (`week-01-day-03.ts`) have `en` rows
for these fields so far — most lesson content still only has `hi`, and
will correctly fall back until authored.

## Scripts (`scripts/db/`)

These are dev tooling, not part of the Expo app bundle (Metro only bundles
from `src/app`, so this doesn't affect app size or the mobile build).

- **`npm run db:migrate:curriculum`** — loads the full blueprint (all 50
  weeks / 350 days / quest types / speaking rubric / design rules) from
  `content/curriculum/everyday-confidence/beginner/*.json` into `weeks`/
  `days`/`quest_types`/`speaking_rubric`/`design_rules`/`skills`.
  Idempotent (upserts on the natural key) — re-run after re-parsing the
  source workbook.
- **`npm run db:migrate`** — converts `src/content/lessons/**` into
  `content_items` + `content_translations` (locale `en`+`hi`, `source:
  'human'`) and upserts into Postgres. Idempotent — re-run after editing a
  lesson file. Currently Weeks 1–4 / Days 1–28 exist, so this is what's in
  the DB; extending it to all 7 personas × 3 levels × 50 weeks means
  authoring those lesson files first (see `docs/CURRICULUM_DATA.md`).
- **`npm run db:translate -- --locales ta,te,bn`** — machine-translates every
  `content_item` that has an `hi` row (change with `--source`) into each
  target locale that doesn't have one yet, `source: 'machine'`. Idempotent —
  only fills gaps, so re-running costs nothing once a locale is done.
  - `--provider google` calls the real Google Cloud Translation API
    (needs `GOOGLE_TRANSLATE_API_KEY` — see `.env.example`). Not free at
    volume; check current pricing first.
  - `--provider mock` (default when no API key is set) proves the pipeline
    wiring without a key or cost — it visibly tags output
    (`⟦mock:ta⟧ ...`) rather than pretending to be a real translation.
  - **Bhashini** (India's AI4Bharat-backed MT API) is worth trying instead of
    Google for Indian-language quality/cost, but its auth flow is a two-step
    ULCA pipeline rather than one REST call — not implemented yet. Add
    `scripts/db/providers/bhashini.ts` matching `TranslateProvider` (see
    `scripts/db/providers/types.ts`) once you have credentials to test
    against; `translate.ts` doesn't need to change.

Both scripts default to `DATABASE_URL=postgres://localhost/supernova_dev`
(a local Postgres, `brew services start postgresql@16` or similar) so they're
safe to run without touching anything real. Point `DATABASE_URL` at a
Supabase project's connection string to run the same scripts against it —
the schema is plain Postgres, no Supabase-specific step needed.

## The app ↔ API ↔ Postgres wiring

React Native (web or native) can't open a raw Postgres connection — it has
no TCP sockets, and even if it did, shipping DB credentials to a client is
its own problem. So there's a small Express server (`server/`, same
`DATABASE_URL` default as the scripts above) in between:

```
Expo app  --fetch-->  server/ (Express, npm run server, :4000)  --pg-->  Postgres
```

- **`GET /api/lessons/:week/:day`** — `server/lessons.ts` queries
  `content_items` + `content_translations` for that day and reassembles the
  exact `DayLesson`/`LearnFlowStep`/`SpeakStep` shape
  (`src/lib/curriculum/lesson-types.ts`) the lesson screen already renders,
  merging in `weekly_outcome`/`daily_mini_outcome` from the `days` table
  (`server/curriculum.ts`). 404s if that day has no `content_items` yet — the
  inverse of `scripts/db/lib/toRows.ts`'s DayLesson → rows mapping.
- **`GET /api/lessons/available?week=1`** — which days in that week have
  authored content (`content_items` exists), for the Home screen's
  lock/unlock state — distinct from `GET /api/curriculum/weeks/:week/days`,
  which returns all 7 days' *blueprint* whether or not they're authored yet.
- **`GET /api/curriculum/weeks/:week`** / **`GET
  /api/curriculum/weeks/:week/days`** — the blueprint itself, from
  `server/curriculum.ts` (`weeks`/`days` tables).
- `src/lib/api/{client,lessons,curriculum}.ts` on the app side;
  `src/app/(tabs)/index.tsx` and `src/app/lesson.tsx` fetch instead of
  importing static content, with loading and "can't reach the server" states
  (the app degrades to everything-locked + a warning banner rather than
  crashing if `npm run server` or Postgres isn't running).
- Still returns **both `hi` and `en` text** per item (not a single resolved
  locale) — the in-lesson Hindi/English toggle keeps working exactly as
  before. Serving Tamil/Telugu/etc. to the app is a separate, later step
  (needs a support-language picker in the UI, not just data in the DB) —
  see "what's not done yet".
- **Native (iOS/Android) caveat**: `localhost:4000` only resolves on web /
  the same machine. A device or Android emulator needs the host machine's
  LAN IP (or `10.0.2.2` for the Android emulator) via `EXPO_PUBLIC_API_URL` —
  not needed for the current "test on web" phase.

## Machine translation quality, for a language-learning app specifically

Raw MT output for a hint like "आप कहाँ से हैं, यह बताने का सही तरीका चुनें"
can come out grammatically fine but pedagogically off (too formal/too
literal for what's meant to read as a simple, friendly instruction). That's
why every machine-translated row is tagged `source: 'machine'` rather than
`'human'` — the intent is a review pass (by a fluent speaker of each target
language) before flipping rows to `'machine_reviewed'`, not shipping raw MT
straight to learners. Nothing here enforces that review step yet; it's a
process to set up, not a bug fix.

## What's not done yet

1. **A real hosted Supabase project.** I can't create one on your behalf —
   create a project at supabase.com, then either run
   `DATABASE_URL=<its connection string> npm run db:migrate` yourself, or
   hand me the connection string (as an env var, not pasted in chat) and
   I'll run it. Until then, everything (app, API server, scripts) points at
   the local Postgres these were validated against.
2. **No support-language picker in the UI.** The API always returns `hi`+`en`
   per item (matching today's in-lesson toggle); serving Tamil/Telugu/etc. to
   the app needs a real "choose your support language" setting somewhere
   (Account tab, once it exists) driving a `?locale=` on `GET
   /api/lessons/:week/:day`, not just the translated rows existing in the DB.
3. **The blueprint's own text is English-only.** `weeks`/`days` are fully in
   Postgres now (all 350 days), but `weekly_outcome`/`daily_mini_outcome`
   etc. aren't in `content_translations` — a fully multi-language *UI*
   (Home screen included, not just lessons) would need that too.
4. **No review workflow** for `machine` → `machine_reviewed`, per above.
5. **Weeks 1–4 (Days 1–28) have authored lesson content; Weeks 5–50 don't
   yet.** The blueprint row exists for all 350 days (so Home correctly shows
   every day's real `daily_mini_outcome` as locked/"Soon" once its
   content_items don't exist), but `content_items` only covers Weeks 1–4.
   Days 3–7 of Week 1 introduced quest types Days 1–2 didn't need — "Listen &
   Notice" (`listening`), "Talk with Nova" (`conversation`), "Build It in
   Writing" (`writing`), "Warm-up" (`practice`) and "Weekly Mission"
   (`mission`) — all reused via the existing `intro`/`rule`/`mcq`/`build`/
   `speak` task types rather than new ones (see week-01-day-0{3,4,5,6,7}.ts's
   comments for how each maps), which needed two schema fixes: every step now
   carries an explicit `quest: number` (was inferred from `task_type`, which
   broke once a quest reused a type another quest also used), and
   `intro`/`mcq`/`build`/`speak` gained an optional `audioTextEn` (+
   `PlayAudioButton`, `expo-speech`) for listening checks, plus `speak`
   gained an optional `missionLabel` for Day 7's capstone. Weeks 2–4 added
   "Read & Understand" (`reading`, reusing `intro`/`mcq`/`build` without
   `audioTextEn` — see week-02-day-03.ts) and exercised `quest_count=1`
   pure-conversation days with an empty `learnFlow` (week-03-day-05.ts,
   week-04-day-06.ts), which surfaced and fixed a real crash in
   `src/app/lesson.tsx`: it unconditionally rendered `learnFlow[0]` on
   mount, assuming every day has at least one learn step. Days 1, 2, 3, 7
   of Week 1, Week 2 Day 1 (click-tested through intro/rule/mcq), and the
   Week 3/4 empty-`learnFlow` days were click-tested end to end in the
   browser; the remaining Week 2–4 days were verified via the
   blueprint-consistency script (quest/type/skill_id checks, 0 failures) and
   typecheck/lint only, not a full interactive run-through of every day.
