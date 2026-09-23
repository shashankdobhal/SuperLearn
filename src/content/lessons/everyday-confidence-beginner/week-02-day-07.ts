import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=7: "Warm-up" (practice, quest 1) + "Talk with Nova"
// (conversation, quest 2) + "Speak Freely" (speaking, quest 3) + "Weekly
// Mission" (mission, quest 4) — the week's capstone day, same shape as
// week-01-day-07.ts. The mission is exactly Week 2's weeklyOutcome.
export const week02Day07: DayLesson = {
  week: 2,
  day: 7,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Describe where you live for 60–90 seconds',

  learnFlow: [
    {
      type: 'intro',
      id: 'warmup-intro',
      quest: 1,
      emoji: '🌟',
      textHi: 'इस हफ्ते में आपने बहुत कुछ सीखा! चलिए एक छोटा warm-up करते हैं, फिर अपने घर के बारे में पूरी बात बताएंगे।',
      textEn: "You've learned a lot this week! Let's do a quick warm-up, then describe where you live fully.",
    },
    {
      type: 'mcq',
      id: 'warmup-there-are',
      quest: 1,
      promptHi: 'कौन सा sentence सही है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'There is many parks in my city.', correct: false },
        { id: 'b', text: 'There are many parks in my city.', correct: true },
        { id: 'c', text: 'There a park in my city.', correct: false },
      ],
      explanationHi: 'सही! एक से ज़्यादा चीज़ों के लिए "There are" use होता है।',
      explanationEn: 'Correct! "There are" is used for more than one thing.',
    },
    {
      type: 'mcq',
      id: 'warmup-preposition',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'सही तरीका चुनें जब कोई जगह पास हो।',
      promptEn: 'Choose the correct way to say a place is near another.',
      options: [
        { id: 'a', text: 'The market is near my house.', correct: true },
        { id: 'b', text: 'The market near of my house.', correct: false },
        { id: 'c', text: 'The market is near of my house.', correct: false },
      ],
      hint: { pattern: '[Place A] + is near + [Place B].', example: 'The market is near my house.' },
      explanationHi: 'सही! "is near" के बाद सीधे जगह आती है।',
      explanationEn: 'Correct! "is near" is followed directly by the place.',
    },
    {
      type: 'build',
      id: 'warmup-combine',
      quest: 1,
      promptHi: 'मेरा शहर बहुत green है, और यहाँ एक बड़ा park है जो मेरे घर के पास है।',
      answer: ['My', 'city', 'is', 'very', 'green,', 'and', 'there', 'is', 'a', 'big', 'park', 'near', 'my', 'house.'],
      hint: {
        pattern: '[Place] + is + [adjective], and there is a/an + [noun] + near + [place].',
        example: 'My town is quiet, and there is a small market near my house.',
      },
    },
  ],

  speakFlow: [
    {
      id: 'converse-greet',
      quest: 2,
      promptEn: 'Nova asks where you live — answer her.',
      promptHi: 'Nova पूछती है आप कहाँ रहते हैं — जवाब दीजिए।',
      hint: { pattern: 'I live in/near + [Place].', example: 'I live in Pune.' },
    },
    {
      id: 'converse-followup',
      quest: 2,
      promptEn: 'Nova asks a follow-up about what your area is like — answer naturally.',
      promptHi: 'Nova आपके area के बारे में एक follow-up सवाल पूछती है — natural जवाब दीजिए।',
    },
    {
      id: 'speak-freely-1',
      quest: 3,
      promptEn: 'Say your full description once, at your own pace: your city, one thing there is, and 2–3 adjectives.',
      promptHi: 'अपना पूरा description एक बार बोलिए, अपनी speed पर: आपका शहर, एक चीज़ जो वहाँ है, और 2–3 adjectives।',
      hint: {
        pattern: 'My city is + [adjective]. There is a/an + [noun] near my house. It is + [adjective].',
        example: 'My city is busy. There is a big market near my house. It is crowded.',
      },
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
        "Give your full 60-90 second description of where you live: your city or area, what it's like, what's near your home, and how it compares to another place you know — as if you're telling a new friend about your home.",
      promptHi:
        'अपने घर के बारे में पूरा 60-90 second description दीजिए: आपका शहर या area, यह कैसा है, आपके घर के पास क्या है, और यह किसी और जगह से कैसे अलग है — जैसे आप किसी नए दोस्त को अपने घर के बारे में बता रहे हों।',
      isFinal: true,
      missionLabel: 'WEEKLY MISSION',
    },
  ],
};
