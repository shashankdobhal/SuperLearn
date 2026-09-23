import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=7: "Warm-up" (practice, quest 1) + "Talk with Nova"
// (conversation, quest 2) + "Speak Freely" (speaking, quest 3) + "Weekly
// Mission" (mission, quest 4) — the week's capstone day.
//
// This is the payoff for the whole week: Day 7's mission is exactly Week
// 1's weeklyOutcome ("Give a simple 30-60 second introduction") — the
// learner combines everything from Days 1-6 (name, origin, home, work/
// study, interest, question-asking) into one continuous spoken
// introduction, which is what the weekly_outcome always asked for.
//
// "Warm-up"(practice)/"Talk with Nova"(conversation)/"Speak Freely"
// (speaking)/"Weekly Mission"(mission) all reuse the existing task types
// (mcq/build in learnFlow; speak in speakFlow, tagged with their own quest
// numbers 2/3/4) rather than new ones — see week-01-day-0{3,4}.ts for the
// same approach with listening/conversation.
export const week01Day07: DayLesson = {
  week: 1,
  day: 7,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Give a 60-second self-introduction',

  learnFlow: [
    {
      type: 'intro',
      id: 'warmup-intro',
      quest: 1,
      emoji: '🌟',
      textHi: 'इस हफ्ते में आपने बहुत कुछ सीखा! चलिए एक छोटा warm-up करते हैं, फिर अपना पूरा introduction देंगे।',
      textEn: "You've learned a lot this week! Let's do a quick warm-up, then give your full introduction.",
    },
    {
      type: 'mcq',
      id: 'warmup-live',
      quest: 1,
      promptHi: 'कौन सा sentence सही है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I am live in Pune.', correct: false },
        { id: 'b', text: 'I live in Pune.', correct: true },
        { id: 'c', text: 'I living in Pune.', correct: false },
      ],
      explanationHi: 'सही! "I live in + [Place]" ऐसे काम करता है।',
      explanationEn: 'Correct! "I live in + [Place]" works like this.',
    },
    {
      type: 'mcq',
      id: 'warmup-question',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'किसी का काम पूछने का सही तरीका कौन सा है?',
      promptEn: 'Which is the correct way to ask what someone does?',
      hint: { pattern: 'What do you + [verb]?', example: 'What do you do?' },
      options: [
        { id: 'a', text: 'You do what?', correct: false },
        { id: 'b', text: 'What do you do?', correct: true },
        { id: 'c', text: 'What you do?', correct: false },
      ],
      explanationHi: 'बढ़िया! "What do you + [verb]?" ऐसे काम करता है।',
      explanationEn: 'Great! "What do you + [verb]?" works like this.',
    },
    {
      type: 'build',
      id: 'warmup-combine',
      quest: 1,
      promptHi: 'मैं दिल्ली से हूँ, और मुझे Computer Science पढ़ना पसंद है।',
      answer: ['I', 'am', 'from', 'Delhi,', 'and', 'I', 'like', 'studying', 'Computer', 'Science.'],
      hint: { pattern: '[Sentence 1], and [Sentence 2].', example: 'I am from Mumbai, and I like reading books.' },
    },
  ],

  speakFlow: [
    {
      id: 'converse-greet',
      quest: 2,
      promptEn: 'Nova says hi and asks your name. Respond and introduce yourself.',
      promptHi: 'Nova hi कहती है और आपका नाम पूछती है। जवाब दीजिए और अपना introduction दीजिए।',
      hint: { pattern: 'Hi! My name is + [Name].', example: 'Hi! My name is Aisha.' },
    },
    {
      id: 'converse-followup',
      quest: 2,
      promptEn: 'Nova asks a follow-up question — answer naturally.',
      promptHi: 'Nova एक follow-up सवाल पूछती है — natural तरीके से जवाब दीजिए।',
      hint: { pattern: 'I live in / I work as a / I like + ...', example: 'I live in Pune, and I like reading.' },
    },
    {
      id: 'speak-freely-1',
      quest: 3,
      promptEn: 'Say your full introduction once, at your own pace.',
      promptHi: 'अपना पूरा introduction एक बार बोलिए, अपनी speed पर।',
      hint: {
        pattern: 'My name is + [Name]. I am from + [Place]. I live in + [Place]. I work as a / study + [subject]. I like + [verb-ing].',
        example: 'My name is Aisha. I am from Delhi. I live in Pune. I study Computer Science. I like reading books.',
      },
    },
    {
      id: 'speak-freely-2',
      quest: 3,
      promptEn: 'Now say it again, a little more confidently.',
      promptHi: 'अब फिर से बोलिए, इस बार थोड़ा और confidence के साथ।',
      hint: {
        pattern: 'My name is + [Name]. I am from + [Place]. I live in + [Place]. I work as a / study + [subject]. I like + [verb-ing].',
        example: 'My name is Aisha. I am from Delhi. I live in Pune. I study Computer Science. I like reading books.',
      },
    },
    {
      id: 'weekly-mission',
      quest: 4,
      promptEn:
        "Give your full 60-second self-introduction: your name, where you're from, where you live, what you do, and one interest — as if you're meeting someone for the first time.",
      promptHi:
        'अपना पूरा 60-second self-introduction दीजिए: आपका नाम, आप कहाँ से हैं, कहाँ रहते हैं, क्या करते हैं, और आपकी एक रुचि — जैसे आप किसी से पहली बार मिल रहे हों।',
      isFinal: true,
      missionLabel: 'WEEKLY MISSION',
    },
  ],
};
