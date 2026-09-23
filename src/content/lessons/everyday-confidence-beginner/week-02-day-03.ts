import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=3: "Read & Understand" (reading, quest 1) + "Speak It"
// (speaking, quest 2).
//
// New quest type for the app: Reading. Follows the same reuse pattern as
// Listening (week-01-day-03.ts) but without audioTextEn — the intro step
// carries a short written passage as textEn/textHi instead of an audio
// line, per quest-types.json's "Read → notice → meaning → choose response →
// speak" mix.
export const week02Day03: DayLesson = {
  week: 2,
  day: 3,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Describe your neighborhood',

  learnFlow: [
    {
      type: 'intro',
      id: 'read-passage',
      quest: 1,
      emoji: '📖',
      textHi: 'यह छोटा paragraph पढ़िए और समझने की कोशिश करिए।',
      textEn:
        'My neighborhood is quiet and green. There is a small park near my house, and there are many trees. The market is next to the park. I like my neighborhood because it is peaceful.',
    },
    {
      type: 'mcq',
      id: 'read-identify',
      quest: 1,
      promptHi: 'Paragraph के अनुसार, park कहाँ है?',
      promptEn: 'According to the paragraph, where is the park?',
      options: [
        { id: 'a', text: "Near the writer's house.", correct: true },
        { id: 'b', text: 'Far from the house.', correct: false },
        { id: 'c', text: 'Next to the school.', correct: false },
      ],
      explanationHi: 'सही! Paragraph कहता है "a small park near my house".',
      explanationEn: 'Correct! The paragraph says "a small park near my house".',
    },
    {
      type: 'mcq',
      id: 'read-meaning',
      quest: 1,
      promptHi: "'Peaceful' शब्द का मतलब क्या है?",
      promptEn: "What does the word 'peaceful' mean?",
      options: [
        { id: 'a', text: 'शांत / आरामदायक', correct: true },
        { id: 'b', text: 'शोर वाला', correct: false },
        { id: 'c', text: 'भीड़ वाला', correct: false },
      ],
      explanationHi: 'सही! "Peaceful" यानी शांत।',
      explanationEn: 'Correct! "Peaceful" means calm and quiet.',
    },
    {
      type: 'mcq',
      id: 'read-response',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'Writer अपने neighborhood के बारे में क्या महसूस करता है?',
      promptEn: 'How does the writer feel about their neighborhood?',
      options: [
        { id: 'a', text: 'They like it.', correct: true },
        { id: 'b', text: 'They dislike it.', correct: false },
        { id: 'c', text: 'They feel nothing about it.', correct: false },
      ],
      explanationHi: 'सही! Paragraph कहता है "I like my neighborhood because it is peaceful."',
      explanationEn: 'Correct! The paragraph says "I like my neighborhood because it is peaceful."',
    },
    {
      type: 'build',
      id: 'read-retell',
      quest: 1,
      promptHi: 'Paragraph के हिसाब से, market park के बगल में है — यह sentence अंग्रेज़ी में फिर से बनाइए।',
      answer: ['The', 'market', 'is', 'next', 'to', 'the', 'park.'],
      hint: { pattern: '[A] + is next to + [B].', example: 'The school is next to the bank.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-name',
      quest: 2,
      promptEn: 'Say the name of your neighborhood or area.',
      promptHi: 'अपने neighborhood या area का नाम बताइए।',
    },
    {
      id: 'speak-there-is',
      quest: 2,
      promptEn: 'Say one thing there is in your neighborhood.',
      promptHi: 'बताइए आपके neighborhood में क्या है।',
      hint: { pattern: 'There is/are + [noun].', example: 'There is a small temple near my house.' },
    },
    {
      id: 'speak-adjective',
      quest: 2,
      promptEn: 'Describe your neighborhood with an adjective.',
      promptHi: 'अपने neighborhood को एक adjective से describe कीजिए।',
      hint: { pattern: 'My neighborhood is + [adjective].', example: 'My neighborhood is quiet.' },
    },
    {
      id: 'speak-reason',
      quest: 2,
      promptEn: 'Say why you like (or dislike) your neighborhood.',
      promptHi: 'बताइए आपको अपना neighborhood क्यों पसंद है (या नहीं)।',
      hint: { pattern: 'I like it because + [clause].', example: 'I like it because it is peaceful.' },
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Now describe your neighborhood fully, like the paragraph you just read.',
      promptHi: 'अब अपने neighborhood को पूरी तरह describe कीजिए, जैसे आपने अभी paragraph में पढ़ा।',
      isFinal: true,
    },
  ],
};
