"""Validates a filled-in Tasks sheet against the real curriculum blueprint
before anything gets imported. This is the actual enforcement — the
Tasks sheet's cell locking (build_content_template.py) is only a soft
deterrent for manual editing in Excel; a script that generates/overwrites
the file (which is exactly what went wrong with SpeakMaster_First_50_Days.xlsx)
ignores locked cells entirely, since they're an Excel-UI restriction, not a
file-format-level constraint. This script is the thing that actually catches
that failure mode, by re-deriving the truth from days.json/skills.json every
time rather than trusting whatever the sheet's reference columns say.

Usage:
    python3 scripts/templates/validate_tasks_xlsx.py path/to/filled.xlsx
    python3 scripts/templates/validate_tasks_xlsx.py path/to/filled.xlsx --json-out rows.json

Exits non-zero if any FAIL-level issue is found. WARN-level issues (mostly
content repetition, which is a judgment call, not a hard rule) are printed
but don't fail the run.

`--json-out` additionally writes every authored row (task_type set) as JSON
— the one place the Tasks sheet actually gets parsed, so
scripts/db/import-tasks-xlsx.ts reads rows this same script already
validated instead of re-implementing sheet parsing in a second language.
Only written when there are zero FAILUREs (see main()).
"""
import json
import os
import sys
from collections import Counter, defaultdict

from openpyxl import load_workbook

REPO = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

REQUIRED_COLS = {
    "intro": ["text_hi", "text_en"],
    "rule": ["pattern", "example", "text_hi"],
    "mcq": ["prompt_hi", "prompt_en", "explanation_hi", "explanation_en"],
    # pattern/example are required here even though the Instructions sheet
    # calls them an optional "hint" for build rows — BuildStep.hint is
    # non-optional in lesson-types.ts (a real missing-hint bug in the LLM
    # pipeline was caught by the exact same requirement in validateDay.ts;
    # see docs/CONTENT_GENERATION.md). Enforcing it here too, not just in
    # scripts/db/import-tasks-xlsx.ts, keeps this script the single source
    # of truth for "is this sheet safe to import."
    "build": ["prompt_hi", "answer", "pattern", "example"],
    "speak": ["prompt_hi", "prompt_en"],
}
VALID_TASK_TYPES = {"intro", "rule", "mcq", "build", "speak"}
REPEAT_WARN_THRESHOLD = 4  # same example/answer/prompt text appearing this many times


def load_blueprint():
    days = json.load(open(os.path.join(REPO, "content/curriculum/everyday-confidence/beginner/days.json")))
    days_by_wd = {(d["week"], d["day"]): d for d in days}
    skills = json.load(open(os.path.join(REPO, "content/curriculum/everyday-confidence/beginner/skills.json")))
    earliest_week = {}
    for s in skills:
        sid = s["skill_id"]
        if sid not in earliest_week or s["introduced_week"] < earliest_week[sid]:
            earliest_week[sid] = s["introduced_week"]
    return days_by_wd, earliest_week


def read_rows(path):
    wb = load_workbook(path, data_only=True)
    if "Tasks" not in wb.sheetnames:
        raise SystemExit(f"FAIL: no 'Tasks' sheet in {path}")
    ws = wb["Tasks"]
    headers = [ws.cell(row=1, column=c).value for c in range(1, ws.max_column + 1)]
    rows = []
    for r in range(2, ws.max_row + 1):
        vals = [ws.cell(row=r, column=c).value for c in range(1, len(headers) + 1)]
        if all(v in (None, "") for v in vals):
            continue
        rows.append((r, dict(zip(headers, vals))))
    return rows


CONTENT_COLS_FOR_EMPTINESS_CHECK = [
    "skill_id", "emoji", "pattern", "example", "text_hi", "text_en", "prompt_hi", "prompt_en",
    "option_1_text", "option_2_text", "option_3_text", "option_4_text",
    "explanation_hi", "explanation_en", "answer", "distractors", "audio_text_en", "mission_label",
]


