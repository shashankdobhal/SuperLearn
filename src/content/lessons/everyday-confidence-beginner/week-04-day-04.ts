import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=4: "Practice with Translation" (translation, quest 1) +
// "Speak It" (speaking, quest 2). No "Learn the Rule" quest — applies
// Day 3's frequency adverbs to the "How often...?" question form via
// translation.
export const week04Day04: DayLesson = {
  week: 4,
  day: 4,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Say how often you do things',

  learnFlow: [
    {
      type: 'build',
      id: 'translate-how-often',
      quest: 1,
      promptHi: 'आप कितनी बार exercise करते हैं?',
      answer: ['How', 'often', 'do', 'you', 'exercise?'],
      hint: { pattern: 'How often do you + [verb]?', example: 'How often do you read?' },
    },
    {
      type: 'build',
      id: 'translate-answer-often',
      quest: 1,
      promptHi: 'मैं हफ्ते में तीन बार exercise करता हूँ।',
      answer: ['I', 'exercise', 'three', 'times', 'a', 'week.'],
      hint: { pattern: 'I + [verb] + [number] times a week.', example: 'I go swimming twice a week.' },
    },
    {
      type: 'build',
      id: 'translate-usually',
      quest: 1,
      promptHi: 'मैं आमतौर पर रात को खाना बनाता हूँ।',
      answer: ['I', 'usually', 'cook', 'dinner', 'at', 'night.'],
      hint: { pattern: 'I usually + [verb].', example: 'I usually cook lunch.' },
    },
    {
      type: 'build',
      id: 'translate-sometimes',
      quest: 1,
      promptHi: 'मैं कभी-कभी weekend पर बाहर खाना खाता हूँ।',
      answer: ['I', 'sometimes', 'eat', 'out', 'on', 'weekends.'],
      hint: { pattern: 'I sometimes + [verb].', example: 'I sometimes eat out on Fridays.' },
    },
    {
      type: 'build',
      id: 'translate-never',
      quest: 1,
      promptHi: 'मैं कभी भी सुबह नाश्ता नहीं छोड़ता।',
      answer: ['I', 'never', 'skip', 'breakfast', 'in', 'the', 'morning.'],
      hint: { pattern: 'I never + [verb].', example: 'I never skip breakfast.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-how-often',
      quest: 2,
      promptEn: 'Ask someone how often they exercise (say the question aloud).',
      promptHi: 'किसी से पूछिए वह कितनी बार exercise करता है (सवाल ज़ोर से बोलिए)।',
      hint: { pattern: 'How often do you + [verb]?', example: 'How often do you exercise?' },
    },
    {
      id: 'speak-answer',
      quest: 2,
      promptEn: 'Now answer that question for yourself.',
      promptHi: 'अब खुद के लिए उस सवाल का जवाब दीजिए।',
      hint: { pattern: 'I + [verb] + [number] times a week.', example: 'I exercise three times a week.' },
    },
    {
      id: 'speak-usually',
      quest: 2,
      promptEn: 'Say one thing you usually do and how often.',
      promptHi: 'बताइए आप आमतौर पर क्या करते हैं और कितनी बार।',
    },
    {
      id: 'speak-combo',
      quest: 2,
      promptEn: 'Combine two routine activities, each with how often you do them.',
      promptHi: 'दो routine activities को मिलाइए, दोनों में यह बताइए कि आप उन्हें कितनी बार करते हैं।',
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Now say how often you do 2-3 things, naturally.',
      promptHi: 'अब बताइए आप 2-3 चीज़ें कितनी बार करते हैं, natural तरीके से।',
      isFinal: true,
    },
  ],
};
