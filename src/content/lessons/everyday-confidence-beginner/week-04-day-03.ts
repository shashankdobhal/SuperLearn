import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=3: "Learn the Rule" (learn, quest 1) + "Practice It"
// (practice, quest 2) + "Speak It" (speaking, quest 3). New grammar:
// frequency adverbs (always/usually/sometimes/never) and their position.
export const week04Day03: DayLesson = {
  week: 4,
  day: 3,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Use time expressions in routine sentences',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '⏰',
      textHi: 'आज हम सीखेंगे usually, sometimes, और never जैसे शब्द कैसे use करें। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to use words like usually, sometimes, and never. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-frequency',
      quest: 1,
      pattern: 'I + [always/usually/sometimes/never] + [verb].',
      example: 'I usually walk to work.',
      textHi: 'आप कितनी बार कुछ करते हैं, यह बताने के लिए frequency adverb use करें।',
    },
    {
      type: 'rule',
      id: 'rule-frequency-be',
      quest: 1,
      pattern: 'I am + [always/usually/sometimes/never] + [adjective].',
      example: 'I am usually tired in the evening.',
      textHi: "'be' के साथ frequency adverb sentence के बीच में आता है।",
    },
    {
      type: 'mcq',
      id: 'mcq-frequency',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I always am busy in the morning.', correct: false },
        { id: 'b', text: 'I am always busy in the morning.', correct: true },
        { id: 'c', text: 'Always I am busy in the morning.', correct: false },
      ],
      explanationHi: 'सही! "be" verb के बाद frequency adverb आता है।',
      explanationEn: 'Correct! The frequency adverb comes after the "be" verb.',
    },
    {
      type: 'mcq',
      id: 'mcq-frequency-2',
      quest: 1,
      isPopQuiz: true,
      promptHi: "'usually' के साथ सही sentence चुनें।",
      promptEn: "Choose the correct sentence with 'usually'.",
      options: [
        { id: 'a', text: 'I usually walk to work.', correct: true },
        { id: 'b', text: 'I walk usually to work.', correct: false },
        { id: 'c', text: 'Usually I to work walk.', correct: false },
      ],
      hint: { pattern: 'I usually + [verb].', example: 'I usually take the bus.' },
      explanationHi: 'बढ़िया! एक साधारण verb से पहले frequency adverb आता है।',
      explanationEn: 'Great! The frequency adverb comes before a plain verb.',
    },
    {
      type: 'build',
      id: 'practice-sometimes',
      quest: 2,
      promptHi: 'मैं कभी-कभी weekend पर देर से उठता हूँ।',
      answer: ['I', 'sometimes', 'wake', 'up', 'late', 'on', 'weekends.'],
      hint: { pattern: 'I sometimes + [verb].', example: 'I sometimes sleep late.' },
    },
    {
      type: 'build',
      id: 'practice-never',
      quest: 2,
      promptHi: 'मैं कभी भी नाश्ता नहीं छोड़ता।',
      answer: ['I', 'never', 'skip', 'breakfast.'],
      hint: { pattern: 'I never + [verb].', example: 'I never skip lunch.' },
    },
    {
      type: 'mcq',
      id: 'practice-order',
      quest: 2,
      promptHi: 'कौन सा sentence सही क्रम में है?',
      promptEn: 'Which sentence has the correct word order?',
      options: [
        { id: 'a', text: 'I never am late.', correct: false },
        { id: 'b', text: 'I am never late.', correct: true },
        { id: 'c', text: 'Never I am late.', correct: false },
      ],
      explanationHi: 'सही! "am" के बाद "never" आता है।',
      explanationEn: 'Correct! "never" comes right after "am".',
    },
    {
      type: 'build',
      id: 'practice-always',
      quest: 2,
      promptHi: 'मैं हमेशा रात को 10 बजे सोता हूँ।',
      answer: ['I', 'always', 'go', 'to', 'bed', 'at', '10', 'pm.'],
      hint: { pattern: 'I always + [verb].', example: 'I always brush my teeth before bed.' },
    },
    {
      type: 'build',
      id: 'practice-combo',
      quest: 2,
      promptHi: 'मैं आमतौर पर 7 बजे उठता हूँ, लेकिन कभी-कभी देर से उठता हूँ।',
      answer: ['I', 'usually', 'wake', 'up', 'at', '7,', 'but', 'I', 'sometimes', 'wake', 'up', 'late.'],
      hint: { pattern: 'I usually + [verb], but I sometimes + [verb].', example: 'I usually walk, but I sometimes take the bus.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-usually',
      quest: 3,
      promptEn: 'Say one thing you usually do in the morning.',
      promptHi: 'बताइए आप सुबह आमतौर पर क्या करते हैं।',
      hint: { pattern: 'I usually + [verb].', example: 'I usually check my phone.' },
    },
    {
      id: 'speak-sometimes',
      quest: 3,
      promptEn: 'Say one thing you sometimes do.',
      promptHi: 'बताइए आप कभी-कभी क्या करते हैं।',
      hint: { pattern: 'I sometimes + [verb].', example: 'I sometimes cook breakfast.' },
    },
    {
      id: 'speak-never',
      quest: 3,
      promptEn: 'Say one thing you never do.',
      promptHi: 'बताइए ऐसी कोई चीज़ जो आप कभी नहीं करते।',
      hint: { pattern: 'I never + [verb].', example: 'I never skip breakfast.' },
    },
    {
      id: 'speak-combo',
      quest: 3,
      promptEn: 'Combine usually, sometimes, and never into your routine.',
      promptHi: 'अपनी routine में usually, sometimes, और never को मिलाइए।',
    },
    {
      id: 'speak-final',
      quest: 3,
      promptEn: 'Now describe your routine using time expressions naturally.',
      promptHi: 'अब अपनी routine को time expressions के साथ natural तरीके से बताइए।',
      isFinal: true,
    },
  ],
};
