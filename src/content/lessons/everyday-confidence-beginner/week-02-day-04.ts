import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=4: "Listen & Notice" (listening, quest 1) + "Talk with Nova"
// (conversation, quest 2) — same shape as week-01-day-06.ts (listen in
// learnFlow, converse in speakFlow).
export const week02Day04: DayLesson = {
  week: 2,
  day: 4,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Ask someone where they live',

  learnFlow: [
    {
      type: 'intro',
      id: 'listen-1',
      quest: 1,
      emoji: '🎧',
      textHi: 'ध्यान से सुनिए। बस सुनिए — अभी कुछ करना नहीं है।',
      textEn: 'Listen carefully. Just listen for now — nothing to do yet.',
      audioTextEn: 'Where do you live?',
    },
    {
      type: 'mcq',
      id: 'listen-identify',
      quest: 1,
      promptHi: 'Nova ने बिल्कुल क्या कहा?',
      promptEn: 'What did Nova say, exactly?',
      audioTextEn: 'Do you live near here?',
      options: [
        { id: 'a', text: 'Do you live near here?', correct: true },
        { id: 'b', text: 'Do you live far from here?', correct: false },
        { id: 'c', text: 'Did you live near here?', correct: false },
      ],
      explanationHi: 'सही! ध्यान से शब्दों को पहचानना ज़रूरी है।',
      explanationEn: 'Correct! Catching the exact words matters here.',
    },
    {
      type: 'mcq',
      id: 'listen-meaning',
      quest: 1,
      promptHi: 'इस सवाल का मतलब क्या है?',
      promptEn: 'What does this question mean?',
      audioTextEn: 'What is your area like?',
      options: [
        { id: 'a', text: 'आपका area कहाँ है?', correct: false },
        { id: 'b', text: 'आपका area कैसा है?', correct: true },
        { id: 'c', text: 'आपका area कब है?', correct: false },
      ],
      explanationHi: 'सही! "What is your area like?" यानी आपका area कैसा है, यह पूछता है।',
      explanationEn: 'Correct! "What is your area like?" asks what your area is like.',
    },
    {
      type: 'mcq',
      id: 'listen-response',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'सही जवाब कौन सा है?',
      promptEn: 'What would be an appropriate response?',
      audioTextEn: 'Where do you live?',
      hint: { pattern: 'I live in/near + [Place].', example: 'I live near the market.' },
      options: [
        { id: 'a', text: 'I live near the market.', correct: true },
        { id: 'b', text: 'I am from Delhi.', correct: false },
        { id: 'c', text: 'Yes, I am.', correct: false },
      ],
      explanationHi: 'सही! यह सवाल आप कहाँ रहते हैं, इसके बारे में है।',
      explanationEn: 'Correct! It asked where you live, so the reply should say where.',
    },
    {
      type: 'build',
      id: 'listen-retell',
      quest: 1,
      promptHi: 'जो sentence आपने अभी सुना, उसे फिर से बनाइए।',
      audioTextEn: 'Is it quiet in your area?',
      answer: ['Is', 'it', 'quiet', 'in', 'your', 'area?'],
      hint: { pattern: 'Is it + [adjective] + in your area?', example: 'Is it busy in your city?' },
    },
  ],

  speakFlow: [
    {
      id: 'converse-ask-where',
      quest: 2,
      promptEn: 'Ask Nova where she lives.',
      promptHi: 'Nova से पूछिए वह कहाँ रहती है।',
      hint: { pattern: 'Where do you live?', example: 'Where do you live?' },
    },
    {
      id: 'converse-ask-area',
      quest: 2,
      promptEn: 'Ask Nova what her area is like.',
      promptHi: 'Nova से पूछिए उसका area कैसा है।',
      hint: { pattern: 'What is your area like?', example: 'What is your area like?' },
    },
    {
      id: 'converse-respond',
      quest: 2,
      promptEn: 'Nova asks where you live — answer her.',
      promptHi: 'Nova पूछती है आप कहाँ रहते हैं — जवाब दीजिए।',
      hint: { pattern: 'I live in/near + [Place].', example: 'I live near a big park.' },
    },
    {
      id: 'converse-followup',
      quest: 2,
      promptEn: 'Nova asks a follow-up about your area — answer naturally.',
      promptHi: 'Nova आपके area के बारे में एक follow-up सवाल पूछती है — natural जवाब दीजिए।',
    },
    {
      id: 'converse-full',
      quest: 2,
      promptEn: 'Have a short exchange: ask Nova where she lives, and answer when she asks you back.',
      promptHi: 'एक छोटी बातचीत कीजिए: Nova से पूछिए वह कहाँ रहती है, और जब वह आपसे पूछे तो जवाब दीजिए।',
      isFinal: true,
    },
  ],
};
