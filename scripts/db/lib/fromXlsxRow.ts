import type { ContentItemRow, TranslationRow } from './toRows';

/** One row from the Tasks sheet, as scripts/templates/validate_tasks_xlsx.py
 * dumps it (--json-out) — column names match docs/templates/
 * supernova_content_template.xlsx and docs/CONTENT_AUTHORING_TEMPLATE.md
 * exactly. openpyxl gives back `None` for an empty cell, which json.dump
 * turns into `null` — every optional field below is typed accordingly. */
export interface XlsxTaskRow {
  week: number;
  day: number;
  quest_index: number;
  task_type: 'intro' | 'rule' | 'mcq' | 'build' | 'speak';
  skill_id: string;
  emoji: string | null;
  pattern: string | null;
  example: string | null;
  text_hi: string | null;
  text_en: string | null;
  prompt_hi: string | null;
  prompt_en: string | null;
  option_1_text: string | null;
  option_1_correct: string | null;
  option_2_text: string | null;
  option_2_correct: string | null;
  option_3_text: string | null;
  option_3_correct: string | null;
  option_4_text: string | null;
  option_4_correct: string | null;
  explanation_hi: string | null;
  explanation_en: string | null;
  answer: string | null;
  distractors: string | null;
  audio_text_en: string | null;
  is_pop_quiz: string | null;
  is_final: string | null;
  mission_label: string | null;
}

type FieldsByLocale = Record<string, Record<string, string>>;

/** pattern/example double as a build/mcq/speak row's optional `hint` — same
 * convention scripts/templates/build_content_template.py uses going the
 * other direction (DayLesson -> sheet). Required (never null) for `build`;
 * validate_tasks_xlsx.py enforces that before any row reaches here. */
function hintFrom(row: XlsxTaskRow) {
  return row.pattern && row.example ? { pattern: row.pattern, example: row.example } : null;
}

function splitIntro(row: XlsxTaskRow): { payload: Record<string, unknown>; fields: FieldsByLocale } {
  return {
    payload: { emoji: row.emoji, audioTextEn: row.audio_text_en ?? null },
    fields: { en: { text: row.text_en ?? '' }, hi: { text: row.text_hi ?? '' } },
  };
}

function splitRule(row: XlsxTaskRow) {
  const fields: FieldsByLocale = { hi: { text: row.text_hi ?? '' } };
  if (row.text_en) fields.en = { text: row.text_en };
  return { payload: { pattern: row.pattern, example: row.example }, fields };
}

const OPTION_COLS = [
  ['option_1_text', 'option_1_correct'],
  ['option_2_text', 'option_2_correct'],
  ['option_3_text', 'option_3_correct'],
  ['option_4_text', 'option_4_correct'],
] as const satisfies ReadonlyArray<readonly [keyof XlsxTaskRow, keyof XlsxTaskRow]>;

function splitMcq(row: XlsxTaskRow) {
  const options = OPTION_COLS.map(([textCol, correctCol]) => ({ text: row[textCol], correct: row[correctCol] }))
    .filter((o) => o.text)
    .map((o, i) => ({ id: String.fromCharCode(97 + i), text: o.text as string, correct: o.correct === 'Y' }));

  return {
    payload: {
      isPopQuiz: row.is_pop_quiz === 'Y',
      options,
      hint: hintFrom(row),
      audioTextEn: row.audio_text_en ?? null,
    },
    fields: {
      en: { prompt: row.prompt_en ?? '', explanation: row.explanation_en ?? '' },
      hi: { prompt: row.prompt_hi ?? '', explanation: row.explanation_hi ?? '' },
    } as FieldsByLocale,
  };
}

function splitBuild(row: XlsxTaskRow) {
  const fields: FieldsByLocale = { hi: { prompt: row.prompt_hi ?? '' } };
  if (row.prompt_en) fields.en = { prompt: row.prompt_en };
  return {
    payload: {
      answer: (row.answer ?? '').trim().split(/\s+/).filter(Boolean),
      distractors: row.distractors
        ? row.distractors
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      // validate_tasks_xlsx.py requires pattern+example for build rows
      // (BuildStep.hint isn't optional), so this is never null in practice.
      hint: hintFrom(row),
      audioTextEn: row.audio_text_en ?? null,
    },
    fields,
  };
}

function splitSpeak(row: XlsxTaskRow) {
  return {
    payload: {
      hint: hintFrom(row),
      isFinal: row.is_final === 'Y',
      missionLabel: row.mission_label ?? null,
    },
    fields: {
      en: { prompt: row.prompt_en ?? '' },
      hi: { prompt: row.prompt_hi ?? '' },
    } as FieldsByLocale,
  };
}

/** Groups rows by (week, day, quest_index) — same identity content_items
 * uses — assigning task_index from row order within that group (0-based),
 * exactly matching docs/CONTENT_AUTHORING_TEMPLATE.md's "no hand-maintained
 * counter" design. Rows must already be in sheet order, and must already
 * have passed validate_tasks_xlsx.py (scattered/non-contiguous groups are a
 * FAIL there, not handled here). */
export function xlsxRowsToRows(rows: XlsxTaskRow[]): { items: ContentItemRow[]; translations: TranslationRow[] } {
  const items: ContentItemRow[] = [];
  const translations: TranslationRow[] = [];
  const taskIndexByGroup = new Map<string, number>();

  for (const row of rows) {
    const groupKey = `${row.week}-${row.day}-${row.quest_index}`;
    const taskIndex = taskIndexByGroup.get(groupKey) ?? 0;
    taskIndexByGroup.set(groupKey, taskIndex + 1);

    const split =
      row.task_type === 'intro'
        ? splitIntro(row)
        : row.task_type === 'rule'
          ? splitRule(row)
          : row.task_type === 'mcq'
            ? splitMcq(row)
            : row.task_type === 'build'
              ? splitBuild(row)
              : splitSpeak(row);

    items.push({
      week: row.week,
      day: row.day,
      questIndex: row.quest_index,
      taskIndex,
      taskType: row.task_type,
      skillId: row.skill_id,
      payload: split.payload,
    });
    for (const [locale, fields] of Object.entries(split.fields)) {
      translations.push({ week: row.week, day: row.day, questIndex: row.quest_index, taskIndex, locale, fields, source: 'human' });
    }
  }

  return { items, translations };
}
