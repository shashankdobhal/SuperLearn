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
}

/**
 * A day's learnFlow is quest_1 ("Learn the Rule") followed, only on days
 * that have one, by quest_2 ("Practice with Translation") — inferred from
 * task_type rather than tagged explicitly, since intro/rule/mcq always
 * belong to the Learn quest and build always belongs to the Translation
 * quest in the lessons authored so far. speakFlow is always the day's last
 * quest. This mirrors quest_N/quest_N_type in days.json without needing the
 * lesson files to duplicate that bookkeeping.
 */
export function lessonToRows(lesson: DayLesson): { items: ContentItemRow[]; translations: TranslationRow[] } {
  const items: ContentItemRow[] = [];
  const translations: TranslationRow[] = [];

  const hasBuildQuest = lesson.learnFlow.some((s) => s.type === 'build');
  const speakQuestIndex = hasBuildQuest ? 3 : 2;

  let learnTaskIndex = 0;
  let translateTaskIndex = 0;

  for (const step of lesson.learnFlow) {
    const questIndex = step.type === 'build' ? 2 : 1;
    const taskIndex = step.type === 'build' ? translateTaskIndex++ : learnTaskIndex++;
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

  lesson.speakFlow.forEach((step, taskIndex) => {
    const { payload, fields } = splitSpeakStep(step);
    items.push({
      week: lesson.week,
      day: lesson.day,
      questIndex: speakQuestIndex,
      taskIndex,
      taskType: 'speak',
      skillId: lesson.skillId,
      payload,
    });
    for (const [locale, localeFields] of Object.entries(fields)) {
      translations.push({
        week: lesson.week,
        day: lesson.day,
        questIndex: speakQuestIndex,
        taskIndex,
        locale,
        fields: localeFields,
      });
    }
  });

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
    payload: { emoji: step.emoji },
    fields: { en: { text: step.textEn }, hi: { text: step.textHi } } as FieldsByLocale,
  };
}

function splitRule(step: RuleStep) {
  return {
    // pattern/example are the English grammar being taught — invariant.
    payload: { pattern: step.pattern, example: step.example },
    // RuleCard only ever renders textHi today (no language-toggle support
    // yet for rule captions) — see docs/CONTENT_DATABASE.md known gaps.
    fields: { hi: { text: step.textHi } } as FieldsByLocale,
  };
}

function splitMcq(step: McqStep) {
  return {
    payload: {
      isPopQuiz: step.isPopQuiz ?? false,
      options: step.options,
      hint: step.hint ?? null,
    },
    fields: {
      en: { prompt: step.promptEn, explanation: step.explanationEn },
      hi: { prompt: step.promptHi, explanation: step.explanationHi },
    } as FieldsByLocale,
  };
}

function splitBuild(step: BuildStep) {
  return {
    payload: {
      answer: step.answer,
      distractors: step.distractors ?? [],
      hint: step.hint,
    },
    // BuildCard only renders promptHi today (same toggle gap as rule cards).
    fields: { hi: { prompt: step.promptHi } } as FieldsByLocale,
  };
}

function splitSpeakStep(step: SpeakStep) {
  return {
    payload: { hint: step.hint ?? null, isFinal: step.isFinal ?? false },
    fields: {
      en: { prompt: step.promptEn },
      hi: { prompt: step.promptHi },
    } as FieldsByLocale,
  };
}
