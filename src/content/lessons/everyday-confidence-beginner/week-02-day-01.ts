import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=1: "Learn the Rule" (learn, quest 1) + "Practice with
// Translation" (translation, quest 2) + "Speak It" (speaking, quest 3).
// New skill this week: describe_place. Grammar focus per the blueprint's
// grammar_language_focus: there is/are; place vocabulary; basic adjectives.
export const week02Day01: DayLesson = {
  week: 2,
  day: 1,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Name your city and describe it with 2–3 adjectives',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '🏙️',
      textHi: 'आज हम सीखेंगे कि अपने शहर के बारे में कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to talk about our city. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-there-is',
      quest: 1,
      pattern: 'There is + a/an + [singular noun] + in + [place].',
      example: 'There is a park in my city.',
      textHi: 'किसी एक चीज़ के होने की बात करने के लिए यह pattern use करें।',
    },
    {
      type: 'rule',
      id: 'rule-there-are',
      quest: 1,
      pattern: 'There are + [plural noun] + in + [place].',
      example: 'There are many parks in my city.',
      textHi: 'एक से ज़्यादा चीज़ों के होने की बात करने के लिए यह pattern use करें।',
    },
    {
      type: 'rule',
      id: 'rule-adjective',
      quest: 1,
      pattern: '[Place] + is + [adjective].',
      example: 'My city is busy.',
      textHi: 'जगह कैसी है, यह बताने के लिए adjective use करें।',
    },
    {
      type: 'mcq',
      id: 'mcq-there-is-are',
      quest: 1,
      promptHi: 'कौन सा sentence सही है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'There is many parks in my city.', correct: false },
        { id: 'b', text: 'There are many parks in my city.', correct: true },
        { id: 'c', text: 'There are a park in my city.', correct: false },
      ],
      explanationHi: 'सही! एक से ज़्यादा चीज़ों के लिए "There are" use होता है।',
      explanationEn: 'Correct! "There are" is used for more than one thing.',
    },
    {
      type: 'mcq',
      id: 'mcq-adjective',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'अपने शहर को describe करने का सही तरीका कौन सा है?',
      promptEn: 'Which is the correct way to describe your city?',
      options: [
        { id: 'a', text: 'My city busy.', correct: false },
        { id: 'b', text: 'My city is busy.', correct: true },
        { id: 'c', text: 'My city am busy.', correct: false },
      ],
      hint: { pattern: '[Place] + is + [adjective].', example: 'My town is quiet.' },
      explanationHi: 'बढ़िया! "[Place] + is + [adjective]" ऐसे काम करता है।',
      explanationEn: 'Great! "[Place] + is + [adjective]" works like this.',
    },
    {
      type: 'build',
      id: 'translate-park',
      quest: 2,
      promptHi: 'मेरे शहर में एक park है।',
      answer: ['There', 'is', 'a', 'park', 'in', 'my', 'city.'],
      hint: { pattern: 'There is a/an + [noun] + in + [place].', example: 'There is a park in Delhi.' },
    },
    {
      type: 'build',
      id: 'translate-markets',
      quest: 2,
      promptHi: 'मेरे शहर में बहुत सारे markets हैं।',
      answer: ['There', 'are', 'many', 'markets', 'in', 'my', 'city.'],
      hint: { pattern: 'There are + [plural noun] + in + [place].', example: 'There are many shops in Mumbai.' },
    },
    {
      type: 'build',
      id: 'translate-busy',
      quest: 2,
      promptHi: 'मेरा शहर बहुत busy है।',
      answer: ['My', 'city', 'is', 'very', 'busy.'],
      hint: { pattern: '[Place] + is + [adjective].', example: 'My city is very green.' },
    },
    {
      type: 'build',
      id: 'translate-quiet',
      quest: 2,
      promptHi: 'मेरा गाँव बहुत quiet और peaceful है।',
      answer: ['My', 'village', 'is', 'very', 'quiet', 'and', 'peaceful.'],
      hint: { pattern: '[Place] + is + [adjective] and [adjective].', example: 'My town is small and clean.' },
    },
    {
      type: 'build',
      id: 'translate-combo',
      quest: 2,
      promptHi: 'मेरे शहर में एक बड़ा park है, और यह बहुत green है।',
      answer: ['There', 'is', 'a', 'big', 'park', 'in', 'my', 'city,', 'and', 'it', 'is', 'very', 'green.'],
      hint: {
        pattern: 'There is a/an + [adjective] + [noun] + in + [place], and it is + [adjective].',
        example: 'There is a big market in my town, and it is very busy.',
      },
    },
  ],

  speakFlow: [
    {
      id: 'speak-city-name',
      quest: 3,
      promptEn: 'Say the name of your city or town.',
      promptHi: 'अपने शहर या गाँव का नाम बताइए।',
      hint: { pattern: 'I live in + [City].', example: 'I live in Pune.' },
    },
    {
      id: 'speak-adj-1',
      quest: 3,
      promptEn: 'Describe your city with one adjective.',
      promptHi: 'अपने शहर को एक adjective से describe कीजिए।',
      hint: { pattern: 'My city is + [adjective].', example: 'My city is busy.' },
    },
    {
      id: 'speak-adj-2',
      quest: 3,
      promptEn: 'Add one more adjective to describe it.',
      promptHi: 'इसे describe करने के लिए एक और adjective जोड़िए।',
      hint: { pattern: 'My city is + [adjective] and [adjective].', example: 'My city is busy and crowded.' },
    },
    {
      id: 'speak-there-is',
      quest: 3,
      promptEn: 'Say one thing there is in your city.',
      promptHi: 'बताइए आपके शहर में क्या है।',
      hint: { pattern: 'There is/are + [noun] + in my city.', example: 'There is a big market in my city.' },
    },
    {
      id: 'speak-combo',
      quest: 3,
      promptEn: 'Now combine it all: name your city, and describe it with 2–3 adjectives.',
      promptHi: 'अब यह सब मिलाइए: अपने शहर का नाम बताइए, और इसे 2–3 adjectives से describe कीजिए।',
      isFinal: true,
    },
  ],
};
