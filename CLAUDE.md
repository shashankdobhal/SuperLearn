@AGENTS.md

# Supernova

@docs/CURRICULUM_PHILOSOPHY.md
@docs/CURRICULUM_DATA.md
@docs/CONTENT_DATABASE.md

Read all three docs above before designing curriculum content, data models,
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

