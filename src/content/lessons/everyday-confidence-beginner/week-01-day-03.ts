import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=1, day=3: "Learn the Rule" (learn, quest 1) + "Listen & Notice"
// (listening, quest 2) + "Speak It" (speaking, quest 3).
//
// The Listen quest reuses the intro/mcq/build task types (with `audioTextEn`
// — see lesson-types.ts) rather than a new "listen" task type, following the
// Quest Blueprint's own "Listen → identify → meaning → response →
// repeat/retell" task mix:
//   1. intro+audio  = Listen (pure exposure)
//   2. mcq+audio, English options = Identify (recognize the exact words)
//   3. mcq+audio, Hindi options   = Meaning (comprehend, not just recognize)
//   4. mcq+audio, English options = Response (pick the appropriate reply)
//   5. build+audio                = Retell (reconstruct what was heard)
export const week01Day03: DayLesson = {
  week: 1,
  day: 3,
  skillId: 'introduce_self',
  weeklyOutcome: 'Give a simple 30–60 second introduction.',
  dailyOutcome: 'Talk about one interest',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '🎯',
      textHi: 'आज हम सीखेंगे कि अपनी रुचियों के बारे में कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to talk about our interests. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-like',
      quest: 1,
      pattern: 'I like + [verb-ing].',
      example: 'I like playing football.',
      breakdown: [
        { text: 'I like', labelHi: 'मुझे पसंद है', labelEn: 'I like' },
        { text: 'playing', labelHi: 'खेलना (verb + ing)', labelEn: 'doing word + ing' },
        { text: 'football.', labelHi: 'कौन-सा खेल/काम', labelEn: 'the activity' },
      ],
      textHi: 'कोई activity पसंद है, यह बताने के लिए यह pattern use करें।',
      textEn: 'Use this pattern to say you like doing an activity.',
    },
    {
      type: 'rule',
      id: 'rule-interested',
      quest: 1,
      pattern: "I'm interested in + [noun / verb-ing].",
      example: "I'm interested in music.",
      breakdown: [
        { text: "I'm interested", labelHi: 'मुझे दिलचस्पी है', labelEn: "I'm interested" },
        { text: 'in', labelHi: 'में', labelEn: 'in' },
        { text: 'music.', labelHi: 'आपकी पसंद', labelEn: 'your interest' },
      ],
      textHi: 'अपनी रुचि बताने का एक और तरीका।',
      textEn: 'Another way to say what interests you.',
    },
    {
      type: 'mcq',
      id: 'mcq-like',
      quest: 1,
      promptHi: 'कौन सा sentence सही तरीके से एक activity पसंद होना बताता है?',
      promptEn: 'Which sentence correctly says you like an activity?',
      options: [
        { id: 'a', text: 'I like play football.', correct: false },
        { id: 'b', text: 'I like playing football.', correct: true },
        { id: 'c', text: 'I liking playing football.', correct: false },
      ],
      explanationHi: 'सही! "I like + [verb-ing]" ऐसे काम करता है।',
      explanationEn: 'Correct! "I like + [verb-ing]" works like this.',
    },
    {
      type: 'mcq',
      id: 'mcq-interested',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'अपनी रुचि बताने का सही तरीका चुनें।',
      promptEn: 'Choose the correct way to say what interests you.',
      options: [
        { id: 'a', text: "I'm interesting in music.", correct: false },
        { id: 'b', text: 'Music interested me.', correct: false },
        { id: 'c', text: "I'm interested in music.", correct: true },
      ],
      hint: { pattern: "I'm interested in + [noun / verb-ing]", example: "I'm interested in music." },
      explanationHi: 'बढ़िया! "I\'m interested in + [noun]" ऐसे काम करता है।',
      explanationEn: 'Great! "I\'m interested in + [noun]" works like this.',
    },
    {
      type: 'intro',
      id: 'listen-1',
      quest: 2,
      emoji: '🎧',
      textHi: 'ध्यान से सुनिए। बस सुनिए — अभी कुछ करना नहीं है।',
      textEn: 'Listen carefully. Just listen for now — nothing to do yet.',
      audioTextEn: 'I like playing football.',
    },
    {
      type: 'mcq',
      id: 'listen-identify',
      quest: 2,
      promptHi: 'Nova ने बिल्कुल क्या कहा?',
      promptEn: 'What did Nova say, exactly?',
      audioTextEn: "I'm interested in music.",
      options: [
        { id: 'a', text: "I'm interested in movies.", correct: false },
        { id: 'b', text: "I'm interested in music.", correct: true },
        { id: 'c', text: "I'm not interested in music.", correct: false },
      ],
      explanationHi: 'सही! ध्यान से शब्दों को पहचानना ज़रूरी है।',
      explanationEn: 'Correct! Catching the exact words matters here.',
    },
    {
      type: 'mcq',
      id: 'listen-meaning',
      quest: 2,
      promptHi: 'इस sentence का मतलब क्या है?',
      promptEn: 'What does this sentence mean?',
      audioTextEn: 'She enjoys reading novels.',
      options: [
        { id: 'a', text: 'उसे novels पढ़ना पसंद है।', correct: true },
        { id: 'b', text: 'उसे novels लिखना पसंद है।', correct: false },
        { id: 'c', text: 'उसे novels बेचना पसंद है।', correct: false },
      ],
      explanationHi: 'सही! "enjoys reading" यानी पढ़ना पसंद है।',
      explanationEn: 'Correct! "Enjoys reading" means she likes to read.',
    },
    {
      type: 'mcq',
      id: 'listen-response',
      quest: 2,
      isPopQuiz: true,
      promptHi: 'सही जवाब कौन सा है?',
      promptEn: 'What would be an appropriate response?',
      audioTextEn: 'What do you enjoy doing?',
      hint: { pattern: 'I enjoy + [verb-ing]', example: 'I enjoy painting.' },
      options: [
        { id: 'a', text: 'I enjoy painting.', correct: true },
        { id: 'b', text: 'I am from Delhi.', correct: false },
        { id: 'c', text: 'Yes, I am.', correct: false },
      ],
      explanationHi: 'सही! यह सवाल आपकी रुचि के बारे में है, इसलिए जवाब भी रुचि के बारे में होना चाहिए।',
      explanationEn: 'Correct! It asked about your interest, so the reply should name one.',
    },
    {
      type: 'build',
      id: 'listen-retell',
      quest: 2,
      promptHi: 'जो sentence आपने अभी सुना, उसे फिर से बनाइए।',
      promptEn: 'Rebuild the sentence you just heard.',
      audioTextEn: 'He is interested in photography.',
      answer: ['He', 'is', 'interested', 'in', 'photography'],
      hint: { pattern: "[Subject] + is interested in + [noun]", example: "She's interested in painting." },
    },
  ],

  speakFlow: [
    {
      id: 'speak-interest-1',
      quest: 3,
      promptEn: "Say one thing you're interested in.",
      promptHi: 'बताइए आपकी किसमें रुचि है।',
      hint: { pattern: "I'm interested in / I like + [noun / verb-ing]", example: "I'm interested in photography." },
    },
    {
      id: 'speak-interest-2',
      quest: 3,
      promptEn: 'Say one more thing you like doing in your free time.',
      promptHi: 'बताइए आप अपने खाली समय में क्या करना पसंद करते हैं।',
      hint: { pattern: 'I like + [verb-ing]', example: 'I like painting.' },
    },
    {
      id: 'speak-interest-combine',
      quest: 3,
      promptEn: 'Combine both interests into one or two sentences.',
      promptHi: 'दोनों रुचियों को एक या दो sentences में मिलाकर बोलिए।',
      hint: {
        pattern: "I'm interested in + [noun], and I like + [verb-ing]",
        example: "I'm interested in photography, and I like painting.",
      },
    },
    {
      id: 'speak-interest-again',
      quest: 3,
      promptEn: 'Try again, a little more naturally — like you’re chatting with a friend.',
      promptHi: 'फिर से बोलिए, इस बार थोड़ा natural तरीके से — जैसे किसी दोस्त से बात कर रहे हों।',
      hint: {
        pattern: "I'm interested in + [noun], and I like + [verb-ing]",
        example: "I'm interested in photography, and I like painting.",
      },
    },
    {
      id: 'speak-interest-final',
      quest: 3,
      promptEn: "Last one — tell me about your interests, as if someone just asked 'What do you like to do?'",
      promptHi: 'आखिरी सवाल — अपनी रुचियों के बारे में बताइए, जैसे किसी ने पूछा हो "आपको क्या करना पसंद है?"',
      isFinal: true,
    },
  ],
};
