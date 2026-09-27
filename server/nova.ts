import { callGroqForJsonFast } from './groq';

export interface NovaTurn {
  role: 'nova' | 'user';
  text: string;
}

export interface NovaReplyResult {
  reply: string;
}

export interface NovaReportResult {
  overallFeedback: string;
  grammarIssues: string[];
  vocabularyNotes: string[];
}

// v1 is deliberately fixed-difficulty, natural/responsive conversation —
// not adaptive difficulty (that would need a running proficiency signal fed
// back into this prompt, a real feature, not just a prompt tweak).
//
// This prompt went through one real revision already: the first version
// ("friendly conversation partner... ask a follow-up question") produced
// technically-correct but bland, interchangeable small talk — "How was
// your day?" / "What did you cook?" every time, no real personality, no
// reaction to specifics the learner actually said. The fixes below (a
// concrete personality + reacting to specific words before moving on +
// explicit repetition avoidance + a real question-type/topic bank +
// occasional non-question turns) target that directly, alongside a higher
// sampling temperature (see getNovaReply below) for actual phrasing
// variety instead of the same safest sentence every time.
const PERSONA = `You are "Nova" — a warm, genuinely curious, upbeat conversation partner helping a BEGINNER-level Hindi-speaking adult practice everyday spoken English in a free-form, timed conversation. You have a light, playful personality, not a customer-service tone.

Rules for every reply:
- Keep it SHORT: 1-2 simple sentences, beginner-friendly vocabulary and grammar (present/past simple, common everyday words) — never advanced vocabulary or complex tenses.
- REACT to something SPECIFIC the learner just said before moving on — quote or reference the actual thing they mentioned (a food, a place, a name, an activity), don't just acknowledge generically ("That's nice," "Okay," "I see" are banned as a whole reply). Show real interest or a touch of surprise/humor where it fits naturally.
- Always answer any question the learner asked you back — briefly, in character, with a specific (invented is fine) detail, not a generic non-answer.
- Vary HOW you continue the conversation — don't default to a question every single turn. Mix in: an opinion ("I think that sounds fun!"), a light reaction, a related comment, occasionally a question — across a conversation, avoid asking the same shape of question twice in a row (e.g. don't follow "what's your favorite X" with another "what's your favorite Y").
- Range across genuinely different everyday topics over the conversation — food, weekend plans, movies/shows, a hobby, a pet, a small recent memory, local weather/season, a festival or holiday — don't loop back to the same topic area you already covered.
- This is free-form speaking PRACTICE, not a lesson — never explain grammar or correct the learner mid-conversation; that happens separately, after the session ends.`;

function transcriptOf(history: NovaTurn[]): string {
  return history.map((t) => `${t.role === 'nova' ? 'Nova' : 'Learner'}: ${t.text}`).join('\n');
}

function buildReplyPrompt(history: NovaTurn[]): string {
  return `${PERSONA}

Conversation so far:
${history.length > 0 ? transcriptOf(history) : "(nothing yet — this is the very first turn: greet the learner warmly and ask an easy opening question, e.g. what's going on today.)"}

Return ONLY a JSON object with exactly this shape, no other text:
{ "reply": "Nova's next spoken line" }`;
}

function isPlausibleReply(x: unknown): x is NovaReplyResult {
  return typeof x === 'object' && x !== null && typeof (x as Record<string, unknown>).reply === 'string' && (x as Record<string, unknown>).reply !== '';
}

/** Generates Nova's next conversational line given the full turn history so
 * far — the "adaptive" part of the free-form conversation (see the Home
 * screen / SpeakCard's separate transcript-grading for the analogous
 * per-utterance case). Full history goes in on every call, matching a
 * normal multi-turn chat design, so Nova can respond to whatever the
 * learner actually said, including a question asked back at her. */
export async function getNovaReply(history: NovaTurn[]): Promise<NovaReplyResult> {
  const parsed = await callGroqForJsonFast(buildReplyPrompt(history), { temperature: 0.9 });
  if (!isPlausibleReply(parsed)) {
    throw new Error(`Groq returned an unexpected shape: ${JSON.stringify(parsed).slice(0, 300)}`);
  }
  return parsed;
}

function buildReportPrompt(history: NovaTurn[]): string {
  return `You are grading a BEGINNER-level Hindi-speaking adult learner's spoken English after a free-form practice conversation with an AI partner named Nova. Below is the full transcript.

${transcriptOf(history)}

Grade the LEARNER's English (not Nova's) ENCOURAGINGLY, for a true beginner — a few grammar slips across a 10-minute conversation are completely normal and not worth listing individually unless they're a real recurring pattern. Return ONLY a JSON object with exactly this shape, no other text:
{
  "overallFeedback": "2-3 warm, specific sentences summarizing how the learner did overall in this conversation",
  "grammarIssues": ["0-5 short, specific, beginner-friendly notes on recurring grammar patterns worth practicing — empty array if nothing worth flagging"],
  "vocabularyNotes": ["0-3 short notes on vocabulary — good word choices, or simple alternatives to try — empty array if nothing worth flagging"]
}`;
}

function isPlausibleReport(x: unknown): x is NovaReportResult {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.overallFeedback === 'string' &&
    r.overallFeedback.length > 0 &&
    Array.isArray(r.grammarIssues) &&
    r.grammarIssues.every((i) => typeof i === 'string') &&
    Array.isArray(r.vocabularyNotes) &&
    r.vocabularyNotes.every((i) => typeof i === 'string')
  );
}

/** Grades a whole conversation session at once, after the fact — not live,
 * so it doesn't share callGroqForJsonFast's tight latency budget the way a
 * live reply does, but reuses it anyway since a single completion here is
 * still small/fast. v1 grades grammar/vocabulary/relevance from the
 * transcript only — real pronunciation/fluency scoring would need the raw
 * audio and a separate purpose-built API (not built yet, see conversation
 * history on SpeakCard's grading for the same limitation). */
export async function getNovaReport(history: NovaTurn[]): Promise<NovaReportResult> {
  const userTurns = history.filter((t) => t.role === 'user' && t.text.trim().length > 0);
  if (userTurns.length === 0) {
    return {
      overallFeedback: "You didn't say much this session — jump back in and try again!",
      grammarIssues: [],
      vocabularyNotes: [],
    };
  }
  const parsed = await callGroqForJsonFast(buildReportPrompt(history));
  if (!isPlausibleReport(parsed)) {
    throw new Error(`Groq returned an unexpected shape: ${JSON.stringify(parsed).slice(0, 300)}`);
  }
  return parsed;
}
