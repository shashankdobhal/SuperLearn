// Types for the authored "content item" layer — the actual sentences,
// options and prompts inside a quest. This layer doesn't exist in the source
// workbook yet (see docs/CURRICULUM_DATA.md, "known gaps"); files under
// src/content/lessons/** are Claude/human-authored to fit the quest shape
// (titles + types + task counts) that days.json *does* define, for the
// specific skills days.json names via `primary_skills`.

export interface LanguageHint {
  pattern: string;
  example: string;
}

export interface IntroStep {
  type: 'intro';
  id: string;
  emoji: string;
  textHi: string;
  textEn: string;
}

export interface RuleStep {
  type: 'rule';
  id: string;
  pattern: string;
  example: string;
  textHi: string;
}

export interface McqOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface McqStep {
  type: 'mcq';
  id: string;
  isPopQuiz?: boolean;
  promptHi: string;
  promptEn: string;
  options: McqOption[];
  hint?: LanguageHint;
  explanationHi: string;
  explanationEn: string;
}

export interface BuildStep {
  type: 'build';
  id: string;
  promptHi: string;
  answer: string[];
  distractors?: string[];
  hint: LanguageHint;
}

export type LearnFlowStep = IntroStep | RuleStep | McqStep | BuildStep;

export interface SpeakStep {
  id: string;
  promptEn: string;
  promptHi: string;
  hint?: LanguageHint;
  isFinal?: boolean;
}

export interface DayLesson {
  week: number;
  day: number;
  skillId: string;
  weeklyOutcome: string;
  dailyOutcome: string;
  learnFlow: LearnFlowStep[];
  speakFlow: SpeakStep[];
}
