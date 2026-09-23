import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=2: "Learn the Rule" (learn, quest 1) + "Speak It" (speaking,
// quest 2). Flips Day 1's statements into questions, same "week's
// statement day, then question day" shape as week-01-day-0{3,4}.ts.
export const week03Day02: DayLesson = {
  week: 3,
  day: 2,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Ask someone what they like',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '❓',
      textHi: 'आज हम सीखेंगे कि किसी से उसकी पसंद के बारे में कैसे पूछें। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to ask someone about their preferences. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-do-you-like',
      quest: 1,
      pattern: 'Do you like + [noun / verb-ing]?',
      example: 'Do you like cooking?',
      textHi: 'किसी से पूछने के लिए कि उसे कोई चीज़ पसंद है या नहीं।',
    },
    {
      type: 'rule',
      id: 'rule-what-like',
      quest: 1,
      pattern: 'What do you like to do + [in your free time]?',
      example: 'What do you like to do in your free time?',
      textHi: 'किसी की पसंद के बारे में खुला सवाल पूछने के लिए।',
    },
    {
      type: 'mcq',
      id: 'mcq-do-you-like',
      quest: 1,
      promptHi: 'किसी से पसंद पूछने का सही तरीका कौन सा है?',
      promptEn: 'Which is the correct way to ask about a preference?',
      options: [
        { id: 'a', text: 'You like cooking?', correct: false },
        { id: 'b', text: 'Do you like cooking?', correct: true },
        { id: 'c', text: 'Do you liking cooking?', correct: false },
      ],
      explanationHi: 'सही! "Do you like + [verb-ing]?" ऐसे काम करता है।',
      explanationEn: 'Correct! "Do you like + [verb-ing]?" works like this.',
    },
    {
      type: 'mcq',
      id: 'mcq-what-like',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'कोई क्या करना पसंद करता है, यह पूछने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to ask what someone likes to do.',
      options: [
        { id: 'a', text: 'What you like to do?', correct: false },
        { id: 'b', text: 'What do you like to do?', correct: true },
        { id: 'c', text: 'What do you like doing to?', correct: false },
      ],
      hint: { pattern: 'What do you like to + [verb]?', example: 'What do you like to eat?' },
      explanationHi: 'बढ़िया! "What do you like to + [verb]?" ऐसे काम करता है।',
      explanationEn: 'Great! "What do you like to + [verb]?" works like this.',
    },
  ],

  speakFlow: [
    {
      id: 'ask-like',
      quest: 2,
      promptEn: 'Ask Nova if she likes reading.',
      promptHi: 'Nova से पूछिए क्या उसे पढ़ना पसंद है।',
      hint: { pattern: 'Do you like + [verb-ing]?', example: 'Do you like reading?' },
    },
    {
      id: 'ask-what-free-time',
      quest: 2,
      promptEn: 'Ask Nova what she likes to do in her free time.',
      promptHi: 'Nova से पूछिए वह अपने खाली समय में क्या करना पसंद करती है।',
      hint: { pattern: 'What do you like to do in your free time?', example: 'What do you like to do in your free time?' },
    },
    {
      id: 'ask-love-hate',
      quest: 2,
      promptEn: 'Ask Nova if she loves or hates something specific, like coffee or sports.',
      promptHi: 'Nova से पूछिए क्या उसे कोई खास चीज़ बहुत पसंद है या बिल्कुल पसंद नहीं है।',
      hint: { pattern: 'Do you love/hate + [noun]?', example: 'Do you love coffee?' },
    },
    {
      id: 'ask-combo',
      quest: 2,
      promptEn: 'Ask Nova two questions about her preferences in a row.',
      promptHi: 'Nova से लगातार दो सवाल उसकी पसंद के बारे में पूछिए।',
    },
    {
      id: 'ask-final',
      quest: 2,
      promptEn: "Now ask Nova about her hobbies, like you just met her.",
      promptHi: 'अब Nova से उसके hobbies के बारे में पूछिए, जैसे आप अभी उससे मिले हों।',
      isFinal: true,
    },
  ],
};
