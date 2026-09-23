import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=2: "Learn the Rule" (learn, quest 1) + "Practice It"
// (practice, quest 2) + "Speak It" (speaking, quest 3).
//
// New grammar: prepositions of place (near/next to/in front of/behind). The
// Practice quest follows the Quest Blueprint's "Choice → completion →
// transformation → translation → guided speech" mix — reusing mcq/build
// (see quest-types.json) rather than inventing a new task type.
export const week02Day02: DayLesson = {
  week: 2,
  day: 2,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Say where places are',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '📍',
      textHi: 'आज हम सीखेंगे कि जगहें कहाँ हैं, यह कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to say where places are. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-near',
      quest: 1,
      pattern: '[Place A] + is near + [Place B].',
      example: 'The market is near my house.',
      textHi: 'कोई जगह पास में है, यह बताने के लिए।',
    },
    {
      type: 'rule',
      id: 'rule-next-to',
      quest: 1,
      pattern: '[Place A] + is next to + [Place B].',
      example: 'The school is next to the park.',
      textHi: 'कोई जगह बिल्कुल बगल में है, यह बताने के लिए।',
    },
    {
      type: 'rule',
      id: 'rule-front-behind',
      quest: 1,
      pattern: '[Place A] + is in front of / behind + [Place B].',
      example: 'The bus stop is in front of the bank.',
      textHi: 'कोई जगह सामने या पीछे है, यह बताने के लिए।',
    },
    {
      type: 'mcq',
      id: 'mcq-near',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'The market near my house.', correct: false },
        { id: 'b', text: 'The market is near my house.', correct: true },
        { id: 'c', text: 'The market is near of my house.', correct: false },
      ],
      explanationHi: 'सही! "is near" के बाद सीधे जगह आती है, "of" ज़रूरी नहीं।',
      explanationEn: 'Correct! "is near" is followed directly by the place, no "of" needed.',
    },
    {
      type: 'mcq',
      id: 'mcq-behind',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'सही तरीका चुनें जब कोई जगह पीछे हो।',
      promptEn: 'Choose the correct way to say a place is behind another.',
      options: [
        { id: 'a', text: 'The park is behind of the school.', correct: false },
        { id: 'b', text: 'The park behind the school.', correct: false },
        { id: 'c', text: 'The park is behind the school.', correct: true },
      ],
      hint: { pattern: '[Place A] + is behind + [Place B].', example: 'The bag is behind the door.' },
      explanationHi: 'सही! "is behind" के बाद सीधे जगह आती है।',
      explanationEn: 'Correct! "is behind" is followed directly by the place.',
    },
    {
      type: 'mcq',
      id: 'practice-choice',
      quest: 2,
      promptHi: 'सही preposition चुनें: The bank ___ my office.',
      promptEn: 'Choose the correct preposition: The bank ___ my office.',
      options: [
        { id: 'a', text: 'is next to', correct: true },
        { id: 'b', text: 'is next', correct: false },
        { id: 'c', text: 'next to is', correct: false },
      ],
      explanationHi: 'सही! "is next to" पूरा phrase है।',
      explanationEn: 'Correct! "is next to" is the full phrase.',
    },
    {
      type: 'build',
      id: 'practice-behind',
      quest: 2,
      promptHi: 'पार्क स्कूल के पीछे है।',
      answer: ['The', 'park', 'is', 'behind', 'the', 'school.'],
      hint: { pattern: '[A] + is behind + [B].', example: 'The bag is behind the door.' },
    },
    {
      type: 'build',
      id: 'practice-front',
      quest: 2,
      promptHi: 'बस स्टॉप बैंक के सामने है।',
      answer: ['The', 'bus', 'stop', 'is', 'in', 'front', 'of', 'the', 'bank.'],
      hint: { pattern: '[A] + is in front of + [B].', example: 'The car is in front of the house.' },
    },
    {
      type: 'build',
      id: 'practice-next',
      quest: 2,
      promptHi: 'मेरा घर एक बड़े park के बगल में है।',
      answer: ['My', 'house', 'is', 'next', 'to', 'a', 'big', 'park.'],
      hint: { pattern: '[A] + is next to + [B].', example: 'My office is next to a bank.' },
    },
    {
      type: 'mcq',
      id: 'practice-transform',
      quest: 2,
      isPopQuiz: true,
      promptHi: 'कौन सा sentence भी सही तरीके से यह कहता है कि market bank के सामने है?',
      promptEn: 'Which sentence also correctly says the market is in front of the bank?',
      options: [
        { id: 'a', text: 'The bank is behind the market.', correct: true },
        { id: 'b', text: 'The market behind the bank.', correct: false },
        { id: 'c', text: 'The bank is near of the market.', correct: false },
      ],
      explanationHi: 'सही! अगर market bank के सामने है, तो bank market के पीछे है — यह एक ही बात है।',
      explanationEn: 'Correct! If the market is in front of the bank, the bank is behind the market — same meaning.',
    },
    {
      type: 'build',
      id: 'practice-combo',
      quest: 2,
      promptHi: 'मेरे घर के पास एक market है, और वह school के बगल में है।',
      answer: ['There', 'is', 'a', 'market', 'near', 'my', 'house,', 'and', 'it', 'is', 'next', 'to', 'the', 'school.'],
      hint: {
        pattern: 'There is a/an + [noun] + near + [place], and it is next to + [place].',
        example: 'There is a park near my house, and it is next to the market.',
      },
    },
  ],

  speakFlow: [
    {
      id: 'speak-near',
      quest: 3,
      promptEn: 'Say one place that is near your house.',
      promptHi: 'बताइए कोई एक जगह जो आपके घर के पास है।',
      hint: { pattern: '[Place] + is near my house.', example: 'The market is near my house.' },
    },
    {
      id: 'speak-next-to',
      quest: 3,
      promptEn: 'Say one place that is next to another place you know.',
      promptHi: 'बताइए कोई जगह जो किसी और जगह के बगल में है।',
      hint: { pattern: '[Place A] + is next to + [Place B].', example: 'My school is next to a park.' },
    },
    {
      id: 'speak-front-behind',
      quest: 3,
      promptEn: 'Say what is in front of or behind your house.',
      promptHi: 'बताइए आपके घर के सामने या पीछे क्या है।',
      hint: { pattern: '[Place] + is in front of / behind + [Place].', example: 'A park is in front of my house.' },
    },
    {
      id: 'speak-combo',
      quest: 3,
      promptEn: 'Now describe where two or three places are, near your home.',
      promptHi: 'अब बताइए दो-तीन जगहें आपके घर के आस-पास कहाँ हैं।',
    },
    {
      id: 'speak-final',
      quest: 3,
      promptEn: "Say it all together, like you're giving someone directions to your home.",
      promptHi: 'यह सब एक साथ बोलिए, जैसे आप किसी को अपने घर का रास्ता बता रहे हों।',
      isFinal: true,
    },
  ],
};
