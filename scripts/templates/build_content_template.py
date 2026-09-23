"""Regenerates docs/templates/supernova_content_template.xlsx — the content-
authoring schema described in docs/CONTENT_AUTHORING_TEMPLATE.md. Re-run
this after changing lesson-types.ts (a new task-type field, a new column
needed) rather than hand-editing the .xlsx.

Usage: python3 scripts/templates/build_content_template.py
(needs openpyxl: pip install openpyxl)
"""
import json
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

REPO = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT_PATH = os.path.join(REPO, "docs", "templates", "supernova_content_template.xlsx")

wb = Workbook()

# ---------- styling helpers ----------
HEADER_FILL = PatternFill("solid", fgColor="1F2937")
HEADER_FONT = Font(name="Arial", bold=True, color="FFFFFF", size=10)
EXAMPLE_FILL = PatternFill("solid", fgColor="E8F0FE")
INPUT_FILL = PatternFill("solid", fgColor="FFF9DB")
THIN = Side(style="thin", color="D0D0D0")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
BODY_FONT = Font(name="Arial", size=10)
WRAP = Alignment(wrap_text=True, vertical="top")

def style_header(ws, ncols, row=1):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
        cell.border = BORDER

# ============================================================
# Sheet 1: Tasks (the actual data-entry sheet)
# ============================================================
ws = wb.active
ws.title = "Tasks"

columns = [
    ("week", 7),
    ("day", 6),
    ("quest_index", 8),
    ("quest_type_ref", 14),
    ("task_type", 10),
    ("skill_id", 18),
    ("emoji", 7),
    ("pattern", 26),
    ("example", 26),
    ("text_hi", 30),
    ("text_en", 30),
    ("prompt_hi", 30),
    ("prompt_en", 30),
    ("option_1_text", 22),
    ("option_1_correct", 9),
    ("option_2_text", 22),
    ("option_2_correct", 9),
    ("option_3_text", 22),
    ("option_3_correct", 9),
    ("option_4_text", 22),
    ("option_4_correct", 9),
    ("correct_count_check", 9),
    ("explanation_hi", 30),
    ("explanation_en", 30),
    ("answer", 30),
    ("distractors", 18),
    ("audio_text_en", 30),
    ("is_pop_quiz", 9),
    ("is_final", 8),
    ("mission_label", 16),
]
headers = [c[0] for c in columns]
for i, (name, width) in enumerate(columns, start=1):
    ws.column_dimensions[get_column_letter(i)].width = width
    ws.cell(row=1, column=i, value=name)
style_header(ws, len(columns))
ws.freeze_panes = "F3"  # freeze header row + identity columns while scrolling right
ws.row_dimensions[1].height = 30

col_idx = {name: i + 1 for i, (name, _w) in enumerate(columns)}

def row_dict_to_list(d):
    return [d.get(name, "") for name, _w in columns]

