import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=2: quest_count=2 — "Learn the Rule" (learn) then "Speak It"
// (speaking) only. Unlike Day 1, this day has no translation/build quest
// (activity_mix: "Learn + Speak"), so learnFlow below is intro+rule+mcq only
// — a deliberately lighter day per Design Rules ("some days may use only
// 1–2 modes"), not a gap in the content.
//
// days.json's primary_skills says "introduce_yourself" for this day too
// (same as Day 1); kept as skills.json's "introduce_self" id, same
// spelling-mismatch note as week-01-day-01.ts.
export const week01Day02: DayLesson = {
  week: 1,
  day: 2,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Say where you live and what you do',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '🏠',
      textHi: 'आज हम सीखेंगे कि आप कहाँ रहते हैं और क्या करते हैं — यह English में कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to say where you live and what you do in English. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-live',
      quest: 1,
      pattern: 'I live in + [Place].',
      example: 'I live in Pune.',
      textHi: 'आप कहाँ रहते हैं यह बताने के लिए यह pattern use करें।',
    },
    {
      type: 'rule',
      id: 'rule-do',
      quest: 1,
      pattern: 'I work as a / I study + [subject].',
      example: 'I study Computer Science.',
      textHi: 'आप क्या करते हैं — काम या पढ़ाई — यह बताने के लिए।',
    },
    {
      type: 'mcq',
      id: 'mcq-live',
      quest: 1,
      promptHi: 'कौन सा sentence सही तरीके से बताता है कि आप कहाँ रहते हैं?',
      promptEn: 'Which sentence correctly says where you live?',
      options: [
        { id: 'a', text: 'I live Pune in.', correct: false },
        { id: 'b', text: 'I in live Pune.', correct: false },
        { id: 'c', text: 'I live in Pune.', correct: true },
      ],
      explanationHi: 'सही! "I live in + [Place]" ऐसे काम करता है।',
      explanationEn: 'Correct! "I live in + [Place]" works like this.',
    },
    {
      type: 'mcq',
      id: 'mcq-do',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'आप क्या करते हैं यह बताने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to say what you do.',
      options: [
        { id: 'a', text: 'Study I English literature.', correct: false },
        { id: 'b', text: 'I studying English literature.', correct: false },
        { id: 'c', text: 'I study English literature.', correct: true },
      ],
      hint: { pattern: 'I work as a / I study + [subject]', example: 'I study Computer Science.' },
      explanationHi: 'बढ़िया! "I study + [subject]" ऐसे काम करता है।',
      explanationEn: 'Great! "I study + [subject]" works like this.',
    },
  ],

  speakFlow: [
    {
      id: 'speak-live',
      quest: 2,
      promptEn: 'Say where you live.',
      promptHi: 'बताइए आप कहाँ रहते हैं।',
      hint: { pattern: 'I live in + [Place]', example: 'I live in Pune.' },
    },
    {
      id: 'speak-do',
      quest: 2,
      promptEn: 'Now say what you do — your work or your studies.',
      promptHi: 'अब बताइए आप क्या करते हैं — काम या पढ़ाई।',
      hint: { pattern: 'I work as a / I study + [subject]', example: 'I study Computer Science.' },
    },
    {
      id: 'speak-combine',
      quest: 2,
      promptEn: 'Say where you live and what you do in one sentence.',
      promptHi: 'एक ही sentence में बताइए आप कहाँ रहते हैं और क्या करते हैं।',
      hint: {
        pattern: 'I live in + [Place], and I work as a / study + [subject]',
        example: 'I live in Pune, and I study Computer Science.',
      },
    },
    {
      id: 'speak-again',
      quest: 2,
      promptEn: 'Try again, a little faster this time — where you live and what you do.',
      promptHi: 'फिर से बोलिए, इस बार थोड़ा तेज़ — कहाँ रहते हैं और क्या करते हैं।',
      hint: {
        pattern: 'I live in + [Place], and I work as a / study + [subject]',
        example: 'I live in Pune, and I study Computer Science.',
      },
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Last one — tell me where you live and what you do, as if you just met someone new.',
      promptHi: 'आखिरी सवाल — बताइए आप कहाँ रहते हैं और क्या करते हैं, जैसे आप किसी नए व्यक्ति से मिले हों।',
      isFinal: true,
    },
  ],
};
