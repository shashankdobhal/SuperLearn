# Content database & multi-language pipeline

Answers "what database are we using" and "how do we add more Indian
languages" — see `docs/CURRICULUM_PHILOSOPHY.md` §23/§28 for the product
rationale this implements.

## Current state (as of this writing)

**The running app reads lesson content from Postgres, via a small local API
server** (`server/`, `npm run server`) — see "The app ↔ API ↔ Postgres wiring"
below. `content/curriculum/**/*.json` (weeks/days/skills — the curriculum
*blueprint*) is still static, by design (see "why a database, and why this
split"). `src/content/lessons/**/*.ts` still exists too, but only as the
human-authored *input* to `npm run db:migrate` now — the app no longer
imports those files directly. See "What's not done yet" below for what's
still missing (a real hosted Supabase project, chief among them).

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

## Schema (`supabase/migrations/0001_content_translations.sql`)

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

`payload` shape depends on `task_type` (pattern/example for `rule`,
options+hint for `mcq`, answer+hint for `build`, hint+isFinal for `speak`).
`fields` likewise depends on `task_type` (`text` for intro, `prompt`+
`explanation` for mcq, `prompt` for build/speak). See
`scripts/db/lib/toRows.ts` for the exact mapping — it's the single source of
truth for "what's invariant vs translatable" per task type.

English is **not** special-cased — it's `locale = 'en'` in
`content_translations` like any other language, because for intro/mcq/speak
steps the English line shown is instructional copy, not the taught content.

**Known gap carried over from the lesson files**: `rule` and `build` steps
only ever show Hindi in the app today (`RuleCard`/`BuildCard` don't respect
the language toggle — see `src/components/supernova/lesson/RuleCard.tsx` and
`BuildCard.tsx`) so they only have an `hi` translation row, no `en`. Worth
fixing in the UI before relying on this for a real English-support-language
learner.

## Scripts (`scripts/db/`)

These are dev tooling, not part of the Expo app bundle (Metro only bundles
from `src/app`, so this doesn't affect app size or the mobile build).

- **`npm run db:migrate`** — converts `src/content/lessons/**` into
  `content_items` + `content_translations` (locale `en`+`hi`, `source:
  'human'`) and upserts into Postgres. Idempotent — re-run after editing a
  lesson file. Currently only Week 1 / Days 1–2 exist, so this is what's in
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
  merging in `weekly_outcome`/`daily_mini_outcome` from `days.json` (still
  static, per above). 404s if that day has no `content_items` yet — the
  inverse of `scripts/db/lib/toRows.ts`'s DayLesson → rows mapping.
- **`GET /api/lessons/available?week=1`** — which days in that week have
  content, for the Home screen's lock/unlock state.
- `src/lib/api/{client,lessons}.ts` on the app side; `src/app/(tabs)/index.tsx`
  and `src/app/lesson.tsx` fetch instead of importing static content, with
  loading and "can't reach the server" states (the app degrades to
  everything-locked + a warning banner rather than crashing if `npm run
  server` or Postgres isn't running).
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
3. **`weeks`/`days` (the curriculum blueprint) stay as JSON.** They're
   structural (which quests exist, in what order) rather than per-learner
   content, so there's less urgency — but the Home screen's
   `weekly_outcome`/`daily_mini_outcome` text is English-only today and
   would need the same content_translations treatment for a fully
   multi-language UI, not just multi-language lessons.
4. **No review workflow** for `machine` → `machine_reviewed`, per above.
5. **Only Week 1 / Days 1–2 exist** in the DB — same authoring bottleneck as
   the JSON/TS files; the DB doesn't create content, it just stores and
   translates what's authored.