# ---- example rows (real, already-shipped Week 1 content) ----
examples = [
    dict(week=1, day=1, quest_index=1, quest_type_ref="learn", task_type="intro", skill_id="introduce_self",
         emoji="👋",
         text_hi="आज हम सीखेंगे कि खुद को English में कैसे introduce करें — अपना नाम और आप कहाँ से हैं। चलिए शुरू करते हैं!",
         text_en="Today we'll learn to introduce yourself in English — your name, and where you're from. Let's begin!"),
    dict(week=1, day=1, quest_index=1, quest_type_ref="learn", task_type="rule", skill_id="introduce_self",
         pattern="My name is + [Name].", example="My name is Rohan.",
         text_hi="खुद को introduce करने का सबसे आसान तरीका।"),
    dict(week=1, day=1, quest_index=1, quest_type_ref="learn", task_type="mcq", skill_id="introduce_self",
         prompt_hi="खुद को सही तरीके से introduce करने वाला sentence कौन सा है?",
         prompt_en="Which sentence correctly introduces yourself?",
         option_1_text="Name my is Aisha.", option_1_correct="N",
         option_2_text="My name is Aisha.", option_2_correct="Y",
         option_3_text="Is my name Aisha.", option_3_correct="N",
         explanation_hi="सही! \"My name is + [Name]\" खुद को introduce करने का सही pattern है।",
         explanation_en="Correct! \"My name is + [Name]\" is the right pattern to introduce yourself.",
         is_pop_quiz="N"),
    dict(week=1, day=1, quest_index=1, quest_type_ref="learn", task_type="mcq", skill_id="introduce_self",
         prompt_hi="आप कहाँ से हैं, यह बताने का सही तरीका चुनें।",
         prompt_en="Choose the correct way to say where you are from.",
         pattern="I am from + [Place]", example="I am from Delhi.",
         option_1_text="I from Delhi am.", option_1_correct="N",
         option_2_text="Am I from Delhi.", option_2_correct="N",
         option_3_text="I am from Delhi.", option_3_correct="Y",
         explanation_hi="बढ़िया! \"I am from + [Place]\" ऐसे काम करता है।",
         explanation_en="Great! \"I am from + [Place]\" works like this.",
         is_pop_quiz="Y"),
    dict(week=1, day=1, quest_index=2, quest_type_ref="translation", task_type="build", skill_id="introduce_self",
         prompt_hi="मेरा नाम रोहन है।", answer="My name is Rohan",
         pattern="My name is + [Name]", example="My name is Aisha."),
    dict(week=1, day=1, quest_index=3, quest_type_ref="speaking", task_type="speak", skill_id="introduce_self",
         prompt_en="Say your name.", prompt_hi="अपना नाम बोलिए।",
         pattern="My name is + [Name]", example="My name is Aisha.", is_final="N"),
    dict(week=1, day=1, quest_index=3, quest_type_ref="speaking", task_type="speak", skill_id="introduce_self",
         prompt_en="Last one — put it all together. Give a full introduction: your name, where you’re from, what you do, and one interest.",
         prompt_hi="आखिरी सवाल — सब कुछ मिलाकर बोलिए: आपका नाम, आप कहाँ से हैं, आप क्या करते हैं, और आपकी एक रुचि।",
         is_final="Y"),
    dict(week=1, day=3, quest_index=2, quest_type_ref="listening", task_type="intro", skill_id="introduce_self",
         emoji="🎧",
         text_hi="ध्यान से सुनिए। बस सुनिए — अभी कुछ करना नहीं है।",
         text_en="Listen carefully. Just listen for now — nothing to do yet.",
         audio_text_en="I like playing football."),
    dict(week=1, day=3, quest_index=2, quest_type_ref="listening", task_type="mcq", skill_id="introduce_self",
         prompt_hi="Nova ने बिल्कुल क्या कहा?", prompt_en="What did Nova say, exactly?",
         audio_text_en="I'm interested in music.",
         option_1_text="I'm interested in movies.", option_1_correct="N",
         option_2_text="I'm interested in music.", option_2_correct="Y",
         option_3_text="I'm not interested in music.", option_3_correct="N",
         explanation_hi="सही! ध्यान से शब्दों को पहचानना ज़रूरी है।",
         explanation_en="Correct! Catching the exact words matters here.", is_pop_quiz="N"),
    dict(week=1, day=3, quest_index=2, quest_type_ref="listening", task_type="build", skill_id="introduce_self",
         prompt_hi="जो sentence आपने अभी सुना, उसे फिर से बनाइए।",
         audio_text_en="He is interested in photography.",
         answer="He is interested in photography",
         pattern="[Subject] + is interested in + [noun]", example="She's interested in painting."),
    dict(week=1, day=7, quest_index=4, quest_type_ref="mission", task_type="speak", skill_id="introduce_self",
         prompt_en="Give your full 60-second self-introduction: your name, where you're from, where you live, what you do, and one interest — as if you're meeting someone for the first time.",
         prompt_hi="अपना पूरा 60-second self-introduction दीजिए: आपका नाम, आप कहाँ से हैं, कहाँ रहते हैं, क्या करते हैं, और आपकी एक रुचि — जैसे आप किसी से पहली बार मिल रहे हों।",
         is_final="Y", mission_label="WEEKLY MISSION"),
]

start_row = 2
for r, ex in enumerate(examples, start=start_row):
    for name, _w in columns:
        v = ex.get(name, "")
        ws.cell(row=r, column=col_idx[name], value=v)
    for c in range(1, len(columns) + 1):
        cell = ws.cell(row=r, column=c)
        cell.fill = EXAMPLE_FILL
        cell.font = BODY_FONT
        cell.alignment = WRAP
        cell.border = BORDER
    # correct_count_check formula — O/Q/S/U are the four option_correct columns
    # specifically (not a contiguous range: P/R/T are the option TEXT columns
    # in between, and COUNTIF(O:U) would wrongly count any option text that
    # happened to literally read "Y").
    ws.cell(row=r, column=col_idx["correct_count_check"],
            value=f'=COUNTIF(O{r},"Y")+COUNTIF(Q{r},"Y")+COUNTIF(S{r},"Y")+COUNTIF(U{r},"Y")')

