import type { BlueprintDay, DesignRule, QuestType, Skill } from './blueprint';
import { questTypesForDay } from './blueprint';
import type { DayLesson } from '../../src/lib/curriculum/lesson-types';

/** Picks the `count` existing lessons whose quest-type sequence is closest
 * to the target day's — same length and most types matching first (in
 * order), so the model sees a real worked example of the exact day shape
 * it needs to produce (e.g. a "Reading + Speak" day gets an existing
 * Reading + Speak day as its example, not an unrelated shape). `allDays` is
 * the full blueprint, used to look up each existing lesson's real
 * quest-type sequence to score against. Kept to a small `count` (1-2) —
 * each example costs real prompt tokens against Groq's free-tier
 * tokens-per-minute budget (see docs/CONTENT_GENERATION.md). */
export function pickFewShotExamples(
  target: BlueprintDay,
  allDays: BlueprintDay[],
  count: number,
  existingLessons: DayLesson[],
): DayLesson[] {
  const bpByKey = new Map(allDays.map((d) => [`${d.week}-${d.day}`, d]));
  const targetTypes = questTypesForDay(target);

  function score(lesson: DayLesson): number {
    const bp = bpByKey.get(`${lesson.week}-${lesson.day}`);
    if (!bp) return -1;
    const types = questTypesForDay(bp);
    if (types.length !== targetTypes.length) return -1 - Math.abs(types.length - targetTypes.length);
    let matches = 0;
    for (let i = 0; i < types.length; i++) if (types[i] === targetTypes[i]) matches++;
    return matches;
  }

  const ranked = existingLessons.map((lesson) => ({ lesson, score: score(lesson) })).sort((a, b) => b.score - a.score);
  return ranked.slice(0, count).map((r) => r.lesson);
}

