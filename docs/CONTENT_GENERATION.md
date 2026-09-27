# Automated lesson content generation

How Weeks 5+ get authored without spending Claude conversation time per
day — and the real constraints discovered building this.

## Why this exists

Weeks 1-4 were hand-authored in conversation with Claude — good quality,
but doesn't scale to the remaining ~45 weeks (315 days). Once the pattern
was proven (real blueprint, real skills, 5 task types reused for every
quest type), generating a day is mechanical enough to delegate to a
cheaper open-source LLM, with the actual quality gate being an automated
validator re-deriving correctness from the same blueprint data — not the
model's own claims, and not a human/Claude re-read of every day.

## Architecture

- **`scripts/lib/loadAllLessons.ts`** dynamically imports every
  `week-XX-day-YY.ts` file in `src/content/lessons/everyday-confidence-beginner/`
  — no hand-maintained import list, since that would mean editing 3+
  scripts every time a new week gets authored, by any means.
- **`scripts/content-gen/blueprint.ts`** loads `days.json`/`skills.json`/
  `quest-types.json`/`design-rules.json` — the same source-of-truth data
  the xlsx validator (`scripts/templates/validate_tasks_xlsx.py`) uses.
- **`scripts/content-gen/promptBuilder.ts`** builds one prompt per day:
  the day's exact blueprint fields (quest types, grammar focus, skill),
  the relevant quest-type descriptions, the design rules, and 1 real
  worked example picked for having the closest-matching quest-type
  sequence (`pickFewShotExamples`) — plus a growing list of hard
  requirements added after each real failure mode found (see "Content bugs
  found" below).
- **`scripts/content-gen/callGroq.ts`** calls Groq's OpenAI-compatible
  endpoint with `response_format: {type: 'json_object'}`.
- **`scripts/content-gen/sanitizeLesson.ts`** strips any keys the model
  added that aren't part of the real `DayLesson` shape (a recurring model
  quirk — see below) before validation.
- **`scripts/content-gen/validateDay.ts`** re-derives correctness from
  `days.json`/`skills.json` — quest types match, task counts, mcq
  exactly-one-correct, every required field present, build prompts are
  real Hindi (not the English answer echoed back), no premature grammar.
  A day that fails is retried with a corrective prompt (up to 3 attempts)
  before being logged as a failure and skipped — **never written with
  known problems**.
- **`scripts/content-gen/generate_days.ts`** is the driver — walks a week
  range, skips days that already have a file, writes validated days to
  disk in the same style as hand-authored lessons.

## Setup

```bash
# 1. Create a free Groq account at console.groq.com, generate an API key
# 2. Save it locally (gitignored via .env.*, never commit):
echo "GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx" > .env.groq
```

## Usage

```bash
npx tsx scripts/content-gen/generate_days.ts 8              # just week 8
npx tsx scripts/content-gen/generate_days.ts 8-50            # weeks 8 through 50
npx tsx scripts/content-gen/generate_days.ts 8-50 --watch     # keep running, sleeping
                                                                through daily-quota stops
                                                                and resuming on its own
```

Idempotent — re-running skips any `week-XX-day-YY.ts` that already exists,
so it's always safe to just re-run the same command to pick up where a
previous run left off (including one stopped by the daily quota — see
below). `--watch` builds on this: instead of exiting on a quota stop for a
human to notice and re-run, it sleeps for the wait time Groq itself reports
(plus a small buffer) and resumes the same process automatically. Meant to
be left running in the background for as long as the machine is up; if it's
interrupted for any reason, just re-run the same command — nothing is lost.

