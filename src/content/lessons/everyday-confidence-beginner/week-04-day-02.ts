import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=2: "Learn the Rule" (learn, quest 1) + "Speak It" (speaking,
// quest 2).
export const week04Day02: DayLesson = {
  week: 4,
  day: 2,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Talk about your work or study routine',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '💼',
      textHi: 'आज हम सीखेंगे कि अपने काम या पढ़ाई की routine के बारे में कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to talk about our work or study routine. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-go-to-work',
      quest: 1,
      pattern: 'I go to work/school/college at + [time].',
      example: 'I go to work at 9 am.',
      textHi: 'काम या पढ़ाई पर जाने का समय बताने के लिए।',
    },
    {
      type: 'rule',
      id: 'rule-from-to',
      quest: 1,
      pattern: 'I work/study from + [time] to + [time].',
      example: 'I work from 9 to 6.',
      textHi: "काम या पढ़ाई का समय बताने के लिए 'from...to' use करें।",
    },
    {
      type: 'mcq',
      id: 'mcq-go-to-work',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I go to work at 9 am.', correct: true },
        { id: 'b', text: 'I go work at 9 am.', correct: false },
        { id: 'c', text: 'I going to work at 9 am.', correct: false },
      ],
      explanationHi: 'सही! "go to work" ऐसे काम करता है।',
      explanationEn: 'Correct! "go to work" works like this.',
    },
    {
      type: 'mcq',
      id: 'mcq-from-to',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'काम के घंटों के बारे में सही sentence चुनें।',
      promptEn: 'Choose the correct sentence about work hours.',
      options: [
        { id: 'a', text: 'I work from 9 to 6.', correct: true },
        { id: 'b', text: 'I work since 9 to 6.', correct: false },
        { id: 'c', text: 'I work 9 for 6.', correct: false },
      ],
      hint: { pattern: 'I work from + [time] to + [time].', example: 'I work from 10 to 7.' },
      explanationHi: "बढ़िया! \"from...to\" ऐसे काम करता है।",
      explanationEn: 'Great! "from...to" works like this.',
    },
  ],

  speakFlow: [
    {
      id: 'speak-goto',
      quest: 2,
      promptEn: 'Say what time you go to work, school, or college.',
      promptHi: 'बताइए आप कितने बजे काम, स्कूल, या college जाते हैं।',
      hint: { pattern: 'I go to + [work/school/college] + at + [time].', example: 'I go to college at 8 am.' },
    },
    {
      id: 'speak-hours',
      quest: 2,
      promptEn: 'Say your working or studying hours.',
      promptHi: 'बताइए आपके काम या पढ़ाई के घंटे क्या हैं।',
      hint: { pattern: 'I work/study from + [time] to + [time].', example: 'I study from 9 to 3.' },
    },
    {
      id: 'speak-task',
      quest: 2,
      promptEn: 'Say one thing you usually do during work or study.',
      promptHi: 'बताइए काम या पढ़ाई के दौरान आप आमतौर पर क्या करते हैं।',
    },
    {
      id: 'speak-combo',
      quest: 2,
      promptEn: 'Combine your start time, hours, and one task into a short routine.',
      promptHi: 'शुरू होने का समय, घंटे, और एक काम को मिलाकर एक छोटी routine बताइए।',
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Now describe your full work or study routine naturally.',
      promptHi: 'अब अपनी पूरी काम या पढ़ाई की routine natural तरीके से बताइए।',
      isFinal: true,
    },
  ],
};