last_example_row = start_row + len(examples) - 1

# Blank input rows below examples, ready to fill in — pre-formatted + formula
BLANK_ROWS = 40
for r in range(last_example_row + 1, last_example_row + 1 + BLANK_ROWS):
    for c in range(1, len(columns) + 1):
        cell = ws.cell(row=r, column=c)
        cell.fill = INPUT_FILL
        cell.font = BODY_FONT
        cell.alignment = WRAP
        cell.border = BORDER
    ws.cell(row=r, column=col_idx["correct_count_check"],
            value=f'=COUNTIF(O{r},"Y")+COUNTIF(Q{r},"Y")+COUNTIF(S{r},"Y")+COUNTIF(U{r},"Y")')

last_row = last_example_row + BLANK_ROWS

# ---- data validations (dropdowns) ----
dv_task_type = DataValidation(type="list", formula1='"intro,rule,mcq,build,speak"', allow_blank=True, showErrorMessage=True)
dv_task_type.error = 'Must be one of: intro, rule, mcq, build, speak'
dv_task_type.errorTitle = 'Invalid task_type'
ws.add_data_validation(dv_task_type)
dv_task_type.add(f"E2:E{last_row}")

dv_yn = DataValidation(type="list", formula1='"Y,N"', allow_blank=True, showErrorMessage=True)
dv_yn.error = 'Must be Y or N'
dv_yn.errorTitle = 'Invalid value'
ws.add_data_validation(dv_yn)
for col in ["O", "Q", "S", "U", "AB", "AC"]:
    dv_yn.add(f"{col}2:{col}{last_row}")

dv_quest_type_ref = DataValidation(
    type="list",
    formula1='"learn,translation,listening,reading,writing,practice,speaking,conversation,review,mission,mixed"',
    allow_blank=True, showErrorMessage=True,
)
dv_quest_type_ref.error = 'Must match a quest_type from quest-types.json'
dv_quest_type_ref.errorTitle = 'Invalid quest_type_ref'
ws.add_data_validation(dv_quest_type_ref)
dv_quest_type_ref.add(f"D2:D{last_row}")

# ============================================================
# Sheet 2: Instructions
# ============================================================
ws2 = wb.create_sheet("Instructions")
ws2.column_dimensions["A"].width = 22
ws2.column_dimensions["B"].width = 16
ws2.column_dimensions["C"].width = 60
ws2.column_dimensions["D"].width = 45

title_font = Font(name="Arial", bold=True, size=14)
ws2["A1"] = "Supernova — Content Authoring Template"
ws2["A1"].font = title_font
ws2["A2"] = ("One row = one task a learner sees inside a quest (a card, a question, a speaking prompt). "
             "Rows for the same quest must be grouped together and in the exact order they should play — "
             "task order within a quest is taken from row order, not from a separate column.")
ws2["A2"].font = Font(name="Arial", italic=True, size=10)
ws2["A2"].alignment = Alignment(wrap_text=True)
ws2.merge_cells("A2:D2")
ws2.row_dimensions[2].height = 45

ws2["A4"] = "Before you start"
ws2["A4"].font = Font(name="Arial", bold=True, size=12)
notes = [
    "Cross-reference the curriculum blueprint (days.json / the \"350-Day Curriculum\" sheet in the "
    "source workbook) for the week/day you're writing: it already tells you quest_count and each "
    "quest's title + quest_type (quest_1_type, quest_2_type, ...). quest_type_ref here should match it.",
    "skill_id must be one from the \"Skills Reference\" sheet. Introduce a skill only from its "
    "introduced_week onward.",
    "Rows in the \"Tasks\" sheet with a light blue fill are worked examples — read them, don't edit them. "
    "Rows with a yellow fill are blank and ready for your content.",
    "correct_count_check must read 1 for every mcq row (exactly one correct option) and 0 for every "
    "other row. If it doesn't, fix the option_N_correct values in that row.",
]
r = 5
for n in notes:
    ws2.cell(row=r, column=1, value=f"• {n}")
    ws2.cell(row=r, column=1).alignment = Alignment(wrap_text=True, vertical="top")
    ws2.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
    ws2.row_dimensions[r].height = 32
    r += 1