Whenever a pass writes at least one new day, `generate_days.ts` also runs
`scripts/db/migrate-lessons.ts` for you (logged, not silent) so the new
week(s) show up in the app's Home screen roadmap (`GET
/api/curriculum/roadmap`) without a separate manual step. If Postgres isn't
running locally this logs a failure and moves on — the files on disk are
unaffected, just re-run the migration script by hand once the DB is back.

## Run it independently of Claude Code — not as a Claude Code background task

`generate_days.ts` only ever calls Groq, never Claude — but running the
`--watch` loop *as a Claude Code background task* (as an earlier version of
this doc suggested) still ties it to that session: every quota-sleep/resume
cycle fires a task-notification back into the conversation, which costs
Claude usage just to keep restating "still going" — for a job that can run
for days. There's no reason to pay for that.

Instead, run it as a plain macOS background daemon via launchd — completely
decoupled from any terminal, IDE, or Claude session:

```bash
mkdir -p ~/Library/LaunchAgents
cp scripts/content-gen/com.supernova.contentgen.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.supernova.contentgen.plist
```

Check on it (also just plain shell — no Claude session needed):

```bash
launchctl list | grep supernova     # confirms it's loaded + last exit code
tail -f logs/content-gen.log        # live progress
```

Stop it:

```bash
launchctl unload ~/Library/LaunchAgents/com.supernova.contentgen.plist
```

The job definition is [`scripts/content-gen/com.supernova.contentgen.plist`](com.supernova.contentgen.plist)
— edit the week range in its `ProgramArguments` before installing if you
want something other than `6-50`. It restarts on a crash but not after a
genuinely successful full run (every requested week generated).

## The real constraint: Groq's free tier is 200,000 tokens/DAY, not just per-minute

This is the thing that actually governs how fast content can be generated,
discovered the hard way generating Weeks 5-7:

- Groq's free tier rate-limits `openai/gpt-oss-120b` at **8,000
  tokens/minute AND 200,000 tokens/day**, each tracked independently. One
  of our prompts (blueprint + one few-shot example + a full day's JSON
  response) uses roughly 5,000-7,500 tokens — up to ~90% of the *entire
  per-minute* budget on its own, and the daily cap gets fully consumed
  after roughly **25-30 successful day-generations**.
- The daily bucket **refills continuously** (a leaky bucket, not a
  fixed-clock reset) at roughly 200,000/86,400 ≈ 2.3 tokens/second. Once
  exhausted, generating one more ~7,000-token day realistically needs
  **20-60 minutes** of real wait for enough to trickle back — not a fixed
  "resets at midnight" cliff.
- **Practical throughput: roughly one week's worth of days (7 days) per
  calendar day**, sustained. To generate all 315 remaining days at that
  rate is genuinely multiple real days of calendar time, not an overnight
  job, *on the free tier alone*.
- `generate_days.ts` detects the daily-quota 429 specifically (Groq's error
  names "tokens per day (TPD)" distinctly from the per-minute "TPM" one)
  and **stops the whole run immediately** with a clear message naming the
  real wait time, rather than hanging or burning retries pointlessly on
  a wall that a short retry loop can't get past. Just re-run the same
  command later — already-written days are skipped, so nothing is lost.

### Alternatives considered

- **`openai/gpt-oss-20b`** (smaller model, separate daily quota) — tried as
  a workaround when 120b's quota was exhausted. **Failed outright**: every
  single request 400'd with `"Failed to validate JSON. Please adjust your
  prompt"` (code `json_validate_failed`) — the smaller model can't
  reliably produce valid JSON for a prompt this complex at all, not just
  lower quality. Not usable for this task.
- **Kimi K2 via OpenRouter** — benchmarks ahead of gpt-oss-120b on
  structured/coding tasks and was a promising lead, but OpenRouter's free
  `:free` variant for Kimi has been discontinued (confirmed live via its
  API, which now 404s with "unavailable for free"). Every Kimi model there
  requires real payment now (cheap — roughly $2-5 total for all remaining
  content at current per-token rates — but real money, and needs a
  payment method added to the account, which only the account owner can
  do). Declined for now; free-tier-only Groq is the accepted path, at its
  slower pace.

## Content bugs found (and how they're now prevented)

Every one of these was caught by reading generated output by hand, not by
the mechanical validator that existed at the time — each is now defended
against in `validateDay.ts` and/or `promptBuilder.ts`'s instructions, but
this is a reminder that **a clean validator run is not the same as a
pedagogically-sound day**, especially from a model weaker than the one
that authored Weeks 1-4:

1. **A build step handed the learner the English answer directly** —
   `promptHi: "इन शब्दों को सही क्रम में रखकर वाक्य बनाइए: My brother has a
   cat."` (Hindi instructions to "arrange these words" followed by the
   literal English answer) instead of a real Hindi sentence to translate.
   Defeats the exercise entirely. Now caught by `validateDay.ts`'s
   Devanagari-vs-Latin heuristic and literal-answer-substring check.
2. **Grammar introduced ahead of its scheduled week** — a "compare two
   family members" day used "older than"/"younger than" (true
   comparatives), but comparatives aren't introduced until skill_id
   "compare" at week 32. The correct solution (parallel "but"-contrast,
   same fix already used for the hand-authored week-02-day-06.ts) requires
   knowing the *rest of the curriculum's sequencing*, not just this one
   day's blueprint row — not something a per-day structural check can
   catch by construction. Added an explicit prompt rule (#12) forbidding
   ungranted grammar, but this class of issue may still need occasional
   human spot-checks since it's a judgment call, not a pure structural
   fact.
3. **Missing required fields** — `hint` on `build` steps (required, not
   optional, in `lesson-types.ts`), `pattern`+`example` both required
   whenever any `hint` object exists, `emoji`/`textHi`/`textEn` on `intro`
   steps, `id` on mcq options. These are all valid per loose JSON but fail
   TypeScript's own excess/missing-property checks — which only surface at
   `tsc` time, project-wide, which is too late (one bad file blocks the
   whole build). `validateDay.ts` now checks every required field
   explicitly before a file is ever written.
4. **An extra `type: 'speak'` key on speakFlow steps** — copying the
   `type` discriminator pattern from learnFlow steps, even though
   `SpeakStep` has no `type` field at all. `sanitizeLesson.ts` strips any
   key not in the real shape before validation/writing.

## What's not done yet

- Weeks 8-50 (roughly 300 days) still need generating — bounded by the
  daily-quota pace described above.
- No automated check for the "premature grammar" class of bug (#2 above)
  — still needs occasional human spot-checks across generated weeks, not
  just trusting a clean validator run.
- No cross-day repetition check (the same `example`/`answer`/`promptEn`
  text reused verbatim across many days) — `validate_tasks_xlsx.py` has
  this for the spreadsheet path; `validateDay.ts` doesn't yet, since it
  validates one day at a time rather than a full batch.
