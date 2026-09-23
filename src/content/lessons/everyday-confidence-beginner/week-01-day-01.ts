import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=1: quests "Learn the Rule" (learn) + "Practice with Translation"
// (translation) — rendered together as one continuous "Learn" flow — then
// "Speak It" (speaking), rendered as its own flow. See src/app/lesson.tsx.
//
// primary_skills in days.json says "introduce_yourself"; skills.json's id is
// "introduce_self". Treating these as the same skill (a source-data spelling
// mismatch, not a curriculum change) and using the skills.json id here.
export const week01Day01: DayLesson = {
  week: 1,
  day: 1,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Say your name and where you are from',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '👋',
      textHi: 'आज हम सीखेंगे कि खुद को English में कैसे introduce करें — अपना नाम और आप कहाँ से हैं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to introduce yourself in English — your name, and where you're from. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-name',
      quest: 1,
      pattern: 'My name is + [Name].',
      example: 'My name is Rohan.',
      textHi: 'खुद को introduce करने का सबसे आसान तरीका।',
    },
    {
      type: 'rule',
      id: 'rule-from',
      quest: 1,
      pattern: 'I am from + [Place].',
      example: 'I am from Mumbai.',
      textHi: 'अपनी जगह बताने के लिए यह pattern use करें।',
    },
    {
      type: 'mcq',
      id: 'mcq-name',
      quest: 1,
      promptHi: 'खुद को सही तरीके से introduce करने वाला sentence कौन सा है?',
      promptEn: 'Which sentence correctly introduces yourself?',
      options: [
        { id: 'a', text: 'Name my is Aisha.', correct: false },
        { id: 'b', text: 'My name is Aisha.', correct: true },
        { id: 'c', text: 'Is my name Aisha.', correct: false },
      ],
      explanationHi: 'सही! "My name is + [Name]" खुद को introduce करने का सही pattern है।',
      explanationEn: 'Correct! "My name is + [Name]" is the right pattern to introduce yourself.',
    },
    {
      type: 'mcq',
      id: 'mcq-from',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'आप कहाँ से हैं, यह बताने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to say where you are from.',
      options: [
        { id: 'a', text: 'I from Delhi am.', correct: false },
        { id: 'b', text: 'Am I from Delhi.', correct: false },
        { id: 'c', text: 'I am from Delhi.', correct: true },
      ],
      hint: { pattern: 'I am from + [Place]', example: 'I am from Delhi.' },
      explanationHi: 'बढ़िया! "I am from + [Place]" ऐसे काम करता है।',
      explanationEn: 'Great! "I am from + [Place]" works like this.',
    },
    {
      type: 'build',
      id: 'build-name',
      quest: 2,
      promptHi: 'मेरा नाम रोहन है।',
      answer: ['My', 'name', 'is', 'Rohan'],
      hint: { pattern: 'My name is + [Name]', example: 'My name is Aisha.' },
    },
    {
      type: 'build',
      id: 'build-from',
      quest: 2,
      promptHi: 'मैं मुंबई से हूँ।',
      answer: ['I', 'am', 'from', 'Mumbai'],
      hint: { pattern: 'I am from + [Place]', example: 'I am from Delhi.' },
    },
    {
      type: 'build',
      id: 'build-work',
      quest: 2,
      promptHi: 'मैं एक teacher के रूप में काम करता हूँ।',
      answer: ['I', 'work', 'as', 'a', 'teacher'],
      hint: { pattern: 'I work as a + [job]', example: 'I work as a designer.' },
    },
    {
      type: 'build',
      id: 'build-interest',
      quest: 2,
      promptHi: 'मुझे किताबें पढ़ना पसंद है।',
      answer: ['I', 'like', 'reading', 'books'],
      hint: { pattern: 'I like + [verb-ing] + [noun]', example: 'I like playing football.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-name',
      quest: 3,
      promptEn: 'Say your name.',
      promptHi: 'अपना नाम बोलिए।',
      hint: { pattern: 'My name is + [Name]', example: 'My name is Aisha.' },
    },
    {
      id: 'speak-from',
      quest: 3,
      promptEn: "Now say where you're from.",
      promptHi: 'अब बताइए आप कहाँ से हैं।',
      hint: { pattern: 'I am from + [Place]', example: 'I am from Delhi.' },
    },
    {
      id: 'speak-work',
      quest: 3,
      promptEn: 'Say what you do — your work or study.',
      promptHi: 'बताइए आप क्या करते हैं — काम या पढ़ाई।',
      hint: { pattern: 'I work as a / I study + [subject]', example: 'I work as a teacher.' },
    },
    {
      id: 'speak-interest',
      quest: 3,
      promptEn: "Share one thing you're interested in.",
      promptHi: 'एक चीज़ बताइए जिसमें आपकी रुचि है।',
      hint: { pattern: 'I like / I am interested in + [noun / verb-ing]', example: 'I like reading books.' },
    },
    {
      id: 'speak-full',
      quest: 3,
      promptEn:
        'Last one — put it all together. Give a full introduction: your name, where you’re from, what you do, and one interest.',
      promptHi: 'आखिरी सवाल — सब कुछ मिलाकर बोलिए: आपका नाम, आप कहाँ से हैं, आप क्या करते हैं, और आपकी एक रुचि।',
      isFinal: true,
    },
  ],
};
