import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=2, day=5: "Practice with Translation" (translation, quest 1) +
// "Speak It" (speaking, quest 2). No "Learn the Rule" quest — this day
// applies Days 1-4's patterns (there is/are, adjectives, prepositions) to a
// new "because" reason-giving pattern via translation, without a separate
// grammar walkthrough.
export const week02Day05: DayLesson = {
  week: 2,
  day: 5,
  skillId: 'describe_place',
  weeklyOutcome: 'Describe where you live and what it is like.',
  dailyOutcome: 'Say what you like about your area',

  learnFlow: [
    {
      type: 'build',
      id: 'translate-like-1',
      quest: 1,
      promptHi: 'मुझे अपना area पसंद है क्योंकि यह शांत है।',
      answer: ['I', 'like', 'my', 'area', 'because', 'it', 'is', 'quiet.'],
      hint: { pattern: 'I like + [noun] because + [clause].', example: 'I like my city because it is clean.' },
    },
    {
      type: 'build',
      id: 'translate-like-2',
      quest: 1,
      promptHi: 'मुझे यहाँ का park पसंद है क्योंकि यह हरा-भरा है।',
      answer: ['I', 'like', 'the', 'park', 'here', 'because', 'it', 'is', 'green.'],
      hint: { pattern: 'I like + [noun] because + [clause].', example: 'I like the market here because it is lively.' },
    },
    {
      type: 'build',
      id: 'translate-like-3',
      quest: 1,
      promptHi: 'मुझे अपने neighborhood के लोग पसंद हैं क्योंकि वे friendly हैं।',
      answer: ['I', 'like', 'the', 'people', 'in', 'my', 'neighborhood', 'because', 'they', 'are', 'friendly.'],
      hint: { pattern: 'I like + [noun] because + [clause].', example: 'I like the shops here because they are cheap.' },
    },
    {
      type: 'build',
      id: 'translate-dislike',
      quest: 1,
      promptHi: 'मुझे traffic पसंद नहीं है क्योंकि यह बहुत busy है।',
      answer: ['I', "don't", 'like', 'the', 'traffic', 'because', 'it', 'is', 'very', 'busy.'],
      hint: { pattern: "I don't like + [noun] because + [clause].", example: "I don't like the noise because it is very loud." },
    },
    {
      type: 'build',
      id: 'translate-combo',
      quest: 1,
      promptHi: 'मुझे अपना शहर पसंद है क्योंकि यह green है, लेकिन traffic पसंद नहीं है।',
      answer: ['I', 'like', 'my', 'city', 'because', 'it', 'is', 'green,', 'but', 'I', "don't", 'like', 'the', 'traffic.'],
      hint: {
        pattern: "I like + [noun] because ..., but I don't like + [noun].",
        example: "I like my town because it is quiet, but I don't like the heat.",
      },
    },
  ],

  speakFlow: [
    {
      id: 'speak-like-1',
      quest: 2,
      promptEn: 'Say one thing you like about your area.',
      promptHi: 'बताइए आपको अपने area में क्या पसंद है।',
      hint: { pattern: 'I like + [noun] because + [clause].', example: 'I like my area because it is quiet.' },
    },
    {
      id: 'speak-like-2',
      quest: 2,
      promptEn: 'Say one more thing you like about it.',
      promptHi: 'बताइए और क्या पसंद है।',
    },
    {
      id: 'speak-dislike',
      quest: 2,
      promptEn: "Say one thing you don't like about your area (if anything).",
      promptHi: 'बताइए क्या आपको अपने area में पसंद नहीं है (अगर कुछ है तो)।',
      hint: { pattern: "I don't like + [noun] because + [clause].", example: "I don't like the traffic because it is slow." },
    },
    {
      id: 'speak-combo',
      quest: 2,
      promptEn: "Combine what you like and don't like into one or two sentences.",
      promptHi: 'पसंद और नापसंद को एक-दो sentences में मिलाकर बोलिए।',
    },
    {
      id: 'speak-final',
      quest: 2,
      promptEn: "Now say it naturally, like you're telling a friend about your area.",
      promptHi: 'अब natural तरीके से बोलिए, जैसे किसी दोस्त को अपने area के बारे में बता रहे हों।',
      isFinal: true,
    },
  ],
};
