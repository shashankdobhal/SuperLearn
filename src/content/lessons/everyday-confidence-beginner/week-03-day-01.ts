import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=1: "Learn the Rule" (learn, quest 1) + "Practice with
// Translation" (translation, quest 2) + "Speak It" (speaking, quest 3).
// New skill this week: express_preference. Grammar focus: like/love/hate;
// do/don't; hobbies; preference questions.
export const week03Day01: DayLesson = {
  week: 3,
  day: 1,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Say what you like and dislike',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '😊',
      textHi: 'आज हम सीखेंगे कि हमें क्या पसंद है और क्या नहीं, यह कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to say what we like and don't like. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-like',
      quest: 1,
      pattern: 'I like/love + [noun / verb-ing].',
      example: 'I love watching movies.',
      textHi: 'किसी चीज़ को पसंद करने के लिए like/love use करें।',
    },
    {
      type: 'rule',
      id: 'rule-dislike',
      quest: 1,
      pattern: "I don't like / I hate + [noun / verb-ing].",
      example: 'I hate waking up early.',
      textHi: "किसी चीज़ को नापसंद करने के लिए don't like/hate use करें।",
    },
    {
      type: 'mcq',
      id: 'mcq-like',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I like play cricket.', correct: false },
        { id: 'b', text: 'I like playing cricket.', correct: true },
        { id: 'c', text: 'I liking playing cricket.', correct: false },
      ],
      explanationHi: 'सही! "I like + [verb-ing]" ऐसे काम करता है।',
      explanationEn: 'Correct! "I like + [verb-ing]" works like this.',
    },
    {
      type: 'mcq',
      id: 'mcq-dislike',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'किसी चीज़ को नापसंद करने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to say you dislike something.',
      options: [
        { id: 'a', text: 'I don\'t like getting up early.', correct: true },
        { id: 'b', text: 'I not like getting up early.', correct: false },
        { id: 'c', text: "I don't liking getting up early.", correct: false },
      ],
      hint: { pattern: "I don't like + [verb-ing].", example: "I don't like waiting in line." },
      explanationHi: "बढ़िया! \"I don't like + [verb-ing]\" ऐसे काम करता है।",
      explanationEn: 'Great! "I don\'t like + [verb-ing]" works like this.',
    },
    {
      type: 'build',
      id: 'translate-love',
      quest: 2,
      promptHi: 'मुझे गाने सुनना बहुत पसंद है।',
      answer: ['I', 'love', 'listening', 'to', 'music.'],
      hint: { pattern: 'I love + [verb-ing].', example: 'I love reading books.' },
    },
    {
      type: 'build',
      id: 'translate-like',
      quest: 2,
      promptHi: 'मुझे cricket खेलना पसंद है।',
      answer: ['I', 'like', 'playing', 'cricket.'],
      hint: { pattern: 'I like + [verb-ing].', example: 'I like playing football.' },
    },
    {
      type: 'build',
      id: 'translate-dontlike',
      quest: 2,
      promptHi: 'मुझे भीड़-भाड़ पसंद नहीं है।',
      answer: ['I', "don't", 'like', 'crowds.'],
      hint: { pattern: "I don't like + [noun].", example: "I don't like noise." },
    },
    {
      type: 'build',
      id: 'translate-hate',
      quest: 2,
      promptHi: 'मुझे सुबह जल्दी उठना बिल्कुल पसंद नहीं है।',
      answer: ['I', 'hate', 'waking', 'up', 'early.'],
      hint: { pattern: 'I hate + [verb-ing].', example: 'I hate waiting in line.' },
    },
    {
      type: 'build',
      id: 'translate-combo',
      quest: 2,
      promptHi: 'मुझे किताबें पढ़ना पसंद है, लेकिन मुझे भीड़-भाड़ पसंद नहीं है।',
      answer: ['I', 'like', 'reading', 'books,', 'but', 'I', "don't", 'like', 'crowds.'],
      hint: { pattern: "I like + [verb-ing], but I don't like + [noun].", example: "I like cooking, but I don't like cleaning." },
    },
  ],

  speakFlow: [
    {
      id: 'speak-like-1',
      quest: 3,
      promptEn: 'Say one thing you like doing.',
      promptHi: 'बताइए आपको क्या करना पसंद है।',
      hint: { pattern: 'I like + [verb-ing].', example: 'I like cooking.' },
    },
    {
      id: 'speak-love',
      quest: 3,
      promptEn: 'Say one thing you love doing.',
      promptHi: 'बताइए आपको क्या करना बहुत पसंद है।',
      hint: { pattern: 'I love + [verb-ing].', example: 'I love traveling.' },
    },
    {
      id: 'speak-dislike',
      quest: 3,
      promptEn: "Say one thing you don't like.",
      promptHi: 'बताइए आपको क्या पसंद नहीं है।',
      hint: { pattern: "I don't like + [noun/verb-ing].", example: "I don't like waiting." },
    },
    {
      id: 'speak-combo',
      quest: 3,
      promptEn: 'Combine one like and one dislike into one sentence.',
      promptHi: 'एक पसंद और एक नापसंद को एक sentence में मिलाइए।',
      hint: { pattern: "I like + X, but I don't like + Y.", example: "I like cooking, but I don't like cleaning." },
    },
    {
      id: 'speak-final',
      quest: 3,
      promptEn: 'Now say two or three things you like and dislike, naturally.',
      promptHi: 'अब natural तरीके से दो-तीन चीज़ें बताइए जो आपको पसंद और नापसंद हैं।',
      isFinal: true,
    },
  ],
};
