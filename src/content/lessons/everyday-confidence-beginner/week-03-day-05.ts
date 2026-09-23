import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=5: "Talk with Nova" (conversation, quest 1) — quest_count=1,
// no learnFlow at all, same shape as week-01-day-0X's pure-conversation
// days. This day is entirely about handling a differing preference
// politely, not new grammar.
export const week03Day05: DayLesson = {
  week: 3,
  day: 5,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Respond to someone with a different preference',

  learnFlow: [],

  speakFlow: [
    {
      id: 'converse-nova-likes',
      quest: 1,
      promptEn: 'Nova says she loves horror movies — react and say whether you agree.',
      promptHi: 'Nova कहती है उसे horror movies बहुत पसंद हैं — react कीजिए और बताइए क्या आप सहमत हैं।',
      hint: { pattern: "I like/don't like + [noun] too. / Really? I don't like + [noun].", example: "Really? I don't like horror movies." },
    },
    {
      id: 'converse-explain',
      quest: 1,
      promptEn: 'Explain why you feel differently (or the same), with a reason.',
      promptHi: 'बताइए आप अलग (या वैसा ही) क्यों महसूस करते हैं, कारण के साथ।',
      hint: { pattern: "I don't like + [noun] because + [clause].", example: "I don't like horror movies because they scare me." },
    },
    {
      id: 'converse-ask-back',
      quest: 1,
      promptEn: 'Ask Nova why she likes horror movies.',
      promptHi: 'Nova से पूछिए उसे horror movies क्यों पसंद हैं।',
      hint: { pattern: 'Why do you like + [noun]?', example: 'Why do you like horror movies?' },
    },
    {
      id: 'converse-respond-hers',
      quest: 1,
      promptEn: 'Nova gives her reason — respond naturally, even if you still disagree.',
      promptHi: 'Nova अपना कारण बताती है — natural तरीके से जवाब दीजिए, भले ही आप सहमत न हों।',
      hint: { pattern: "That's interesting, but I prefer + [noun]. / I see, I still don't like it though.", example: "That's interesting, but I prefer comedies." },
    },
    {
      id: 'converse-full',
      quest: 1,
      promptEn: 'Have a short back-and-forth about a preference where you and Nova disagree, and stay polite about it.',
      promptHi: 'एक छोटी बातचीत कीजिए जहाँ आप और Nova की पसंद अलग है, और polite तरीके से बात कीजिए।',
      isFinal: true,
    },
  ],
};
