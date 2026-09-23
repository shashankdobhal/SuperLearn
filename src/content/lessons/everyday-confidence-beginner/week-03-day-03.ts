import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=3, day=3: "Listen & Notice" (listening, quest 1) + "Speak It"
// (speaking, quest 2) — same Listen→Identify→Meaning→Response→Retell shape
// as week-01-day-03.ts / week-02-day-04.ts.
export const week03Day03: DayLesson = {
  week: 3,
  day: 3,
  skillId: 'express_preference',
  weeklyOutcome: 'Express preferences and ask others about theirs.',
  dailyOutcome: 'Talk about hobbies and entertainment',

  learnFlow: [
    {
      type: 'intro',
      id: 'listen-1',
      quest: 1,
      emoji: '🎧',
      textHi: 'ध्यान से सुनिए। बस सुनिए — अभी कुछ करना नहीं है।',
      textEn: 'Listen carefully. Just listen for now — nothing to do yet.',
      audioTextEn: 'I love watching movies on weekends.',
    },
    {
      type: 'mcq',
      id: 'listen-identify',
      quest: 1,
      promptHi: 'Nova ने बिल्कुल क्या कहा?',
      promptEn: 'What did Nova say, exactly?',
      audioTextEn: 'I really enjoy playing badminton.',
      options: [
        { id: 'a', text: 'I really enjoy playing badminton.', correct: true },
        { id: 'b', text: 'I really enjoy watching badminton.', correct: false },
        { id: 'c', text: 'I rarely enjoy playing badminton.', correct: false },
      ],
      explanationHi: 'सही! ध्यान से शब्दों को पहचानना ज़रूरी है।',
      explanationEn: 'Correct! Catching the exact words matters here.',
    },
    {
      type: 'mcq',
      id: 'listen-meaning',
      quest: 1,
      promptHi: 'इस sentence का मतलब क्या है?',
      promptEn: 'What does this sentence mean?',
      audioTextEn: "I'm not really into sports.",
      options: [
        { id: 'a', text: 'मुझे sports में ज़्यादा रुचि नहीं है।', correct: true },
        { id: 'b', text: 'मुझे sports बहुत पसंद हैं।', correct: false },
        { id: 'c', text: 'मैं sports नहीं देख सकता।', correct: false },
      ],
      explanationHi: "सही! \"I'm not really into sports\" यानी sports में ज़्यादा रुचि नहीं है।",
      explanationEn: 'Correct! "I\'m not really into sports" means it isn\'t of much interest.',
    },
    {
      type: 'mcq',
      id: 'listen-response',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'सही जवाब कौन सा है?',
      promptEn: 'What would be an appropriate response?',
      audioTextEn: 'What kind of music do you like?',
      hint: { pattern: 'I like + [genre/noun].', example: 'I like classical music.' },
      options: [
        { id: 'a', text: 'I like classical music.', correct: true },
        { id: 'b', text: 'I am from Delhi.', correct: false },
        { id: 'c', text: 'Yes, I do.', correct: false },
      ],
      explanationHi: 'सही! यह सवाल किस तरह का संगीत पसंद है, इसके बारे में है।',
      explanationEn: 'Correct! It asked what kind of music you like, so the reply should name one.',
    },
    {
      type: 'build',
      id: 'listen-retell',
      quest: 1,
      promptHi: 'जो sentence आपने अभी सुना, उसे फिर से बनाइए।',
      audioTextEn: 'She enjoys watching cricket matches.',
      answer: ['She', 'enjoys', 'watching', 'cricket', 'matches.'],
      hint: { pattern: '[Subject] + enjoys + [verb-ing] + [noun].', example: 'He enjoys playing chess.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-hobby-1',
      quest: 2,
      promptEn: 'Say one hobby you enjoy.',
      promptHi: 'बताइए आपको कौन सा hobby करना पसंद है।',
      hint: { pattern: 'I enjoy + [verb-ing].', example: 'I enjoy painting.' },
    },
    {
      id: 'speak-entertainment',
      quest: 2,
      promptEn: 'Say one type of entertainment you like — movies, music, or sports.',
      promptHi: 'बताइए आपको किस तरह का entertainment पसंद है — movies, music, या sports।',
      hint: { pattern: 'I like + [noun].', example: 'I like Bollywood movies.' },
    },
    {
      id: 'speak-not-into',
      quest: 2,
      promptEn: "Say one thing you're not really into.",
      promptHi: 'बताइए ऐसी कोई चीज़ जिसमें आपकी ज़्यादा रुचि नहीं है।',
      hint: { pattern: "I'm not really into + [noun].", example: "I'm not really into sports." },
    },
    {
      id: 'speak-combo',
      quest: 2,
      promptEn: 'Combine a hobby and a type of entertainment you like into one or two sentences.',
      promptHi: 'एक hobby और एक तरह का entertainment जो आपको पसंद है, उसे एक-दो sentences में मिलाइए।',
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: 'Now talk about your hobbies and entertainment naturally, like chatting with a friend.',
      promptHi: 'अब अपने hobbies और entertainment के बारे में natural तरीके से बोलिए, जैसे किसी दोस्त से बात कर रहे हों।',
      isFinal: true,
    },
  ],
};
