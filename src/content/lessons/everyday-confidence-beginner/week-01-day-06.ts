import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=6: "Listen & Notice" (listening, quest 1) + "Speak It"
// (speaking, quest 2) + "Talk with Nova" (conversation, quest 3). No new
// grammar (no "Learn the Rule" quest) — this day combines Week 1's
// statement patterns (Days 1-3) with question patterns (Day 4) into one
// short back-and-forth exchange, rehearsing for Day 7's mission.
//
// Listen quest is in learnFlow (reusing intro/mcq/build with audioTextEn,
// same approach as Day 3). Speak + Converse are both speak-shaped, so both
// live in speakFlow, tagged with their own quest numbers (2 and 3).
export const week01Day06: DayLesson = {
  week: 1,
  day: 6,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Have a short introduction conversation',

  learnFlow: [
    {
      type: 'intro',
      id: 'listen-1',
      quest: 1,
      emoji: '👋',
      textHi: 'आज हम सुनेंगे कि दो लोग पहली बार मिलने पर क्या बात करते हैं। ध्यान से सुनिए।',
      textEn: "Today we'll listen to how two people talk when they first meet. Listen carefully.",
      audioTextEn: "Hi! What's your name?",
    },
    {
      type: 'mcq',
      id: 'listen-identify',
      quest: 1,
      promptHi: 'Nova ने बिल्कुल क्या कहा?',
      promptEn: 'What did Nova say, exactly?',
      audioTextEn: 'Nice to meet you!',
      options: [
        { id: 'a', text: 'Nice to meet you!', correct: true },
        { id: 'b', text: 'Good to see you!', correct: false },
        { id: 'c', text: 'Nice to meet her!', correct: false },
      ],
      explanationHi: 'सही! यह एक common greeting है जब आप किसी से पहली बार मिलते हैं।',
      explanationEn: 'Correct! This is a common greeting when meeting someone for the first time.',
    },
    {
      type: 'mcq',
      id: 'listen-meaning',
      quest: 1,
      promptHi: 'इस सवाल का मतलब क्या है?',
      promptEn: 'What does this question mean?',
      audioTextEn: 'Where are you from?',
      options: [
        { id: 'a', text: 'आप कहाँ रहते हैं?', correct: false },
        { id: 'b', text: 'आप कहाँ से हैं?', correct: true },
        { id: 'c', text: 'आप कहाँ जा रहे हैं?', correct: false },
      ],
      explanationHi: 'सही! "Where are you from?" यानी आप कहाँ से हैं (आपकी origin)।',
      explanationEn: 'Correct! "Where are you from?" asks about your origin.',
    },
    {
      type: 'build',
      id: 'listen-retell',
      quest: 1,
      promptHi: 'जो sentence आपने अभी सुना, उसे फिर से बनाइए।',
      audioTextEn: "I'm from Delhi, and you?",
      answer: ["I'm", 'from', 'Delhi,', 'and', 'you?'],
      hint: { pattern: "I'm from + [Place], and you?", example: "I'm from Mumbai, and you?" },
    },
  ],

  speakFlow: [
    {
      id: 'speak-greet',
      quest: 2,
      promptEn: 'Greet someone and introduce yourself.',
      promptHi: 'किसी को greet कीजिए और अपना introduction दीजिए।',
      hint: { pattern: 'Hi! My name is + [Name].', example: 'Hi! My name is Aisha.' },
    },
    {
      id: 'speak-ask-back',
      quest: 2,
      promptEn: 'Ask them where they are from.',
      promptHi: 'उनसे पूछिए वह कहाँ से हैं।',
      hint: { pattern: 'Where are you from?', example: 'Where are you from?' },
    },
    {
      id: 'converse-respond',
      quest: 3,
      promptEn: 'Nova greets you and asks your name — respond and introduce yourself.',
      promptHi: 'Nova आपको greet करती है और आपका नाम पूछती है — जवाब दीजिए और अपना introduction दीजिए।',
      hint: { pattern: 'Hi! My name is + [Name].', example: 'Hi! My name is Rohan.' },
    },
    {
      id: 'converse-followup',
      quest: 3,
      promptEn: 'Now ask Nova a question back.',
      promptHi: 'अब Nova से एक सवाल पूछिए।',
      hint: { pattern: 'What is your + [noun]? / Where are you from?', example: 'What do you do?' },
    },
    {
      id: 'converse-full',
      quest: 3,
      promptEn: 'Have a short back-and-forth: greet, introduce yourself, and ask one question — like a real first meeting.',
      promptHi: 'एक छोटी बातचीत कीजिए: greet करें, अपना introduction दें, और एक सवाल पूछें — जैसे एक असली पहली मुलाकात हो।',
      isFinal: true,
    },
  ],
};
