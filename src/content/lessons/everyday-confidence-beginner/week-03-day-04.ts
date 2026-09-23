import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=4: "Learn the Rule" (learn, quest 1) + "Practice with
// Translation" (translation, quest 2) + "Speak It" (speaking, quest 3).
// New grammar: giving a reason for a preference with "because".
export const week03Day04: DayLesson = {
  week: 3,
  day: 4,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Give a reason for a preference',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '💭',
      textHi: 'आज हम सीखेंगे कि अपनी पसंद का कारण कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to give a reason for our preferences. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-because',
      quest: 1,
      pattern: 'I like/love + [noun/verb-ing] + because + [clause].',
      example: 'I love reading because it relaxes me.',
      textHi: "अपनी पसंद का कारण बताने के लिए 'because' use करें।",
    },
    {
      type: 'rule',
      id: 'rule-because-dislike',
      quest: 1,
      pattern: "I don't like / hate + [noun/verb-ing] + because + [clause].",
      example: 'I hate traffic because it wastes time.',
      textHi: "नापसंद का कारण बताने के लिए भी 'because' use करें।",
    },
    {
      type: 'mcq',
      id: 'mcq-because',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I like cooking because it fun.', correct: false },
        { id: 'b', text: 'I like cooking because it is fun.', correct: true },
        { id: 'c', text: 'I like cooking because is fun.', correct: false },
      ],
      explanationHi: 'सही! "because" के बाद भी पूरा sentence (with "it is") होना चाहिए।',
      explanationEn: 'Correct! The clause after "because" also needs "it is".',
    },
    {
      type: 'mcq',
      id: 'mcq-because-2',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'नापसंद का कारण सही तरीके से बताने वाला sentence चुनें।',
      promptEn: 'Choose the sentence that correctly gives a reason for a dislike.',
      options: [
        { id: 'a', text: 'I don\'t like traffic because it wastes time.', correct: true },
        { id: 'b', text: "I don't like traffic because wastes time.", correct: false },
        { id: 'c', text: "I don't like traffic it wastes time.", correct: false },
      ],
      hint: { pattern: "I don't like + [noun] because it + [verb].", example: "I don't like noise because it distracts me." },
      explanationHi: 'बढ़िया! "because" के बाद subject ("it") छोड़ा नहीं जा सकता।',
      explanationEn: 'Great! You can\'t drop the subject ("it") after "because".',
    },
    {
      type: 'build',
      id: 'translate-1',
      quest: 2,
      promptHi: 'मुझे पढ़ना पसंद है क्योंकि यह मुझे relax करता है।',
      answer: ['I', 'like', 'reading', 'because', 'it', 'relaxes', 'me.'],
      hint: { pattern: 'I like + [verb-ing] because it + [verb].', example: 'I like painting because it calms me.' },
    },
    {
      type: 'build',
      id: 'translate-2',
      quest: 2,
      promptHi: 'मुझे cricket पसंद है क्योंकि यह exciting है।',
      answer: ['I', 'like', 'cricket', 'because', 'it', 'is', 'exciting.'],
      hint: { pattern: 'I like + [noun] because it is + [adjective].', example: 'I like football because it is fast.' },
    },
    {
      type: 'build',
      id: 'translate-3',
      quest: 2,
      promptHi: 'मुझे traffic पसंद नहीं है क्योंकि यह समय बर्बाद करता है।',
      answer: ['I', "don't", 'like', 'traffic', 'because', 'it', 'wastes', 'time.'],
      hint: { pattern: "I don't like + [noun] because it + [verb].", example: "I don't like queues because they waste time." },
    },
    {
      type: 'build',
      id: 'translate-4',
      quest: 2,
      promptHi: 'मुझे संगीत सुनना पसंद है क्योंकि यह मुझे खुश करता है।',
      answer: ['I', 'like', 'listening', 'to', 'music', 'because', 'it', 'makes', 'me', 'happy.'],
      hint: { pattern: 'I like + [verb-ing] because it makes me + [adjective].', example: 'I like dancing because it makes me happy.' },
    },
    {
      type: 'build',
      id: 'translate-5',
      quest: 2,
      promptHi: 'मुझे भीड़-भाड़ वाली जगहें पसंद नहीं हैं क्योंकि वे तनावपूर्ण होती हैं।',
      answer: ['I', "don't", 'like', 'crowded', 'places', 'because', 'they', 'are', 'stressful.'],
      hint: { pattern: "I don't like + [plural noun] because they are + [adjective].", example: "I don't like loud parties because they are tiring." },
    },
  ],

  speakFlow: [
    {
      id: 'speak-reason-1',
      quest: 3,
      promptEn: 'Say one thing you like and give a reason.',
      promptHi: 'बताइए आपको क्या पसंद है और कारण बताइए।',
      hint: { pattern: 'I like + [noun/verb-ing] because + [clause].', example: "I like painting because it's relaxing." },
    },
    {
      id: 'speak-reason-2',
      quest: 3,
      promptEn: 'Say one more thing you like, with a reason.',
      promptHi: 'एक और चीज़ बताइए जो आपको पसंद है, कारण के साथ।',
    },
    {
      id: 'speak-reason-dislike',
      quest: 3,
      promptEn: 'Say one thing you dislike, with a reason.',
      promptHi: 'बताइए आपको क्या पसंद नहीं है, कारण के साथ।',
      hint: { pattern: "I don't like + [noun] because + [clause].", example: "I don't like traffic because it wastes time." },
    },
    {
      id: 'speak-combo',
      quest: 3,
      promptEn: 'Combine a like and a dislike, each with a reason, into a short answer.',
      promptHi: 'एक पसंद और एक नापसंद को, दोनों के कारण के साथ, एक छोटे जवाब में मिलाइए।',
    },
    {
      id: 'speak-final',
      quest: 3,
      promptEn: 'Now answer naturally, like someone just asked why you like your favorite hobby.',
      promptHi: 'अब natural तरीके से जवाब दीजिए, जैसे किसी ने पूछा हो आपको अपना पसंदीदा hobby क्यों पसंद है।',
      isFinal: true,
    },
  ],
};