r += 1
ws2.cell(row=r, column=1, value="Column reference").font = Font(name="Arial", bold=True, size=12)
r += 1
col_header_row = r
for i, h in enumerate(["Column", "Applies to", "Required?", "What it means"]):
    ws2.cell(row=col_header_row, column=i + 1, value=h)
style_header(ws2, 4, row=col_header_row)
r += 1

reference = [
    ("week", "all", "yes", "Week number (1-50), must match the blueprint."),
    ("day", "all", "yes", "Day within the week (1-7), must match the blueprint."),
    ("quest_index", "all", "yes", "1-based position of this task's quest within the day (quest_1=1, quest_2=2, ...) — matches days.json's quest_N ordering."),
    ("quest_type_ref", "all", "reference only", "Copy of that quest's type from the blueprint (learn/translation/listening/writing/practice/speaking/conversation/mission/...). Not used by the importer — a cross-check for you and the reviewer."),
    ("task_type", "all", "yes", "Which of the 5 building blocks this row is: intro, rule, mcq, build, or speak. See \"Task types\" below for what each one is/does."),
    ("skill_id", "all", "yes", "Which competency this task practices — must exist in Skills Reference, and not be introduced before its introduced_week."),
    ("emoji", "intro", "optional", "One emoji shown at the top of an intro card."),
    ("pattern", "rule (required); mcq/build/speak (optional hint)", "conditional", "The English grammar pattern being taught, e.g. \"I live in + [Place].\" For non-rule rows, filling this in (with example) shows a HINT box to the learner."),
    ("example", "rule (required); mcq/build/speak (optional hint)", "conditional", "One concrete example of `pattern`, e.g. \"I live in Pune.\""),
    ("text_hi", "intro, rule", "yes for those", "The Hindi instructional copy shown on the card."),
    ("text_en", "intro", "yes", "The English instructional copy shown when the learner toggles to English (intro cards only — rule cards don't support the toggle yet)."),
    ("prompt_hi", "mcq, build, speak", "yes for those", "The Hindi-language question/prompt shown to the learner."),
    ("prompt_en", "mcq, speak", "yes for those", "The English-language version of the prompt (shown on English toggle). build has no English prompt today."),
    ("option_1..4_text", "mcq", "yes (at least 3)", "The answer choices. Use 3 or 4; leave option_4 blank if unused."),
    ("option_1..4_correct", "mcq", "yes", "Y for the single correct option, N for the rest."),
    ("correct_count_check", "mcq", "auto (formula)", "=COUNTIF of the correct columns. Must read 1 for mcq rows, 0 otherwise. Don't type into this column."),
    ("explanation_hi / explanation_en", "mcq", "yes for those", "The feedback shown after answering, in Hindi and English."),
    ("answer", "build", "yes", "The target English sentence, plain text, words separated by single spaces (e.g. \"I am from Delhi\"). Punctuation stays attached to its word (\"Delhi,\" not \"Delhi\" + \",\")."),
    ("distractors", "build", "optional", "Extra decoy words to mix into the word bank, comma-separated. Leave blank for none."),
    ("audio_text_en", "intro, mcq, build", "optional", "When filled in, the card shows a PLAY button that speaks this English text aloud, and becomes a listening-comprehension check (the learner answers/rebuilds based on what they heard, not what's printed)."),
    ("is_pop_quiz", "mcq", "optional", "Y to show the \"POP QUIZ\" banner on this question."),
    ("is_final", "speak", "yes for those", "Y on the LAST speak row of the day only — changes the header from a countdown to \"Last Question!\" (or mission_label, if set)."),
    ("mission_label", "speak", "optional", "Only on a true weekly-mission capstone task (is_final=Y): overrides \"Last Question!\" with this text, e.g. \"WEEKLY MISSION\"."),
]
for name, applies, required, desc in reference:
    ws2.cell(row=r, column=1, value=name).font = Font(name="Arial", bold=True, size=9)
    ws2.cell(row=r, column=2, value=applies)
    ws2.cell(row=r, column=3, value=required)
    ws2.cell(row=r, column=4, value=desc)
    for c in range(2, 5):
        cell = ws2.cell(row=r, column=c)
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.font = BODY_FONT
        cell.border = BORDER
    name_cell = ws2.cell(row=r, column=1)
    name_cell.alignment = Alignment(wrap_text=True, vertical="top")
    name_cell.border = BORDER
    ws2.row_dimensions[r].height = 34
    r += 1

