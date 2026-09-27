import { callGroqForJsonFast } from './groq';

export interface SpeakGradeRequest {
  transcript: string;
  promptEn: string;
  hint?: { pattern: string; example: string };
}

export interface SpeakGradeResult {
  correct: boolean;
  addressedPrompt: boolean;
  grammarIssues: string[];
  feedback: string;
}

const MIN_WORDS = 3;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function buildPrompt(req: SpeakGradeRequest): string {
  const hintLine = req.hint
    ? `A model example of a good answer: "${req.hint.example}" (the pattern being practiced: "${req.hint.pattern}")\n`
    : '';
  return `You are grading a BEGINNER-level spoken English exercise for a Hindi-speaking adult learner practicing everyday conversational English.

Speaking prompt given to the learner: "${req.promptEn}"
${hintLine}
What the learner actually said (transcribed from their spoken answer — transcription errors are possible, be lenient about likely mis-transcribed words): "${req.transcript}"

Grade this ENCOURAGINGLY, for a true beginner. Minor grammar slips are fine as long as the meaning is clear and they attempted the right idea — this is not an exam. Return ONLY a JSON object with exactly this shape, no other text:
{
  "correct": boolean,
  "addressedPrompt": boolean,
  "grammarIssues": string[],
  "feedback": string
}

Field meanings:
- correct: true if a beginner should feel good about this attempt — on-topic, understandable, roughly follows the pattern being taught. False only if they didn't really attempt it, were off-topic, or the sentence is not understandable.
- addressedPrompt: did they actually attempt to answer what was asked, even imperfectly.
- grammarIssues: 0-2 short, specific, beginner-friendly notes (e.g. "try \\"I am from India\\" instead of \\"I from India\\""). Empty array if nothing worth flagging — don't nitpick minor beginner mistakes that don't affect meaning.
- feedback: one short, warm, specific sentence to show the learner directly (not a summary of the fields above, actual encouraging feedback).`;
}

function isPlausibleResult(x: unknown): x is SpeakGradeResult {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.correct === 'boolean' &&
    typeof r.addressedPrompt === 'boolean' &&
    Array.isArray(r.grammarIssues) &&
    r.grammarIssues.every((i) => typeof i === 'string') &&
    typeof r.feedback === 'string' &&
    r.feedback.length > 0
  );
}

/** Grades a spoken answer's transcript for correctness/grammar/relevance —
 * the text-only half of "vet what someone spoke" (see docs/CONTENT_GENERATION.md's
 * sibling doc on speaking evaluation). Pronunciation/fluency/pacing is a
 * separate, audio-level problem this doesn't attempt (would need the raw
 * recording and a purpose-built pronunciation-assessment API, not a
 * transcript). Throws on any Groq failure or malformed response — the
 * route handler turns that into a 503 the client already knows to fall
 * back to local word-match scoring for (see src/lib/audio/wordMatch.ts). */
export async function gradeSpokenAnswer(req: SpeakGradeRequest): Promise<SpeakGradeResult> {
  if (wordCount(req.transcript) < MIN_WORDS) {
    return {
      correct: false,
      addressedPrompt: false,
      grammarIssues: [],
      feedback: 'Good try — say a little more next time.',
    };
  }

  const parsed = await callGroqForJsonFast(buildPrompt(req));
  if (!isPlausibleResult(parsed)) {
    throw new Error(`Groq returned an unexpected shape: ${JSON.stringify(parsed).slice(0, 300)}`);
  }
  return parsed;
}
