import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=7: "Warm-up" (practice, quest 1) + "Talk with Nova"
// (conversation, quest 2) + "Speak Freely" (speaking, quest 3) + "Weekly
// Mission" (mission, quest 4) — the week's capstone day, same shape as
// week-01-day-07.ts / week-02-day-07.ts.
export const week03Day07: DayLesson = {
  week: 3,
  day: 7,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Talk about five likes and dislikes naturally',

  learnFlow: [
    {
      type: 'intro',
      id: 'warmup-intro',
      quest: 1,
      emoji: '🌟',
      textHi: 'इस हफ्ते में आपने बहुत कुछ सीखा! चलिए एक छोटा warm-up करते हैं, फिर अपनी पसंद-नापसंद के बारे में बात करेंगे।',
      textEn: "You've learned a lot this week! Let's do a quick warm-up, then talk about your likes and dislikes.",
    },
    {
      type: 'mcq',
      id: 'warmup-because',
      quest: 1,
      promptHi: 'कौन सा sentence सही है?',
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
      id: 'warmup-question',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'कोई क्या करना पसंद करता है यह पूछने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to ask what someone likes to do.',
      options: [
        { id: 'a', text: 'What you like to do?', correct: false },
        { id: 'b', text: 'What do you like to do?', correct: true },
        { id: 'c', text: 'Do you what like to do?', correct: false },
      ],
      hint: { pattern: 'What do you like to + [verb]?', example: 'What do you like to do?' },
      explanationHi: 'बढ़िया! "What do you like to + [verb]?" ऐसे काम करता है।',
      explanationEn: 'Great! "What do you like to + [verb]?" works like this.',
    },
    {
      type: 'build',
      id: 'warmup-combine',
      quest: 1,
      promptHi: 'मुझे संगीत सुनना पसंद है क्योंकि यह मुझे खुश करता है, लेकिन मुझे भीड़-भाड़ पसंद नहीं है।',
      answer: ['I', 'like', 'listening', 'to', 'music', 'because', 'it', 'makes', 'me', 'happy,', 'but', 'I', "don't", 'like', 'crowds.'],
      hint: {
        pattern: 'I like + [verb-ing] because it + [verb], but I don\'t like + [noun].',
        example: "I like dancing because it makes me happy, but I don't like early mornings.",
      },
    },
  ],

  speakFlow: [
    {
      id: 'converse-greet',
      quest: 2,
      promptEn: 'Nova asks what you like to do in your free time — answer her.',
      promptHi: 'Nova पूछती है आप खाली समय में क्या करना पसंद करते हैं — जवाब दीजिए।',
    },
    {
      id: 'converse-followup',
      quest: 2,
      promptEn: 'Nova asks why you like it — give a reason.',
      promptHi: 'Nova पूछती है आपको यह क्यों पसंद है — कारण बताइए।',
      hint: { pattern: 'I like + [noun] because + [clause].', example: 'I like painting because it relaxes me.' },
    },
    {
      id: 'speak-freely-1',
      quest: 3,
      promptEn: 'Say your full description once, at your own pace: two things you like and one you dislike, each with a reason.',
      promptHi: 'अपना पूरा description एक बार बोलिए, अपनी speed पर: दो चीज़ें जो पसंद हैं और एक जो नापसंद है, दोनों के कारण के साथ।',
    },
    {
      id: 'speak-freely-2',
      quest: 3,
      promptEn: 'Now say it again, a little more confidently.',
      promptHi: 'अब फिर से बोलिए, इस बार थोड़ा और confidence के साथ।',
    },
    {
      id: 'weekly-mission',
      quest: 4,
      promptEn:
        "Talk about five things you like or dislike, naturally, with a reason for each — as if a new friend asked what you're into.",
      promptHi:
        'पाँच चीज़ों के बारे में natural तरीके से बताइए जो आपको पसंद या नापसंद हैं, हर एक का कारण देते हुए — जैसे किसी नए दोस्त ने पूछा हो आपको क्या पसंद है।',
      isFinal: true,
      missionLabel: 'WEEKLY MISSION',
    },
  ],
};
