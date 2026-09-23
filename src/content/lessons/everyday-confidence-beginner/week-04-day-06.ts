import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=6: "Talk with Nova" (conversation, quest 1) — quest_count=1,
// no learnFlow, same shape as week-03-day-05.ts.
export const week04Day06: DayLesson = {
  week: 4,
  day: 6,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Answer follow-up questions about your routine',

  learnFlow: [],

  speakFlow: [
    {
      id: 'converse-ask',
      quest: 1,
      promptEn: 'Nova asks what time you wake up — answer her.',
      promptHi: 'Nova पूछती है आप कितने बजे उठते हैं — जवाब दीजिए।',
      hint: { pattern: 'I wake up at + [time].', example: 'I wake up at 6:30.' },
    },
    {
      id: 'converse-followup1',
      quest: 1,
      promptEn: 'Nova asks a follow-up: what do you do after that? Answer naturally.',
      promptHi: 'Nova एक follow-up सवाल पूछती है: उसके बाद आप क्या करते हैं? Natural जवाब दीजिए।',
    },
    {
      id: 'converse-followup2',
      quest: 1,
      promptEn: 'Nova asks how often you do a specific activity — answer with a frequency.',
      promptHi: 'Nova पूछती है आप कोई खास काम कितनी बार करते हैं — frequency के साथ जवाब दीजिए।',
      hint: { pattern: 'I + [verb] + [usually/sometimes/x times a week].', example: 'I go swimming twice a week.' },
    },
    {
      id: 'converse-followup3',
      quest: 1,
      promptEn: 'Nova asks whether your weekend routine is different — compare it.',
      promptHi: 'Nova पूछती है क्या आपकी weekend routine अलग है — तुलना कीजिए।',
    },
    {
      id: 'converse-full',
      quest: 1,
      promptEn: "Have a full exchange: answer Nova's questions about your daily routine and handle two follow-ups naturally.",
      promptHi: 'एक पूरी बातचीत कीजिए: Nova के सवालों का जवाब अपनी daily routine के बारे में दीजिए और दो follow-ups natural तरीके से संभालिए।',
      isFinal: true,
    },
  ],
};
