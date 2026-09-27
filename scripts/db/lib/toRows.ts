import type {
  BuildStep,
  DayLesson,
  IntroStep,
  LearnFlowStep,
  McqStep,
  RuleStep,
  SpeakStep,
} from '../../../src/lib/curriculum/lesson-types';

export interface ContentItemRow {
  week: number;
  day: number;
  questIndex: number;
  taskIndex: number;
  taskType: LearnFlowStep['type'] | 'speak';
  skillId: string;
  payload: Record<string, unknown>;
}

export interface TranslationRow {
  // Row is identified by (week, day, questIndex, taskIndex) instead of a DB
  // id here — the insert script resolves that to the real content_items.id
  // after inserting, since we don't have ids until then.
  week: number;
  day: number;
  questIndex: number;
  taskIndex: number;
  locale: string;
  fields: Record<string, string>;
  /** content_translations.source — defaults to 'human' (see insertRows.ts)
   * since every source feeding this today (hand-authored .ts, a filled
   * Tasks sheet) is human-written; a future MT pipeline would set this. */
  source?: 'human' | 'machine' | 'machine_reviewed';
}

/**
 * Every step — learnFlow and speakFlow alike — carries an explicit `quest`
 * (1-based, matching days.json's quest_N ordering). Earlier versions
 * inferred learnFlow's quest from task_type (build ⇒ quest 2, everything
 * else ⇒ quest 1) and gave every speakFlow step the same single "last
 * quest" index — both broke once a day needed more than the original
 * Learn(+Translate)/Speak two-quest shape (Day 3's "Listen & Notice" quest
 * reuses 'mcq'/'build'; Day 7 has four quests, three of them speak-shaped —
 * see week-01-day-0{3,7}.ts).
 */
export function lessonToRows(lesson: DayLesson): { items: ContentItemRow[]; translations: TranslationRow[] } {
  const items: ContentItemRow[] = [];
  const translations: TranslationRow[] = [];

  const taskIndexByQuest = new Map<number, number>();
  const nextTaskIndex = (quest: number) => {
    const i = taskIndexByQuest.get(quest) ?? 0;
    taskIndexByQuest.set(quest, i + 1);
    return i;
  };

  for (const step of lesson.learnFlow) {
    const questIndex = step.quest;
    const taskIndex = nextTaskIndex(questIndex);
    const { payload, fields } = splitLearnStep(step);

    items.push({
      week: lesson.week,
      day: lesson.day,
      questIndex,
      taskIndex,
      taskType: step.type,
      skillId: lesson.skillId,
      payload,
    });

    for (const [locale, localeFields] of Object.entries(fields)) {
      translations.push({ week: lesson.week, day: lesson.day, questIndex, taskIndex, locale, fields: localeFields });
    }
  }

  for (const step of lesson.speakFlow) {
    const questIndex = step.quest;
    const taskIndex = nextTaskIndex(questIndex);
    const { payload, fields } = splitSpeakStep(step);
    items.push({
      week: lesson.week,
      day: lesson.day,
      questIndex,
      taskIndex,
      taskType: 'speak',
      skillId: lesson.skillId,
      payload,
    });
    for (const [locale, localeFields] of Object.entries(fields)) {
      translations.push({ week: lesson.week, day: lesson.day, questIndex, taskIndex, locale, fields: localeFields });
    }
  }

  return { items, translations };
}

type FieldsByLocale = Record<string, Record<string, string>>;

function splitLearnStep(step: LearnFlowStep): { payload: Record<string, unknown>; fields: FieldsByLocale } {
  switch (step.type) {
    case 'intro':
      return splitIntro(step);
    case 'rule':
      return splitRule(step);
    case 'mcq':
      return splitMcq(step);
    case 'build':
      return splitBuild(step);
  }
}

function splitIntro(step: IntroStep) {
  return {
    payload: { emoji: step.emoji, audioTextEn: step.audioTextEn ?? null },
    fields: { en: { text: step.textEn }, hi: { text: step.textHi } } as FieldsByLocale,
  };
}

function splitRule(step: RuleStep) {
  const fields: FieldsByLocale = { hi: { text: step.textHi } };
  if (step.textEn) fields.en = { text: step.textEn };
  return {
    // pattern/example are the English grammar being taught — invariant.
    payload: { pattern: step.pattern, example: step.example },
    fields,
  };
}

function splitMcq(step: McqStep) {
  return {
    payload: {
      isPopQuiz: step.isPopQuiz ?? false,
      options: step.options,
      hint: step.hint ?? null,
      audioTextEn: step.audioTextEn ?? null,
    },
    fields: {
      en: { prompt: step.promptEn, explanation: step.explanationEn },
      hi: { prompt: step.promptHi, explanation: step.explanationHi },
    } as FieldsByLocale,
  };
}

function splitBuild(step: BuildStep) {
  const fields: FieldsByLocale = { hi: { prompt: step.promptHi } };
  if (step.promptEn) fields.en = { prompt: step.promptEn };
  return {
    payload: {
      answer: step.answer,
      distractors: step.distractors ?? [],
      hint: step.hint,
      audioTextEn: step.audioTextEn ?? null,
    },
    fields,
  };
}

function splitSpeakStep(step: SpeakStep) {
  return {
    payload: { hint: step.hint ?? null, isFinal: step.isFinal ?? false, missionLabel: step.missionLabel ?? null },
    fields: {
      en: { prompt: step.promptEn },
      hi: { prompt: step.promptHi },
    } as FieldsByLocale,
  };
}