export function buildPrompt(opts: {
  day: BlueprintDay;
  skill: Skill;
  questTypes: QuestType[];
  designRules: DesignRule[];
  fewShotByQuestShape: DayLesson[];
}): string {
  const { day, skill, questTypes, designRules, fewShotByQuestShape } = opts;
  const dayQuestTypes = questTypesForDay(day);
  const relevantQuestTypes = questTypes.filter((qt) => dayQuestTypes.includes(qt.quest_type.toLowerCase()));

  const examplesJson = fewShotByQuestShape.map((l) => JSON.stringify(l, null, 2)).join('\n\n---\n\n');

  return `You are authoring one day of a spoken-English curriculum for Hindi-speaking beginner learners in India. Produce ONE JSON object (no markdown fences, no commentary) matching the DayLesson TypeScript shape shown in the examples below.

## Today's blueprint (from the curriculum's source data — follow it exactly, do not invent a different structure)
- week: ${day.week}, day: ${day.day}
- week_arc: ${day.week_arc}
- weekly_outcome: ${day.weekly_outcome}
- daily_mini_outcome (this day's dailyOutcome field): ${day.daily_mini_outcome}
- quest_count: ${day.quest_count}
${dayQuestTypes.map((t, i) => `- quest_${i + 1}_type: ${t}`).join('\n')}
- grammar_language_focus: ${day.grammar_language_focus}
- vocabulary_context: ${day.vocabulary_context}
- skillId to use (exact string, do not alter): ${skill.skill_id}

## What each quest type means (task_mix is a guide, not literal steps)
${relevantQuestTypes.map((qt) => `- ${qt.quest_type}: ${qt.purpose} Typical mix: ${qt.example_task_mix}.`).join('\n')}

## Design rules
${designRules.map((r) => `- ${r.rule}: ${r.specification}`).join('\n')}

## Hard requirements
1. Only 5 task types exist: intro, rule, mcq, build (all in learnFlow), and speak (speakFlow only). Reuse them for every quest type above — never invent a new task type.
2. Every step needs an explicit "quest" number (1-based, matching quest_${'{n}'}_type above) — this is NOT inferred from task_type or array position.
3. learnFlow holds quests whose type is learn/translation/listening/reading/practice. speakFlow holds quests whose type is speaking/conversation/mission.
4. Each quest should have 5-8 total steps (tasks), except light/short days — never fewer than 4 or more than 9.
5. Every mcq needs exactly 3 options with exactly one "correct": true.
6. Every build step needs a non-empty "answer" array of English words (tokenize on spaces, punctuation attached to the preceding word, e.g. "city." not "city" + ".").
6b. A build step's "promptHi" MUST be a real, natural Hindi sentence (Devanagari script) that the learner translates into the English "answer" — it must NEVER be an English instruction like "arrange these words: My brother has a cat." that hands the learner the answer. WRONG: promptHi: "इन शब्दों को सही क्रम में रखकर वाक्य बनाइए: My brother has a cat." — this gives away the answer and tests nothing. RIGHT: promptHi: "मेरे भाई के पास एक बिल्ली है।" with answer: ["My","brother","has","a","cat."] — a genuine translation challenge. The only exception: a "retell" build step that has "audioTextEn" set (the learner reconstructs what they just heard, not translates a Hindi prompt) — for those, promptHi may be short Hindi framing text like "जो sentence आपने अभी सुना, उसे फिर से बनाइए।"
7. Only the LAST element of the whole speakFlow array gets "isFinal": true — no other step does.
8. A "Weekly Mission" quest (mission type, only on day 7) gets "missionLabel": "WEEKLY MISSION" on its one step, which must be the final speakFlow element.
9. Do not repeat the exact same example/answer/prompt sentence verbatim across steps — each task should test something distinct.
10. All Hindi text must be real, natural Hindi (Devanagari script) a beginner learner would recognize — not transliteration, not placeholder text.
11. Continuity: today's content should build on the grammar_language_focus above without re-teaching earlier weeks' patterns from scratch.
12. NEVER introduce a grammar structure that isn't in today's grammar_language_focus above, even if the daily_mini_outcome sounds like it needs one. Concretely: if daily_mini_outcome asks to "compare" two things but grammar_language_focus doesn't mention comparatives, do NOT use "-er than" forms (older than, bigger than) — instead use parallel contrast with "but" (e.g. "My hometown is quiet, but Mumbai is busy.") or "both...and" for similarities. This applies generally: only use what's listed in grammar_language_focus, or grammar already covered in earlier weeks — never something scheduled for a later week.
13. Every field shown in the worked examples below is REQUIRED unless the field is absent in ALL of the examples for that step type — do not drop a field just because it feels optional. In particular: every "intro" step needs emoji + textHi + textEn. Every "rule" step needs pattern + example + textHi. Every "mcq" option needs id + text + correct. Every "build" step needs a "hint" object with BOTH "pattern" and "example" — never omit hint, and never write a hint with only "example" and no "pattern". A "speak" step's "hint" is optional, but if you include one, it also needs both "pattern" and "example".
14. Every "rule" step MUST also have a "breakdown": an array of 2-6 chunks that walks through the "example" sentence piece by piece, each { "text", "labelHi", "labelEn" }. The "text" values joined with single spaces must equal "example" EXACTLY (same words, same punctuation, same capitalisation). Chunk by meaning (e.g. subject / verb / detail), not word-by-word unless each word does a distinct job. "labelEn" is a short plain-language note (1-5 words) on what that chunk means or does; "labelHi" is the same in simple Hindi (Devanagari, English words allowed where natural). Example: example "My birthday is in January." -> [{"text":"My birthday","labelHi":"मेरा जन्मदिन","labelEn":"my birthday"},{"text":"is in","labelHi":"जब it is","labelEn":"when it is"},{"text":"January.","labelHi":"महीने का नाम","labelEn":"the month"}]

## Worked examples of the exact JSON shape expected (from other days — follow this structure precisely, but write entirely new content for today's topic)
${examplesJson}

Now output ONLY the JSON object for week=${day.week}, day=${day.day}. No explanation, no markdown code fences, just the raw JSON object.`;
}
