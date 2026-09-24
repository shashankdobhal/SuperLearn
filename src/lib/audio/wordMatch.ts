/** Normalizes a phrase into lowercase, punctuation-stripped words —
 * matches how BuildCard already tokenizes its answer arrays, so scoring
 * logic stays consistent across the app. */
function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?'"]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export interface SpeakMatchResult {
  correct: boolean;
  wordsUsed: number;
  matchedWords: string[];
  missingWords: string[];
}

/**
 * Speaking prompts are open-ended (no single correct sentence the way a
 * BuildCard exercise has an exact `answer`), so this can't be an exact
 * match. Instead: if the step has a `hint.example` (a model sentence for
 * that prompt), score how much of its vocabulary shows up in what the
 * learner actually said — a lenient "did you use the target
 * pattern/words" check, not a strict transcript comparison. Without a
 * hint, there's nothing concrete to match against, so this just checks
 * the learner said *something* substantial (a minimum word count) rather
 * than blocking on a reference that doesn't exist.
 */
export function scoreSpokenAnswer(transcript: string, referenceExample?: string): SpeakMatchResult {
  const spokenWords = normalizeWords(transcript);
  const wordsUsed = spokenWords.length;

  if (!referenceExample) {
    return { correct: wordsUsed >= 3, wordsUsed, matchedWords: [], missingWords: [] };
  }

  const spokenSet = new Set(spokenWords);
  const referenceWords = normalizeWords(referenceExample);
  // Skip the shortest, grammatically-load-bearing-but-not-content words
  // (articles/pronouns/"to be") so scoring reflects real vocabulary use,
  // not just accidentally matching "is"/"a"/"the".
  const STOPWORDS = new Set(['i', 'a', 'an', 'the', 'is', 'are', 'am', 'to', 'my', 'your', 'and']);
  const keyReferenceWords = referenceWords.filter((w) => !STOPWORDS.has(w));

  const matchedWords = keyReferenceWords.filter((w) => spokenSet.has(w));
  const missingWords = keyReferenceWords.filter((w) => !spokenSet.has(w));
  const overlapRatio = keyReferenceWords.length > 0 ? matchedWords.length / keyReferenceWords.length : 1;

  return {
    correct: overlapRatio >= 0.4 && wordsUsed >= 3,
    wordsUsed,
    matchedWords,
    missingWords,
  };
}
