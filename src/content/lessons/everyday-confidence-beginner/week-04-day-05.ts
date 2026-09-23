import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=5: "Read & Understand" (reading, quest 1) + "Speak It"
// (speaking, quest 2) — same reading-quest shape as week-02-day-03.ts.
export const week04Day05: DayLesson = {
  week: 4,
  day: 5,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Compare weekdays and weekends',

  learnFlow: [
    {
      type: 'intro',
      id: 'read-passage',
      quest: 1,
      emoji: '📖',
      textHi: 'यह छोटा paragraph पढ़िए और समझने की कोशिश करिए।',
      textEn:
        'On weekdays, I wake up early and go to work. I am usually busy and tired in the evening. But on weekends, I wake up late and relax at home. I never work on Sundays.',
    },
    {
      type: 'mcq',
      id: 'read-identify',
      quest: 1,
      promptHi: 'Paragraph के अनुसार, writer weekdays पर कब उठता है?',
      promptEn: 'According to the paragraph, when does the writer wake up on weekdays?',
      options: [
        { id: 'a', text: 'Early.', correct: true },
        { id: 'b', text: 'Late.', correct: false },
        { id: 'c', text: 'At noon.', correct: false },
      ],
      explanationHi: 'सही! Paragraph कहता है "I wake up early and go to work" weekdays पर।',
      explanationEn: 'Correct! The paragraph says "I wake up early and go to work" on weekdays.',
    },
    {
      type: 'mcq',
      id: 'read-meaning',
      quest: 1,
      promptHi: "'Relax' शब्द का मतलब क्या है?",
      promptEn: "What does the word 'relax' mean?",
      options: [
        { id: 'a', text: 'आराम करना', correct: true },
        { id: 'b', text: 'काम करना', correct: false },
        { id: 'c', text: 'जल्दी करना', correct: false },
      ],
      explanationHi: 'सही! "Relax" यानी आराम करना।',
      explanationEn: 'Correct! "Relax" means to rest.',
    },
    {
      type: 'mcq',
      id: 'read-contrast',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'Writer weekdays और weekends में मुख्य अंतर क्या बताता है?',
      promptEn: "What's the main contrast the writer makes between weekdays and weekends?",
      options: [
        { id: 'a', text: 'Busy vs relaxed.', correct: true },
        { id: 'b', text: 'Rainy vs sunny.', correct: false },
        { id: 'c', text: 'Expensive vs cheap.', correct: false },
      ],
      explanationHi: 'सही! Weekdays पर busy, weekends पर relaxed।',
      explanationEn: 'Correct! Busy on weekdays, relaxed on weekends.',
    },
    {
      type: 'build',
      id: 'read-retell',
      quest: 1,
      promptHi: 'Paragraph के हिसाब से, writer कभी भी Sunday को काम नहीं करता — यह sentence अंग्रेज़ी में फिर से बनाइए।',
      answer: ['I', 'never', 'work', 'on', 'Sundays.'],
      hint: { pattern: 'I never + [verb] + on + [day].', example: 'I never work on Sundays.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-weekday',
      quest: 2,
      promptEn: 'Say what you usually do on a weekday.',
      promptHi: 'बताइए आप weekday पर आमतौर पर क्या करते हैं।',
      hint: { pattern: 'On weekdays, I + [verb].', example: 'On weekdays, I wake up early.' },
    },
    {
      id: 'speak-weekend',
      quest: 2,
      promptEn: 'Say what you usually do on a weekend.',
      promptHi: 'बताइए आप weekend पर आमतौर पर क्या करते हैं।',
      hint: { pattern: 'On weekends, I + [verb].', example: 'On weekends, I wake up late.' },
    },
    {
      id: 'speak-contrast',
      quest: 2,
      promptEn: "Combine both using 'but' to show the difference.",
      promptHi: "दोनों को 'but' से मिलाकर अंतर बताइए।",
      hint: { pattern: 'On weekdays, I..., but on weekends, I...', example: 'On weekdays, I wake up early, but on weekends, I wake up late.' },
    },
    {
      id: 'speak-feeling',
      quest: 2,
      promptEn: 'Say how you usually feel on weekdays compared to weekends.',
      promptHi: 'बताइए weekdays पर आप कैसा महसूस करते हैं, weekends की तुलना में।',
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Now compare your weekdays and weekends fully, naturally.',
      promptHi: 'अब अपने weekdays और weekends की पूरी तुलना natural तरीके से कीजिए।',
      isFinal: true,
    },
  ],
};
