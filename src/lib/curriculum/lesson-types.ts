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
  /** 1-based quest position within the day (see days.json quest_N) — which
   * quest this step belongs to, not its position within that quest. */
  quest: number;
  emoji: string;
  textHi: string;
  textEn: string;
  /** English sentence to play via TTS — used for "Listen & Notice"-type
   * quests (see week-01-day-03.ts), where an intro step is pure audio
   * exposure rather than a rule/example. */
  audioTextEn?: string;
}

export interface RuleStep {
  type: 'rule';
  id: string;
  quest: number;
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
  quest: number;
  isPopQuiz?: boolean;
  promptHi: string;
  promptEn: string;
  options: McqOption[];
  hint?: LanguageHint;
  explanationHi: string;
  explanationEn: string;
  /** Play button + TTS for a listening-comprehension check — the learner
   * answers `options` based on what was said, not what's printed. */
  audioTextEn?: string;
}

export interface BuildStep {
  type: 'build';
  id: string;
  quest: number;
  promptHi: string;
  answer: string[];
  distractors?: string[];
  hint: LanguageHint;
  /** When set, this is a "retell" task (rebuild the sentence you just
   * heard) rather than a translation task — promptHi becomes optional
   * framing copy alongside the audio, not the thing being translated. */
  audioTextEn?: string;
}

export type LearnFlowStep = IntroStep | RuleStep | McqStep | BuildStep;

export interface SpeakStep {
  id: string;
  quest: number;
  promptEn: string;
  promptHi: string;
  hint?: LanguageHint;
  isFinal?: boolean;
  /** Overrides the "Last Question!" header on the final step — used for a
   * day-7-style weekly mission capstone (see week-01-day-07.ts). */
  missionLabel?: string;
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
