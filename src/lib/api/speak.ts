import { apiPost } from './client';

export interface SpeakGradeResult {
  correct: boolean;
  addressedPrompt: boolean;
  grammarIssues: string[];
  feedback: string;
}

/** Grades a spoken answer's transcript via the server (see
 * server/speakGrading.ts) — grammar/relevance/correctness feedback from an
 * LLM, richer than the local word-overlap heuristic
 * (src/lib/audio/wordMatch.ts) SpeakCard falls back to when this fails or
 * is unreachable. */
export async function gradeSpokenAnswer(
  transcript: string,
  promptEn: string,
  hint?: { pattern: string; example: string },
): Promise<SpeakGradeResult> {
  return apiPost<SpeakGradeResult>('/api/speak/grade', { transcript, promptEn, hint });
}
