import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=7: "Warm-up" (practice, quest 1) + "Talk with Nova"
// (conversation, quest 2) + "Speak Freely" (speaking, quest 3) + "Weekly
// Mission" (mission, quest 4) — the week's capstone day, same shape as
// week-01-day-07.ts / week-02-day-07.ts / week-03-day-07.ts.
export const week04Day07: DayLesson = {
  week: 4,
  day: 7,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Describe a typical day for 60–90 seconds',

  learnFlow: [
    {
      type: 'intro',
      id: 'warmup-intro',
      quest: 1,
      emoji: '🌟',
      textHi: 'इस हफ्ते में आपने बहुत कुछ सीखा! चलिए एक छोटा warm-up करते हैं, फिर अपने पूरे दिन के बारे में बताएंगे।',
      textEn: "You've learned a lot this week! Let's do a quick warm-up, then describe your whole day.",
    },
    {
      type: 'mcq',
      id: 'warmup-frequency',
      quest: 1,
      promptHi: 'कौन सा sentence सही है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I am usually busy in the morning.', correct: true },
        { id: 'b', text: 'I usually am busy in the morning.', correct: false },
        { id: 'c', text: 'Usually I busy am in the morning.', correct: false },
      ],
      explanationHi: 'सही! "be" verb के बाद frequency adverb आता है।',
      explanationEn: 'Correct! The frequency adverb comes after the "be" verb.',
    },
    {
      type: 'mcq',
      id: 'warmup-routine',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'काम के घंटों के बारे में सही sentence चुनें।',
      promptEn: 'Choose the correct sentence about work hours.',
      options: [
        { id: 'a', text: 'I work from 9 to 6.', correct: true },
        { id: 'b', text: 'I work since 9 to 6.', correct: false },
        { id: 'c', text: 'I 9 to 6 work.', correct: false },
      ],
      hint: { pattern: 'I work from + [time] to + [time].', example: 'I work from 10 to 7.' },
      explanationHi: '"from...to" ऐसे काम करता है।',
      explanationEn: 'Great! "from...to" works like this.',
    },
    {
      type: 'build',
      id: 'warmup-combine',
      quest: 1,
      promptHi: 'मैं आमतौर पर 6 बजे उठता हूँ, नाश्ता करता हूँ, और फिर काम पर जाता हूँ।',
      answer: ['I', 'usually', 'wake', 'up', 'at', '6,', 'have', 'breakfast,', 'and', 'then', 'go', 'to', 'work.'],
      hint: { pattern: 'I usually + [verb1], [verb2], and then + [verb3].', example: 'I usually wake up at 7, shower, and then have breakfast.' },
    },
  ],

  speakFlow: [
    {
      id: 'converse-ask',
      quest: 2,
      promptEn: 'Nova asks about your morning routine — answer her.',
      promptHi: 'Nova आपकी सुबह की routine के बारे में पूछती है — जवाब दीजिए।',
    },
    {
      id: 'converse-followup',
      quest: 2,
      promptEn: 'Nova asks how your weekend is different — answer naturally.',
      promptHi: 'Nova पूछती है आपका weekend कैसे अलग है — natural जवाब दीजिए।',
    },
    {
      id: 'speak-freely-1',
      quest: 3,
      promptEn: 'Say your full day once, at your own pace: morning, work/study, and evening.',
      promptHi: 'अपना पूरा दिन एक बार बोलिए, अपनी speed पर: सुबह, काम/पढ़ाई, और शाम।',
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
        'Describe a typical day for 60-90 seconds: when you wake up, your work or study routine, how often you do a few things, and how your weekend is different — as if you\'re telling a new friend about your daily life.',
      promptHi:
        'अपने typical दिन का 60-90 second description दीजिए: आप कब उठते हैं, आपकी काम या पढ़ाई की routine, कुछ चीज़ें आप कितनी बार करते हैं, और आपका weekend कैसे अलग है — जैसे आप किसी नए दोस्त को अपनी daily life के बारे में बता रहे हों।',
      isFinal: true,
      missionLabel: 'WEEKLY MISSION',
    },
  ],
};
