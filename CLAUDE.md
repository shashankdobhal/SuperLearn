@AGENTS.md

# Supernova

@docs/CURRICULUM_PHILOSOPHY.md
@docs/CURRICULUM_DATA.md
@docs/CONTENT_DATABASE.md
@docs/CONTENT_AUTHORING_TEMPLATE.md
@docs/TTS_AUDIO.md
@docs/CONTENT_GENERATION.md

Read all six docs above before designing curriculum content, data models,
or learner-facing flows. `docs/CURRICULUM_PHILOSOPHY.md` is the product/
curriculum brief and is treated as a standing instruction, not just
background reading — in particular its "source of truth" rule at the
bottom: don't silently redesign the Everyday Confidence → Beginner
curriculum; label any change as a proposed improvement.
`docs/CONTENT_DATABASE.md` covers the Postgres/Supabase schema, the
`server/` API the app fetches lesson content from, and the translation
pipeline in `scripts/db/`. The app needs `npm run server` (and Postgres)
running to load lessons — it degrades to an everything-locked/warning-banner
state, not a crash, if either isn't up.
`docs/CONTENT_AUTHORING_TEMPLATE.md` / `docs/templates/supernova_content_template.xlsx`
is the spreadsheet schema for authoring lesson task content outside a
conversation (e.g. a hired content writer). Every one of the 840 real quest
slots (all 50 weeks) is already a row with its blueprint columns pre-filled
and locked, specifically so a submission can't invent a different day-by-day
structure — that happened once (see the doc's "why v1 needed a v2"). If
handed a filled copy, run `python3 scripts/templates/validate_tasks_xlsx.py
<file>` FIRST — it re-derives the truth from days.json/skills.json rather
than trusting the sheet, and is the real enforcement (cell locking isn't,
against anything script-generated) — then write the importer described in
the doc's "turning a filled sheet into the database" section rather than
hand-converting rows.
`docs/TTS_AUDIO.md` covers lesson read-aloud audio: batch-generated once per
`(language, text)` with self-hosted Indic Parler-TTS (`scripts/tts/`,
Indian-accented English + native Hindi in one model), served as static
files, not a live TTS call per request — the curriculum is fixed content,
so there's no per-user/per-request cost to design around. Falls back to
on-device `expo-speech` (`src/lib/audio/nativeSpeech.ts`) for any line that
hasn't been batch-generated yet.
`docs/CONTENT_GENERATION.md` covers batch-generating Weeks 5+ lesson
content with an open-source LLM (Groq-hosted `openai/gpt-oss-120b`)
instead of authoring in conversation — every generated day is re-validated
against `days.json`/`skills.json` before being written (`scripts/content-gen/`).
The real constraint is Groq's free tier: 200,000 tokens/day per model
(separate from the per-minute cap), refilling continuously rather than on
a fixed reset — realistically ~1 week's worth of days per calendar day, not
an overnight job. `generate_days.ts` detects that specific quota error and
stops cleanly with the real wait time rather than hanging; just re-run the
same command later, already-written days are skipped.