def validate(path):
    days_by_wd, earliest_week = load_blueprint()
    rows = read_rows(path)

    fails = []
    warns = []
    unauthored_slots = set()

    seen_slots_order = []  # for contiguity check
    last_slot = None
    value_counts = defaultdict(Counter)  # field -> value -> count

    for r, row in rows:
        week, day, qidx = row.get("week"), row.get("day"), row.get("quest_index")
        slot = (week, day, qidx)

        # 0. an un-duplicated placeholder row from the template itself —
        # reference columns filled (that's how the template ships), but no
        # task_type and no content yet. Not a failure, just not authored.
        tt = row.get("task_type")
        if not tt:
            if any(row.get(c) for c in CONTENT_COLS_FOR_EMPTINESS_CHECK):
                fails.append(f"row {r}: has content filled in but no task_type set (slot {slot})")
            else:
                unauthored_slots.add(slot)
            continue

        # 1. blueprint existence + reference-column accuracy
        blueprint_day = days_by_wd.get((week, day))
        if blueprint_day is None:
            fails.append(f"row {r}: (week={week}, day={day}) doesn't exist in the real curriculum blueprint")
        else:
            if qidx is None or qidx < 1 or qidx > blueprint_day["quest_count"]:
                fails.append(f"row {r}: quest_index={qidx} is out of range for week={week} day={day} (quest_count={blueprint_day['quest_count']})")
            else:
                exp_type = blueprint_day.get(f"quest_{qidx}_type")
                if row.get("quest_type_ref") != exp_type:
                    fails.append(f"row {r}: quest_type_ref={row.get('quest_type_ref')!r} but the blueprint says quest_{qidx}_type={exp_type!r} for week={week} day={day}")

        # 2. row grouping (same slot must be contiguous)
        if slot != last_slot:
            if slot in seen_slots_order:
                fails.append(f"row {r}: rows for (week={week}, day={day}, quest_index={qidx}) are scattered, not contiguous")
            seen_slots_order.append(slot)
            last_slot = slot

        # 3. task_type validity + required fields
        if tt not in VALID_TASK_TYPES:
            fails.append(f"row {r}: task_type={tt!r} is not one of {sorted(VALID_TASK_TYPES)}")
            continue
        for col in REQUIRED_COLS[tt]:
            if not row.get(col):
                fails.append(f"row {r}: task_type={tt} is missing required column '{col}'")

        # 4. mcq option correctness
        if tt == "mcq":
            opts = [(row.get(f"option_{i}_text"), row.get(f"option_{i}_correct")) for i in range(1, 5)]
            opts = [o for o in opts if o[0]]
            if len(opts) < 3:
                fails.append(f"row {r}: mcq has only {len(opts)} option(s), need at least 3")
            ycount = sum(1 for _, c in opts if c == "Y")
            if ycount != 1:
                fails.append(f"row {r}: mcq has {ycount} correct option(s) marked Y, need exactly 1")

        # 5. skill_id validity + introduced_week ordering
        sid = row.get("skill_id")
        if sid not in earliest_week:
            fails.append(f"row {r}: skill_id={sid!r} not found in Skills Reference")
        elif week is not None and week < earliest_week[sid]:
            fails.append(f"row {r}: skill_id={sid!r} used at week={week} but isn't introduced until week={earliest_week[sid]}")

        # 6. repetition tracking (warning, not failure)
        for field in ("example", "answer", "prompt_en"):
            val = row.get(field)
            if val:
                value_counts[field][val] += 1

    for field, counter in value_counts.items():
        for val, count in counter.most_common():
            if count >= REPEAT_WARN_THRESHOLD:
                warns.append(f"'{field}' value used {count} times verbatim across the sheet: {val!r}")

    # 7. full-coverage check: every real quest slot in the blueprint that got
    # ANY row should ideally have between 5 and 8 rows (design rule), and we
    # separately report which real slots have ZERO rows (still unauthored).
    rows_per_slot = Counter((row["week"], row["day"], row["quest_index"]) for _, row in rows if row.get("task_type"))
    for slot, count in rows_per_slot.items():
        if count < 5 or count > 8:
            warns.append(f"(week={slot[0]}, day={slot[1]}, quest_index={slot[2]}) has {count} task rows, expected 5-8")

    total_blueprint_slots = sum(d["quest_count"] for d in days_by_wd.values())
    authored_rows = [row for _, row in rows if row.get("task_type")]
    return fails, warns, rows_per_slot, unauthored_slots, total_blueprint_slots, authored_rows


def main():
    if len(sys.argv) not in (2, 4) or (len(sys.argv) == 4 and sys.argv[2] != "--json-out"):
        print(__doc__)
        sys.exit(1)
    path = sys.argv[1]
    json_out = sys.argv[3] if len(sys.argv) == 4 else None
    fails, warns, rows_per_slot, unauthored_slots, total_blueprint_slots, authored_rows = validate(path)

    print(f"Checked {sum(rows_per_slot.values())} task rows across {len(rows_per_slot)} authored quest slots "
          f"({len(unauthored_slots)} of {total_blueprint_slots} real quest slots still unauthored — that's expected, not a failure).\n")

    if warns:
        print(f"WARNINGS ({len(warns)}):")
        for w in warns[:50]:
            print("  -", w)
        if len(warns) > 50:
            print(f"  ... and {len(warns) - 50} more")
        print()

    if fails:
        print(f"FAILURES ({len(fails)}) — do not import:")
        for f in fails[:80]:
            print("  -", f)
        if len(fails) > 80:
            print(f"  ... and {len(fails) - 80} more")
        sys.exit(1)
    else:
        print("No failures. Safe to hand off for import (warnings above are still worth a human read).")
        if json_out:
            with open(json_out, "w") as f:
                json.dump(authored_rows, f)
            print(f"Wrote {len(authored_rows)} authored rows to {json_out}")


if __name__ == "__main__":
    main()
