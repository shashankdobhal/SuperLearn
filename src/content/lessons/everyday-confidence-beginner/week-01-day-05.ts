import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=5: quest_count=2, no "Learn the Rule" quest at all — this day
// is pure consolidation of Days 1-4's grammar, not new grammar. days.json
// lists quest_1="Speak It" (speaking) then quest_2="Build It in Writing"
// (writing), i.e. Speak before Write.
//
// PROPOSED DEVIATION (flagging per CURRICULUM_PHILOSOPHY.md's source-of-truth
// rule, not silently redesigning): the app's lesson screen only supports two
// fixed phases in order — a card-based "learn" phase, then a mic-based
// "speak" phase (src/app/lesson.tsx) — so this is authored as Write
// (learnFlow, reusing the 'build' task type) THEN Speak (speakFlow),
// reversing the source order. What's taught is unchanged (combine your
// personal info in writing, then say it aloud); only the presentation order
// differs, for this engineering reason. The app doesn't yet support
// arbitrary quest ordering within a day — worth fixing if quest order turns
// out to matter more than it does here.
export const week01Day05: DayLesson = {
  week: 1,
  day: 5,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Combine your personal information',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '✍️',
      textHi: 'आज हम अपनी सारी जानकारी — नाम, जगह, काम और रुचि — को लिखकर जोड़ेंगे। चलिए शुरू करते हैं!',
      textEn: "Today we'll combine everything about you — name, place, work and interest — into longer written sentences. Let's begin!",
    },
    {
      type: 'build',
      id: 'combine-name-from',
      quest: 1,
      promptHi: 'मेरा नाम रोहन है, और मैं मुंबई से हूँ।',
      answer: ['My', 'name', 'is', 'Rohan,', 'and', 'I', 'am', 'from', 'Mumbai.'],
      hint: { pattern: '[Sentence 1], and [Sentence 2].', example: 'My name is Aisha, and I am from Delhi.' },
    },
    {
      type: 'build',
      id: 'combine-live-do',
      quest: 1,
      promptHi: 'मैं पुणे में रहता हूँ, और मैं Computer Science पढ़ता हूँ।',
      answer: ['I', 'live', 'in', 'Pune,', 'and', 'I', 'study', 'Computer', 'Science.'],
      hint: { pattern: '[Sentence 1], and [Sentence 2].', example: 'I live in Delhi, and I study English.' },
    },
    {
      type: 'build',
      id: 'combine-do-interest',
      quest: 1,
      promptHi: 'मैं एक teacher के रूप में काम करता हूँ, और मुझे किताबें पढ़ना पसंद है।',
      answer: ['I', 'work', 'as', 'a', 'teacher,', 'and', 'I', 'like', 'reading', 'books.'],
      hint: { pattern: '[Sentence 1], and [Sentence 2].', example: 'I work as a designer, and I like painting.' },
    },
    {
      type: 'build',
      id: 'combine-full',
      quest: 1,
      promptHi: 'मेरा नाम रोहन है, मैं पुणे में रहता हूँ, और मुझे किताबें पढ़ना पसंद है।',
      answer: ['My', 'name', 'is', 'Rohan,', 'I', 'live', 'in', 'Pune,', 'and', 'I', 'like', 'reading', 'books.'],
      hint: {
        pattern: '[Sentence 1], [Sentence 2], and [Sentence 3].',
        example: 'My name is Aisha, I live in Delhi, and I like painting.',
      },
    },
  ],

  speakFlow: [
    {
      id: 'speak-combine-1',
      quest: 2,
      promptEn: 'Combine your name and where you’re from into one sentence.',
      promptHi: 'अपना नाम और आप कहाँ से हैं, इसे एक sentence में मिलाकर बोलिए।',
      hint: { pattern: 'My name is + [Name], and I am from + [Place].', example: 'My name is Aisha, and I am from Delhi.' },
    },
    {
      id: 'speak-combine-2',
      quest: 2,
      promptEn: 'Combine where you live and what you do into one sentence.',
      promptHi: 'आप कहाँ रहते हैं और क्या करते हैं, इसे एक sentence में मिलाकर बोलिए।',
      hint: {
        pattern: 'I live in + [Place], and I work as a / study + [subject].',
        example: 'I live in Pune, and I study Computer Science.',
      },
    },
    {
      id: 'speak-combine-3',
      quest: 2,
      promptEn: 'Combine what you do and one interest into one sentence.',
      promptHi: 'आप क्या करते हैं और आपकी एक रुचि, इसे एक sentence में मिलाकर बोलिए।',
      hint: { pattern: 'I work as a / study + [subject], and I like + [verb-ing].', example: 'I study Computer Science, and I like reading books.' },
    },
    {
      id: 'speak-full',
      quest: 2,
      promptEn: "Now say all of it together — your name, where you're from, where you live, what you do, and one interest.",
      promptHi: 'अब यह सब एक साथ बोलिए — आपका नाम, आप कहाँ से हैं, कहाँ रहते हैं, क्या करते हैं, और आपकी एक रुचि।',
    },
    {
      id: 'speak-full-again',
      quest: 2,
      promptEn: 'One more time, a little more smoothly — your full introduction.',
      promptHi: 'एक बार फिर, इस बार थोड़ा और smoothly — अपना पूरा introduction।',
      isFinal: true,
    },
  ],
};
