import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=6: "Learn the Rule" (learn, quest 1) + "Speak It" (speaking,
// quest 2) + "Talk with Nova" (conversation, quest 3).
//
// New grammar: comparing two places without a formal comparative form
// (comparatives aren't taught until skill_id "compare", week 32) — using
// "but" contrast and "both...and" instead, which only needs vocabulary this
// week has already introduced (there is/are, adjectives).
export const week02Day06: DayLesson = {
  week: 2,
  day: 6,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Compare two familiar places',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-compare',
      quest: 1,
      emoji: '⚖️',
      textHi: 'आज हम सीखेंगे कि दो जगहों की तुलना कैसे करें। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to compare two places. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-but',
      quest: 1,
      pattern: '[Place A] + is + [adjective], but + [Place B] + is + [adjective].',
      example: 'My hometown is quiet, but Mumbai is busy.',
      textHi: "दो जगहों के बीच अंतर बताने के लिए 'but' use करें।",
    },
    {
      type: 'rule',
      id: 'rule-both',
      quest: 1,
      pattern: 'Both + [Place A] + and + [Place B] + are + [adjective].',
      example: 'Both cities are crowded.',
      textHi: "जब दोनों जगहें एक जैसी हों, तो 'both...and' use करें।",
    },
    {
      type: 'mcq',
      id: 'mcq-but',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'My town is small, but my city big.', correct: false },
        { id: 'b', text: 'My town is small, but my city is big.', correct: true },
        { id: 'c', text: 'My town small, but my city is big.', correct: false },
      ],
      explanationHi: 'सही! "but" के दोनों तरफ पूरा sentence (with "is") होना चाहिए।',
      explanationEn: 'Correct! Both sides of "but" need a complete sentence, with "is".',
    },
    {
      type: 'mcq',
      id: 'mcq-both',
      quest: 1,
      isPopQuiz: true,
      promptHi: "'Both' सही तरीके से use करने वाला sentence चुनें।",
      promptEn: "Choose the sentence that uses 'both' correctly.",
      options: [
        { id: 'a', text: 'Both cities is busy.', correct: false },
        { id: 'b', text: 'Both cities are busy.', correct: true },
        { id: 'c', text: 'Both city are busy.', correct: false },
      ],
      hint: { pattern: 'Both + [plural noun] + are + [adjective].', example: 'Both parks are green.' },
      explanationHi: 'सही! "Both" के बाद plural noun और "are" आता है।',
      explanationEn: 'Correct! "Both" is followed by a plural noun and "are".',
    },
  ],

  speakFlow: [
    {
      id: 'speak-place-a',
      quest: 2,
      promptEn: 'Name a place you know well (your hometown, for example) and describe it with an adjective.',
      promptHi: 'कोई जगह बताइए जिसे आप अच्छे से जानते हैं, और उसे एक adjective से describe कीजिए।',
      hint: { pattern: '[Place] + is + [adjective].', example: 'My hometown is quiet.' },
    },
    {
      id: 'speak-place-b',
      quest: 2,
      promptEn: 'Now name a different place and describe it too.',
      promptHi: 'अब एक अलग जगह बताइए और उसे भी describe कीजिए।',
    },
    {
      id: 'speak-contrast',
      quest: 2,
      promptEn: "Combine both using 'but' to show the difference.",
      promptHi: "दोनों को 'but' से मिलाकर अंतर बताइए।",
      hint: { pattern: '[Place A] + is + [adjective], but [Place B] + is + [adjective].', example: 'My hometown is quiet, but Mumbai is busy.' },
    },
    {
      id: 'speak-both',
      quest: 2,
      promptEn: "Now say one way both places are similar, using 'both...and'.",
      promptHi: "अब बताइए दोनों जगहें किस तरह एक जैसी हैं, 'both...and' का use करके।",
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Compare the two places fully — one difference and one similarity.',
      promptHi: 'दोनों जगहों की पूरी तुलना कीजिए — एक अंतर और एक समानता।',
    },
    {
      id: 'converse-intro',
      quest: 3,
      promptEn: 'Tell Nova you want to talk about two places today.',
      promptHi: 'Nova को बताइए आप आज दो जगहों के बारे में बात करना चाहते हैं।',
      hint: { pattern: 'I want to talk about + [noun].', example: 'I want to talk about my hometown.' },
    },
    {
      id: 'converse-ask',
      quest: 3,
      promptEn: 'Ask Nova to describe her hometown.',
      promptHi: 'Nova से पूछिए वह अपने hometown को describe करे।',
      hint: { pattern: 'What is your hometown like?', example: 'What is your hometown like?' },
    },
    {
      id: 'converse-respond',
      quest: 3,
      promptEn: 'Nova describes her hometown and asks about yours — respond and compare.',
      promptHi: 'Nova अपने hometown के बारे में बताती है और आपसे पूछती है — जवाब दीजिए और तुलना कीजिए।',
    },
    {
      id: 'converse-followup',
      quest: 3,
      promptEn: 'Nova asks which place you prefer — answer and give a reason.',
      promptHi: 'Nova पूछती है आपको कौन सी जगह ज़्यादा पसंद है — जवाब दीजिए और कारण बताइए।',
      hint: { pattern: 'I like + [Place] because + [clause].', example: 'I like my hometown because it is quiet.' },
    },
    {
      id: 'converse-full',
      quest: 3,
      promptEn: 'Have a full exchange comparing your hometown and one other place with Nova.',
      promptHi: 'Nova से अपने hometown और किसी और जगह की पूरी तुलना करते हुए बातचीत कीजिए।',
      isFinal: true,
    },
  ],
};
