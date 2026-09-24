/**
 * Strips any keys the LLM added that aren't part of the real lesson-types.ts
 * shapes — e.g. gpt-oss-120b consistently adds a `type: 'speak'` field to
 * speakFlow steps, copying the pattern from learnFlow steps, even though
 * SpeakStep has no `type` field at all. TypeScript's excess-property check
 * catches this at `tsc` time (a stray key fails the whole build), but
 * that's a late, per-file surprise — sanitize defensively here instead, so
 * a batch of 300+ generated days can't get silently blocked on this one
 * recurring model quirk.
 */
const ALLOWED_KEYS: Record<string, string[]> = {
  intro: ['type', 'id', 'quest', 'emoji', 'textHi', 'textEn', 'audioTextEn'],
  rule: ['type', 'id', 'quest', 'pattern', 'example', 'textHi'],
  mcq: ['type', 'id', 'quest', 'isPopQuiz', 'promptHi', 'promptEn', 'options', 'hint', 'explanationHi', 'explanationEn', 'audioTextEn'],
  build: ['type', 'id', 'quest', 'promptHi', 'answer', 'distractors', 'hint', 'audioTextEn'],
  speak: ['id', 'quest', 'promptEn', 'promptHi', 'hint', 'isFinal', 'missionLabel'],
};

function pick(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
}

export function sanitizeLesson(raw: Record<string, unknown>): Record<string, unknown> {
  const learnFlow = Array.isArray(raw.learnFlow) ? raw.learnFlow : [];
  const speakFlow = Array.isArray(raw.speakFlow) ? raw.speakFlow : [];

  const sanitizedLearnFlow = learnFlow.map((step: Record<string, unknown>) => {
    const allowed = ALLOWED_KEYS[step.type as string];
    return allowed ? pick(step, allowed) : step;
  });
  const sanitizedSpeakFlow = speakFlow.map((step: Record<string, unknown>) => pick(step, ALLOWED_KEYS.speak));

  return {
    week: raw.week,
    day: raw.day,
    skillId: raw.skillId,
    weeklyOutcome: raw.weeklyOutcome,
    dailyOutcome: raw.dailyOutcome,
    learnFlow: sanitizedLearnFlow,
    speakFlow: sanitizedSpeakFlow,
  };
}
