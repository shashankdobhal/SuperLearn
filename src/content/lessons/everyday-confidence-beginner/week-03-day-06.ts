import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=6: "Speak It" (speaking, quest 1) + "Talk with Nova"
// (conversation, quest 2) — both speak-shaped, so both live in speakFlow,
// tagged with their own quest numbers (see week-01-day-06.ts for the same
// two-speak-quest shape).
export const week03Day06: DayLesson = {
  week: 3,
  day: 6,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Have a preference conversation',

  learnFlow: [],

  speakFlow: [
    {
      id: 'speak-intro',
      quest: 1,
      promptEn: 'Warm up: say one hobby you enjoy in your free time.',
      promptHi: 'Warm-up: बताइए खाली समय में आपको कौन सा hobby करना पसंद है।',
      hint: { pattern: 'I enjoy + [verb-ing].', example: 'I enjoy painting.' },
    },
    {
      id: 'speak-topic-1',
      quest: 1,
      promptEn: 'Say one thing you like, with a reason.',
      promptHi: 'बताइए आपको क्या पसंद है, कारण के साथ।',
      hint: { pattern: 'I like + [noun] because + [clause].', example: 'I like reading because it relaxes me.' },
    },
    {
      id: 'speak-topic-2',
      quest: 1,
      promptEn: 'Say one thing you dislike, with a reason.',
      promptHi: 'बताइए आपको क्या पसंद नहीं है, कारण के साथ।',
    },
    {
      id: 'speak-ask-form',
      quest: 1,
      promptEn: 'Practice asking a preference question you might ask someone new.',
      promptHi: 'किसी नए व्यक्ति से पूछे जाने वाला एक preference सवाल practice कीजिए।',
      hint: { pattern: 'Do you like + [noun]? / What do you like to do?', example: 'What do you like to do in your free time?' },
    },
    {
      id: 'speak-final',
      quest: 1,
      promptEn: 'Now put it together: share a like and a dislike, each with a reason.',
      promptHi: 'अब यह सब मिलाइए: एक पसंद और एक नापसंद बताइए, दोनों के कारण के साथ।',
    },
    {
      id: 'converse-greet',
      quest: 2,
      promptEn: 'Greet Nova and tell her you want to talk about hobbies.',
      promptHi: 'Nova को greet कीजिए और बताइए आप hobbies के बारे में बात करना चाहते हैं।',
    },
    {
      id: 'converse-ask',
      quest: 2,
      promptEn: 'Ask Nova about her hobbies.',
      promptHi: 'Nova से उसके hobbies के बारे में पूछिए।',
      hint: { pattern: 'What do you like to do in your free time?', example: 'What do you like to do in your free time?' },
    },
    {
      id: 'converse-respond',
      quest: 2,
      promptEn: 'Nova answers and asks you back — share your hobby with a reason.',
      promptHi: 'Nova जवाब देती है और आपसे पूछती है — अपना hobby कारण के साथ बताइए।',
    },
    {
      id: 'converse-followup',
      quest: 2,
      promptEn: 'Nova mentions something she dislikes — react and share if you feel the same or different.',
      promptHi: 'Nova बताती है उसे कुछ पसंद नहीं है — react कीजिए और बताइए आप वैसा ही महसूस करते हैं या अलग।',
    },
    {
      id: 'converse-full',
      quest: 2,
      promptEn: 'Have a full preference conversation with Nova: likes, dislikes, and reasons on both sides.',
      promptHi: 'Nova के साथ पसंद के बारे में पूरी बातचीत कीजिए: पसंद, नापसंद, और दोनों तरफ के कारण।',
      isFinal: true,
    },
  ],
};
