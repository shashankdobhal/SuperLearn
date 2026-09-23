import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FeedbackPanel } from '@/components/supernova/lesson/FeedbackPanel';
import { HintCard } from '@/components/supernova/HintCard';
import type { SupportLanguage } from '@/components/supernova/LanguageToggle';
import { PlayAudioButton } from '@/components/supernova/PlayAudioButton';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Colors, Radii, Space } from '@/constants/palette';
import type { McqStep } from '@/lib/curriculum/lesson-types';

export function McqCard({
  step,
  language,
  onComplete,
}: {
  step: McqStep;
  language: SupportLanguage;
  onComplete: (correct: boolean) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = step.options.find((o) => o.id === selectedId);
  const answered = selectedId !== null;

  return (
    <View style={styles.card}>
      {step.isPopQuiz ? (
        <View style={styles.popQuizBanner}>
          <Text style={styles.popQuizText}>POP QUIZ</Text>
        </View>
      ) : null}

      {step.audioTextEn ? <PlayAudioButton text={step.audioTextEn} /> : null}

      <Text style={styles.prompt}>{language === 'hi' ? step.promptHi : step.promptEn}</Text>

      {step.hint ? <HintCard hint={step.hint} /> : null}

      <View style={styles.options}>
        {step.options.map((option) => {
          const isSelected = option.id === selectedId;
          const showCorrect = answered && option.correct;
          const showWrong = answered && isSelected && !option.correct;
          return (
            <Pressable
              key={option.id}
              disabled={answered}
              onPress={() => setSelectedId(option.id)}
              style={[
                styles.option,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
              ]}>
              <Text style={styles.optionText}>{option.text}</Text>
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <FeedbackPanel
          correct={!!selected?.correct}
          explanation={language === 'hi' ? step.explanationHi : step.explanationEn}
        />
      ) : null}

      {answered ? (
        <PrimaryButton
          label="CONTINUE"
          variant="success"
          onPress={() => onComplete(!!selected?.correct)}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg,
    padding: Space.xl,
    gap: Space.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  popQuizBanner: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: Radii.sm,
    paddingVertical: Space.xs,
    paddingHorizontal: Space.md,
  },
  popQuizText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  prompt: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 24,
  },
  options: {
    gap: Space.md,
  },
  option: {
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderRadius: Radii.md,
    paddingVertical: Space.lg,
    paddingHorizontal: Space.lg,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.successMuted,
  },
  optionWrong: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerMuted,
  },
  optionText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    marginTop: Space.sm,
  },
});
