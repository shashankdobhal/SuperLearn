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
`docs/CONTENT_DATABASE.md` covers the Postgres/Supabase schema and
translation pipeline in `scripts/db/` — note that the running app doesn't
read from this DB yet (still reads static JSON/TS), so don't assume it does.

