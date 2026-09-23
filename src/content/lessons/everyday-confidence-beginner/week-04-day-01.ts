import type { DayLesson } from '@/lib/curriculum/lesson-types';

// Authored against content/curriculum/everyday-confidence/beginner/days.json
// week=4, day=1: "Learn the Rule" (learn, quest 1) + "Practice with
// Translation" (translation, quest 2) + "Speak It" (speaking, quest 3).
// New skill this week: describe_routine. Grammar focus: present simple;
// time; usually/sometimes/never; routine verbs.
export const week04Day01: DayLesson = {
  week: 4,
  day: 1,
  skillId: 'describe_routine',
  weeklyOutcome: 'Describe a typical day in simple connected sentences.',
  dailyOutcome: 'Say what you do in the morning',

  learnFlow: [
    {
      type: 'intro',
      id: 'intro-1',
      quest: 1,
      emoji: '☀️',
      textHi: 'आज हम सीखेंगे कि सुबह क्या करते हैं, यह कैसे बताएं। चलिए शुरू करते हैं!',
      textEn: "Today we'll learn to say what we do in the morning. Let's begin!",
    },
    {
      type: 'rule',
      id: 'rule-present-simple',
      quest: 1,
      pattern: 'I + [verb] + at/in + [time].',
      example: 'I wake up at 6 am.',
      textHi: 'रोज़ की आदत बताने के लिए present simple use करें।',
    },
    {
      type: 'rule',
      id: 'rule-routine-verbs',
      quest: 1,
      pattern: 'I + [wake up / get up / have breakfast / brush my teeth] + ...',
      example: 'I have breakfast at 7:30.',
      textHi: 'सुबह की routine बताने के लिए common verbs।',
    },
    {
      type: 'mcq',
      id: 'mcq-present-simple',
      quest: 1,
      promptHi: 'सही sentence कौन सा है?',
      promptEn: 'Which sentence is correct?',
      options: [
        { id: 'a', text: 'I wakes up at 6 am.', correct: false },
        { id: 'b', text: 'I wake up at 6 am.', correct: true },
        { id: 'c', text: 'I waking up at 6 am.', correct: false },
      ],
      explanationHi: 'सही! "I" के साथ verb में "-s" नहीं लगता।',
      explanationEn: 'Correct! "I" doesn\'t take an "-s" on the verb.',
    },
    {
      type: 'mcq',
      id: 'mcq-routine',
      quest: 1,
      isPopQuiz: true,
      promptHi: 'नाश्ते के बारे में सही sentence चुनें।',
      promptEn: 'Choose the correct sentence about breakfast.',
      options: [
        { id: 'a', text: 'I have breakfast at 7:30.', correct: true },
        { id: 'b', text: 'I having breakfast at 7:30.', correct: false },
        { id: 'c', text: 'I has breakfast at 7:30.', correct: false },
      ],
      hint: { pattern: 'I have + [noun] + at + [time].', example: 'I have lunch at 1 pm.' },
      explanationHi: 'बढ़िया! "I have + [noun]" ऐसे काम करता है।',
      explanationEn: 'Great! "I have + [noun]" works like this.',
    },
    {
      type: 'build',
      id: 'translate-wake',
      quest: 2,
      promptHi: 'मैं सुबह 6 बजे उठता हूँ।',
      answer: ['I', 'wake', 'up', 'at', '6', 'am.'],
      hint: { pattern: 'I wake up at + [time].', example: 'I wake up at 7 am.' },
    },
    {
      type: 'build',
      id: 'translate-brush',
      quest: 2,
      promptHi: 'उठने के बाद, मैं अपने दाँत साफ करता हूँ।',
      answer: ['After', 'waking', 'up,', 'I', 'brush', 'my', 'teeth.'],
      hint: { pattern: 'After waking up, I + [verb].', example: 'After waking up, I make my bed.' },
    },
    {
      type: 'build',
      id: 'translate-breakfast',
      quest: 2,
      promptHi: 'मैं सुबह 7:30 बजे नाश्ता करता हूँ।',
      answer: ['I', 'have', 'breakfast', 'at', '7:30', 'am.'],
      hint: { pattern: 'I have breakfast at + [time].', example: 'I have breakfast at 8 am.' },
    },
    {
      type: 'build',
      id: 'translate-exercise',
      quest: 2,
      promptHi: 'नाश्ते से पहले, मैं थोड़ी exercise करता हूँ।',
      answer: ['Before', 'breakfast,', 'I', 'do', 'some', 'exercise.'],
      hint: { pattern: 'Before + [noun], I + [verb].', example: 'Before dinner, I take a walk.' },
    },
    {
      type: 'build',
      id: 'translate-combo',
      quest: 2,
      promptHi: 'मैं 6 बजे उठता हूँ, नहाता हूँ, और फिर नाश्ता करता हूँ।',
      answer: ['I', 'wake', 'up', 'at', '6,', 'take', 'a', 'shower,', 'and', 'then', 'have', 'breakfast.'],
      hint: { pattern: 'I + [verb1], [verb2], and then + [verb3].', example: 'I wake up at 7, get dressed, and then go to work.' },
    },
  ],

  speakFlow: [
    {
      id: 'speak-wake',
      quest: 3,
      promptEn: 'Say what time you wake up.',
      promptHi: 'बताइए आप कितने बजे उठते हैं।',
      hint: { pattern: 'I wake up at + [time].', example: 'I wake up at 6:30.' },
    },
    {
      id: 'speak-morning-1',
      quest: 3,
      promptEn: 'Say one thing you do right after waking up.',
      promptHi: 'बताइए उठने के तुरंत बाद आप क्या करते हैं।',
    },
    {
      id: 'speak-breakfast',
      quest: 3,
      promptEn: 'Say what time you have breakfast.',
      promptHi: 'बताइए आप कितने बजे नाश्ता करते हैं।',
      hint: { pattern: 'I have breakfast at + [time].', example: 'I have breakfast at 8 am.' },
    },
    {
      id: 'speak-combo',
      quest: 3,
      promptEn: 'Combine 2-3 morning activities in order.',
      promptHi: 'सुबह की 2-3 activities को क्रम में मिलाइए।',
      hint: { pattern: 'First I..., then I..., and then I...', example: 'First I wake up, then I shower, and then I have breakfast.' },
    },
    {
      id: 'speak-final',
      quest: 3,
      promptEn: 'Now describe your whole morning routine naturally.',
      promptHi: 'अब अपनी पूरी सुबह की routine natural तरीके से बताइए।',
      isFinal: true,
    },
  ],
};