r += 1
ws2.cell(row=r, column=1, value="Task types — what each one is").font = Font(name="Arial", bold=True, size=12)
r += 1
task_type_rows = [
    ("intro", "A card the learner reads (and optionally hears via audio_text_en), then taps NEXT. No question, no grading. Used to introduce a topic, or for pure listening exposure."),
    ("rule", "A card presenting one grammar pattern + one example. No question, no grading."),
    ("mcq", "A multiple-choice question: prompt + options, immediate right/wrong feedback + explanation. With audio_text_en set, it becomes a listening check (identify the exact words / the meaning / an appropriate reply)."),
    ("build", "A translate-and-build task: the learner taps English words into order to match a Hindi prompt (or, with audio_text_en set, to \"retell\" what they just heard)."),
    ("speak", "A mic-based speaking prompt. No text grading — the learner produces spoken English; the app's speaking evaluation is currently simulated (canned encouragement), not real AI grading yet."),
]
for name, desc in task_type_rows:
    ws2.cell(row=r, column=1, value=name).font = Font(name="Arial", bold=True, size=9)
    ws2.cell(row=r, column=2, value=desc)
    ws2.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
    ws2.cell(row=r, column=2).alignment = Alignment(wrap_text=True, vertical="top")
    ws2.row_dimensions[r].height = 34
    r += 1

r += 1
ws2.cell(row=r, column=1, value="Pedagogical guardrails (please follow, don't just fill cells)").font = Font(name="Arial", bold=True, size=12)
r += 1
guardrails = [
    "Every week needs ONE weekly speaking outcome; every day needs one small mini-outcome that visibly "
    "builds toward it (see docs/CURRICULUM_PHILOSOPHY.md sections 7-8 if you have that file).",
    "New vocabulary/grammar should connect to what a PRIOR day already taught, not appear cold — reuse "
    "names, places and topics across a week where it makes sense, the way Day 1-7 of Week 1 does.",
    "Don't repeat the exact same sentence as a worked example elsewhere in the same track — vary the "
    "surface content even when the grammar pattern repeats.",
    "Every day should have at least one speak task; avoid days with zero spoken output.",
    "If in doubt about whether a day's plan actually produces more real speaking (per "
    "CURRICULUM_PHILOSOPHY.md's core invariant), that question matters more than filling every column.",
]
for g in guardrails:
    ws2.cell(row=r, column=1, value=f"• {g}")
    ws2.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
    ws2.cell(row=r, column=1).alignment = Alignment(wrap_text=True, vertical="top")
    ws2.row_dimensions[r].height = 32
    r += 1

# ============================================================
# Sheet 3: Skills Reference (mirror of skills.json)
# ============================================================
ws3 = wb.create_sheet("Skills Reference")
skills = json.load(open(f"{REPO}/content/curriculum/everyday-confidence/beginner/skills.json"))
skill_headers = ["skill_id", "skill", "role", "introduced_week", "suggested_prerequisite_relationship"]
for i, h in enumerate(skill_headers, start=1):
    ws3.cell(row=1, column=i, value=h)
    ws3.column_dimensions[get_column_letter(i)].width = 26 if i != 4 else 16
style_header(ws3, len(skill_headers))
for r, s in enumerate(skills, start=2):
    ws3.cell(row=r, column=1, value=s["skill_id"])
    ws3.cell(row=r, column=2, value=s["skill"])
    ws3.cell(row=r, column=3, value=s["role"])
    ws3.cell(row=r, column=4, value=s["introduced_week"])
    ws3.cell(row=r, column=5, value=s["suggested_prerequisite_relationship"])
    for c in range(1, 6):
        cell = ws3.cell(row=r, column=c)
        cell.font = BODY_FONT
        cell.alignment = WRAP
        cell.border = BORDER
ws3.freeze_panes = "A2"
ws3["A" + str(len(skills) + 3)] = (
    "Note: 'describe_place' appears twice in the source data (week 2 and week 39, slightly different "
    "prerequisite notes) — a source data quirk, not fixed here. Pick whichever occurrence's week fits."
)
ws3.cell(row=len(skills) + 3, column=1).font = Font(name="Arial", italic=True, size=9)
ws3.merge_cells(start_row=len(skills) + 3, start_column=1, end_row=len(skills) + 3, end_column=5)
ws3.cell(row=len(skills) + 3, column=1).alignment = Alignment(wrap_text=True)

os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
wb.save(OUT_PATH)
print(f"saved: {OUT_PATH}")
