@AGENTS.md

# Supernova

@docs/CURRICULUM_PHILOSOPHY.md
@docs/CURRICULUM_DATA.md
@docs/CONTENT_DATABASE.md
@docs/CONTENT_AUTHORING_TEMPLATE.md

Read all four docs above before designing curriculum content, data models,
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

