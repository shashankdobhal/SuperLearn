# Content authoring template

The structure for authoring lesson task content (the actual sentences, MCQ
options, hints, speaking prompts — see `docs/CONTENT_DATABASE.md`'s
distinction between the curriculum *blueprint* and this, the *content*
layer) at scale, outside a conversation with Claude.

**File**: `docs/templates/supernova_content_template.xlsx` — a workbook with
four sheets:

- **Tasks** — the data-entry sheet. One row per task. **Every one of the
  840 real quest slots across all 50 weeks is already a row**, with its
  `week`/`day`/`quest_index`/`quest_title`/`quest_type_ref`/
  `daily_mini_outcome`/`tasks_expected` columns pre-filled from the actual
  blueprint and cell-locked (grey) — a content writer can't invent a
  different day-by-day structure because there's no blank space to invent
  one *into*. Week 1's 20 slots additionally carry their real, shipped
  content in full (light blue, also locked — read-only reference, not a
  cherry-picked example). Every other slot starts as one blank yellow row;
  duplicate it (copy row, keep columns A-G identical) for as many of the
  5-8 tasks that quest needs. Dropdowns are wired for `task_type` and every
  Y/N column; `correct_count_check` flags any mcq row without exactly one
  correct option.
- **Instructions** — column-by-column reference, what each `task_type` is,
  and the pedagogical guardrails (continuity, real speaking output, no
  copy-pasted prompts) a content writer should hold to, not just the schema.
- **Skills Reference** — a mirror of `skills.json` to pick `skill_id` from.
- **Blueprint Reference** — a mirror of `days.json`, all 350 days, so
  there's no need to have the original source workbook open in a second
  window while writing.

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
- `quest_title`/`quest_type_ref`/`daily_mini_outcome`/`tasks_expected` are
  never imported — they're pre-filled *from* the blueprint so a writer
  never has to guess it, not data the app reads back.

Task types stay exactly the 5 the app already renders (`intro`/`rule`/
`mcq`/`build`/`speak`) — Week 1's Days 3–7 already showed that Listen &
Notice / Talk with Nova / Build It in Writing / Warm-up / Weekly Mission
all reuse these 5 via `audio_text_en` and `mission_label` rather than
needing new ones (see `docs/CONTENT_DATABASE.md`'s "what's not done yet"
#5). A filled sheet shouldn't need a new task type invented per row; if a
day's content genuinely doesn't fit `intro`/`rule`/`mcq`/`build`/`speak`,
that's worth flagging before filling the row, not encoding into free text.

## Why v1 needed a v2

The first version of this template left `quest_index`/`quest_type_ref`
blank for the content writer to fill in per row, on the assumption that
cross-referencing the blueprint (an instruction on the Instructions sheet)
would be enough. A real submission (`SpeakMaster_First_50_Days.xlsx`)
showed that assumption was wrong: it invented its own day-by-day structure
(the same 4-quest Learn→Translate→Listen→Speak shape on all 70 days it
covered) instead of following `days.json` — 87% of its quest slots didn't
match the real blueprint, and whole quest types (`conversation`, `writing`,
`practice`, `review`, `reading`) never appeared once. Content repetition
was severe too — one listening prompt and one speak prompt were byte-for-
byte identical across every single day.

Sheet-level cell protection (the grey lock on reference columns) is a soft
deterrent for someone editing by hand in Excel, **not real enforcement** —
it does nothing against a submission generated or edited programmatically,
which is almost certainly what produced that file (the repetition pattern
is a dead giveaway). The actual fix is upstream of both: **every real slot
already exists as a row**, so there's no blank identity column left to fill
in wrong, and downstream, **`scripts/templates/validate_tasks_xlsx.py`**
re-derives the truth from `days.json`/`skills.json` on every submission,
independent of anything the sheet itself claims.

## Validating a filled sheet

```bash
python3 scripts/templates/validate_tasks_xlsx.py path/to/filled.xlsx
```

Re-checks every row against the live blueprint and skills data — not just
what the sheet's own reference columns say — and exits non-zero if any
FAIL-level issue exists. Catches: a `(week, day, quest_index)` that doesn't
match the real blueprint's `quest_N_type`, an out-of-range `quest_index`,
scattered (non-contiguous) rows for the same quest, missing required
fields per `task_type`, an mcq without exactly one correct option, an
invalid or premature `skill_id`, and (as warnings, not failures, since it's
a judgment call) suspiciously repeated `example`/`answer`/`prompt_en`
values and quest slots with fewer than 5 or more than 8 task rows. Run
before importing anything, not after — this is what would have caught
`SpeakMaster_First_50_Days.xlsx`'s problems automatically (verified: it
does, reporting the same 87%-mismatch and repetition issues found by hand).

Still doesn't catch: content that's schema-valid *and* non-repetitive but
still pedagogically weak (disconnected from a prior day, unnatural
phrasing). That's still a human (or model) read, same as before.

## Turning a filled sheet into the database

```bash
npx tsx scripts/db/import-tasks-xlsx.ts path/to/filled.xlsx
```

Always re-runs `validate_tasks_xlsx.py` first (via `--json-out`, so parsing
the sheet happens in exactly one place) and refuses to write anything if it
reports even one FAIL — the cell locking in the `.xlsx` itself is only a
soft deterrent (see "Why v1 needed a v2" above), so this script, not the
spreadsheet UI, is the actual gate. Groups rows by `(week, day,
quest_index)` preserving row order for `task_index`, and upserts into
`content_items` + `content_translations` via the same insert path as
`scripts/db/migrate-lessons.ts` (`scripts/db/lib/insertRows.ts`) — parallel
to, but independent of, the `.ts`-authored path (which stays how Week 1 and
the LLM-generated weeks are written). Both end at the same two tables, and
both are idempotent (safe to re-run, re-import, or mix).

Verified against Week 1's real content (already filled into the template as
the worked example): imports byte-for-byte the same `answer`/`hint`/option
data already shipped from `src/content/lessons/**`, and the app serves it
identically afterwards.

This is a genuinely independent way to add courses — no LLM, no Claude Code
session, just a filled spreadsheet and two commands.

## Regenerating the template

```bash
# 1. dump the current TS-authored lessons (Week 1) to JSON:
npx tsx -e "
import { week01Day01 } from './src/content/lessons/everyday-confidence-beginner/week-01-day-01';
/* ...same for day02..day07... */
import { writeFileSync } from 'fs';
writeFileSync('/tmp/week1_full_dump.json', JSON.stringify({ d1: week01Day01, /* ... */ }, null, 2));
"
# 2. rebuild the workbook from it + the live blueprint:
python3 scripts/templates/build_content_template.py
```

Re-run after changing `lesson-types.ts` (a new field needs a new column) or
after authoring more `src/content/lessons/**` days worth including as real
examples — don't hand-edit the `.xlsx`.
