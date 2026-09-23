import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=4: "Learn the Rule" (learn, quest 1) + "Practice with
// Translation" (translation, quest 2) + "Talk with Nova" (conversation,
// quest 3).
//
// New direction for the week: Days 1-3 taught making STATEMENTS about
// yourself; Day 4 flips to forming QUESTIONS to ask someone else — the
// daily outcome is literally "ask someone basic questions about
// themselves." The "conversation" quest reuses the speak task type
// (see lesson-types.ts / SpeakCard) framed as "ask Nova ___" prompts rather
// than "tell me ___" ones — the app's speaking evaluation is a simulation
// either way (see SpeakCard.tsx), so a real multi-turn dialogue engine
// isn't needed to make this a genuine practice of question formation.
export const week01Day04: DayLesson = {
  week: 1,
  day: 4,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Ask someone basic questions about themselves',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '❓',
      textHi: 'अब तक आपने अपने बारे में बताना सीखा। आज हम सीखेंगे कि किसी और से सवाल कैसे पूछें। चलिए शुरू करते हैं!',
      textEn: "So far you've learned to talk about yourself. Today we'll learn to ask someone else questions. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-what',
      quest: 1,
      pattern: 'What is your + [noun]?',
      example: 'What is your name?',
      textHi: 'नाम या जानकारी पूछने के लिए यह pattern use करें।',
    },
    {
      type: 'rule',
      id: 'rule-where',
      quest: 1,
      pattern: 'Where are you from?',
      example: 'Where are you from?',
      textHi: 'कोई कहाँ से है, यह पूछने के लिए।',
    },
    {
      type: 'mcq',
      id: 'mcq-what',
      quest: 1,
      promptHi: 'किसी का नाम पूछने का सही तरीका कौन सा है?',
      promptEn: "Which is the correct way to ask someone's name?",
      options: [
        { id: 'a', text: 'Your name is what?', correct: false },
        { id: 'b', text: 'What is your name?', correct: true },
        { id: 'c', text: 'Is your name what?', correct: false },
      ],
      explanationHi: 'सही! "What is your + [noun]?" ऐसे काम करता है।',
      explanationEn: 'Correct! "What is your + [noun]?" works like this.',
    },
    {
      type: 'mcq',
      id: 'mcq-do',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'कोई क्या काम करता है, यह पूछने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to ask what someone does.',
      options: [
        { id: 'a', text: 'What you do?', correct: false },
        { id: 'b', text: 'Do you what?', correct: false },
        { id: 'c', text: 'What do you do?', correct: true },
      ],
      hint: { pattern: 'What do you + [verb]?', example: 'What do you do?' },
      explanationHi: 'बढ़िया! "What do you + [verb]?" ऐसे काम करता है।',
      explanationEn: 'Great! "What do you + [verb]?" works like this.',
    },
    {
      type: 'build',
      id: 'build-name',
      quest: 2,
      promptHi: 'आपका नाम क्या है?',
      answer: ['What', 'is', 'your', 'name?'],
      hint: { pattern: 'What is your + [noun]?', example: 'What is your name?' },
    },
    {
      type: 'build',
      id: 'build-from',
      quest: 2,
      promptHi: 'आप कहाँ से हैं?',
      answer: ['Where', 'are', 'you', 'from?'],
      hint: { pattern: 'Where are you from?', example: 'Where are you from?' },
    },
    {
      type: 'build',
      id: 'build-do',
      quest: 2,
      promptHi: 'आप क्या करते हैं?',
      answer: ['What', 'do', 'you', 'do?'],
      hint: { pattern: 'What do you + [verb]?', example: 'What do you do?' },
    },
    {
      type: 'build',
      id: 'build-like',
      quest: 2,
      promptHi: 'आपको क्या करना पसंद है?',
      answer: ['What', 'do', 'you', 'like', 'to', 'do?'],
      hint: { pattern: 'What do you like to + [verb]?', example: 'What do you like to eat?' },
    },
    {
      type: 'build',
      id: 'build-live',
      quest: 2,
      promptHi: 'आप कहाँ रहते हैं?',
      answer: ['Where', 'do', 'you', 'live?'],
      hint: { pattern: 'Where do you + [verb]?', example: 'Where do you work?' },
    },
  ],

  speakFlow: [
    {
      id: 'ask-name',
      quest: 3,
      promptEn: 'Ask Nova what her name is.',
      promptHi: 'Nova से पूछिए उसका नाम क्या है।',
      hint: { pattern: 'What is your + [noun]?', example: 'What is your name?' },
    },
    {
      id: 'ask-from',
      quest: 3,
      promptEn: 'Ask Nova where she is from.',
      promptHi: 'Nova से पूछिए वह कहाँ से है।',
      hint: { pattern: 'Where are you from?', example: 'Where are you from?' },
    },
    {
      id: 'ask-do',
      quest: 3,
      promptEn: 'Ask Nova what she does.',
      promptHi: 'Nova से पूछिए वह क्या करती है।',
      hint: { pattern: 'What do you do?', example: 'What do you do?' },
    },
    {
      id: 'ask-like',
      quest: 3,
      promptEn: 'Ask Nova what she likes to do.',
      promptHi: 'Nova से पूछिए उसे क्या करना पसंद है।',
      hint: { pattern: 'What do you like to + [verb]?', example: 'What do you like to do?' },
    },
    {
      id: 'ask-combo',
      quest: 3,
      promptEn: 'Now ask Nova two or three questions in a row, like a real conversation.',
      promptHi: 'अब Nova से लगातार दो-तीन सवाल पूछिए, जैसे एक असली बातचीत हो।',
      isFinal: true,
    },
  ],
};
