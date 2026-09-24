import type { DayLesson } from '../../src/lib/curriculum/lesson-types';
import type { BlueprintDay, Skill } from './blueprint';

export interface ValidationResult {
  fails: string[];
  warns: string[];
}

const SPEAK_TYPES = new Set(['speaking', 'conversation', 'mission']);

/**
 * Re-derives correctness from the real blueprint/skills data rather than
 * trusting anything the generator claims — the same principle as
 * scripts/templates/validate_tasks_xlsx.py, applied to LLM-generated
 * DayLesson objects instead of a filled spreadsheet. A generated day that
 * fails this never gets written to disk as a lesson file (see
 * generate_days.ts) — it gets retried or flagged, never silently shipped.
 */
export function validateDay(lesson: DayLesson, bp: BlueprintDay, earliestWeek: Map<string, number>): ValidationResult {
  const fails: string[] = [];
  const warns: string[] = [];

  if (lesson.week !== bp.week || lesson.day !== bp.day) {
    fails.push(`week/day mismatch: lesson says ${lesson.week}/${lesson.day}, expected ${bp.week}/${bp.day}`);
  }

  const introWeek = earliestWeek.get(lesson.skillId);
  if (introWeek === undefined) {
    fails.push(`skill_id ${lesson.skillId} not found in skills.json`);
  } else if (lesson.week < introWeek) {
    fails.push(`skill_id ${lesson.skillId} used at week ${lesson.week} but introduced week ${introWeek}`);
  }

  const byQuest = new Map<number, { learn: number; speak: number }>();
  for (const step of lesson.learnFlow ?? []) {
    const e = byQuest.get(step.quest) ?? { learn: 0, speak: 0 };
    e.learn++;
    byQuest.set(step.quest, e);
  }
  for (const step of lesson.speakFlow ?? []) {
    const e = byQuest.get(step.quest) ?? { learn: 0, speak: 0 };
    e.speak++;
    byQuest.set(step.quest, e);
  }

  const questTypesInOrder = [bp.quest_1_type, bp.quest_2_type, bp.quest_3_type, bp.quest_4_type];
  for (let q = 1; q <= bp.quest_count; q++) {
    const qType = questTypesInOrder[q - 1];
    const counts = byQuest.get(q);
    if (!counts) {
      fails.push(`quest ${q}: blueprint expects a "${qType}" quest but lesson has no steps for quest=${q}`);
      continue;
    }
    const total = counts.learn + counts.speak;
    if (total < 5 || total > 8) warns.push(`quest ${q} (${qType}): ${total} tasks, expected 5-8`);
    const isSpeakType = SPEAK_TYPES.has(qType ?? '');
    if (isSpeakType && counts.learn > 0) {
      fails.push(`quest ${q}: type "${qType}" should be speakFlow-only, but has ${counts.learn} learnFlow step(s)`);
    }
    if (!isSpeakType && counts.speak > 0) {
      fails.push(`quest ${q}: type "${qType}" should be learnFlow-only, but has ${counts.speak} speakFlow step(s)`);
    }
  }
  for (const q of byQuest.keys()) {
    if (q > bp.quest_count || q < 1) fails.push(`step uses quest=${q}, blueprint only defines ${bp.quest_count} quest(s)`);
  }

  function requireString(value: unknown, label: string) {
    if (typeof value !== 'string' || value.trim().length === 0) fails.push(`${label}: missing/empty (required field)`);
  }
  function requireHint(hint: unknown, label: string) {
    // LanguageHint is { pattern, example } — both required whenever a hint
    // object exists at all. A real failure mode from gpt-oss-120b: writing
    // { example: '...' } with no "pattern" key, which TypeScript's own
    // required-field check catches at `tsc` time (too late — the whole
    // project fails to build on one bad file) if this validator doesn't
    // catch it first.
    if (hint === undefined || hint === null) return;
    const h = hint as Record<string, unknown>;
    requireString(h.pattern, `${label}.hint.pattern`);
    requireString(h.example, `${label}.hint.example`);
  }

  for (const step of lesson.learnFlow ?? []) {
    if (step.type === 'intro') {
      requireString(step.emoji, `intro ${step.id}.emoji`);
      requireString(step.textHi, `intro ${step.id}.textHi`);
      requireString(step.textEn, `intro ${step.id}.textEn`);
    }
    if (step.type === 'rule') {
      requireString(step.pattern, `rule ${step.id}.pattern`);
      requireString(step.example, `rule ${step.id}.example`);
      requireString(step.textHi, `rule ${step.id}.textHi`);
    }
    if (step.type === 'mcq') {
      requireString(step.promptHi, `mcq ${step.id}.promptHi`);
      requireString(step.promptEn, `mcq ${step.id}.promptEn`);
      requireString(step.explanationHi, `mcq ${step.id}.explanationHi`);
      requireString(step.explanationEn, `mcq ${step.id}.explanationEn`);
      requireHint(step.hint, `mcq ${step.id}`);
      if (!step.options || step.options.length < 3) {
        fails.push(`mcq ${step.id}: needs at least 3 options`);
      } else {
        step.options.forEach((o, i) => {
          requireString(o.id, `mcq ${step.id}.options[${i}].id`);
          requireString(o.text, `mcq ${step.id}.options[${i}].text`);
          if (typeof o.correct !== 'boolean') fails.push(`mcq ${step.id}.options[${i}].correct: missing/not boolean`);
        });
        const yes = step.options.filter((o) => o.correct).length;
        if (yes !== 1) fails.push(`mcq ${step.id}: ${yes} correct options, need exactly 1`);
      }
    }
    if (step.type === 'build') {
      requireString(step.promptHi, `build ${step.id}.promptHi`);
      requireHint(step.hint, `build ${step.id}`);
      if (step.hint === undefined) fails.push(`build ${step.id}: missing required "hint" field`);
      if (!step.answer || step.answer.length === 0) {
        fails.push(`build ${step.id}: missing/empty answer`);
      } else if (!step.audioTextEn) {
        // A translation build step's promptHi must be a real Hindi sentence
        // to translate, not the English answer dressed up as an
        // instruction (a real failure mode seen from gpt-oss-120b: "इन
        // शब्दों को सही क्रम में रखकर वाक्य बनाइए: My brother has a cat."
        // — which hands the learner the answer instead of testing
        // translation). Two independent checks: (a) the prompt shouldn't
        // be mostly Latin script, since a real Hindi sentence is
        // Devanagari; (b) the prompt shouldn't literally contain the
        // answer's words.
        const devanagariCount = (step.promptHi.match(/[ऀ-ॿ]/g) ?? []).length;
        const latinCount = (step.promptHi.match(/[A-Za-z]/g) ?? []).length;
        if (latinCount > devanagariCount) {
          fails.push(`build ${step.id}: promptHi "${step.promptHi}" looks mostly English, not Hindi — a translation prompt must be a real Hindi sentence`);
        }
        const answerText = step.answer.join(' ').toLowerCase().replace(/[.,!?]/g, '');
        const promptLower = step.promptHi.toLowerCase().replace(/[.,!?]/g, '');
        if (answerText.length > 8 && promptLower.includes(answerText)) {
          fails.push(`build ${step.id}: promptHi contains the literal English answer — must be a Hindi sentence to translate, not the answer itself`);
        }
      }
    }
  }

  const speakFlow = lesson.speakFlow ?? [];
  speakFlow.forEach((step, i) => {
    requireString(step.promptEn, `speak ${step.id}.promptEn`);
    requireString(step.promptHi, `speak ${step.id}.promptHi`);
    requireHint(step.hint, `speak ${step.id}`);
    const isLast = i === speakFlow.length - 1;
    if (step.isFinal && !isLast) fails.push(`isFinal set on non-last speakFlow step ${step.id}`);
    if (isLast && !step.isFinal) fails.push(`last speakFlow step ${step.id} missing isFinal`);
  });

  return { fails, warns };
}

export function buildEarliestWeekMap(skills: Skill[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of skills) {
    const cur = map.get(s.skill_id);
    if (cur === undefined || s.introduced_week < cur) map.set(s.skill_id, s.introduced_week);
  }
  return map;
}
