import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlayAudioButton } from '@/components/supernova/PlayAudioButton';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { SupportLanguage } from '@/components/supernova/LanguageToggle';
import type { IntroStep } from '@/lib/curriculum/lesson-types';

export function IntroCard({
  step,
  language,
  onNext,
}: {
  step: IntroStep;
  language: SupportLanguage;
  onNext: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{step.emoji}</Text>
      {/* Auto-plays as soon as this card appears — including the very
          first card of a lesson (day 1 always opens on an intro step).
          audioTextEn (a listening-comprehension clip) takes priority when
          present so the two buttons never both autoplay and talk over
          each other — see PlayAudioButton's `autoPlay` docs. */}
      {step.audioTextEn ? <PlayAudioButton text={step.audioTextEn} autoPlay /> : null}
      <Text style={styles.text}>{language === 'hi' ? step.textHi : step.textEn}</Text>
      <PlayAudioButton
        text={language === 'hi' ? step.textHi : step.textEn}
        language={language}
        autoPlay={!step.audioTextEn}
      />
      <PrimaryButton label="NEXT!" onPress={onNext} style={styles.button} />
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: Radii.lg,
      padding: Space.xl,
      alignItems: 'center',
      gap: Space.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    emoji: {
      fontSize: 56,
    },
    text: {
      color: colors.graphite,
      fontSize: 17,
      lineHeight: 26,
      textAlign: 'center',
    },
    button: {
      alignSelf: 'stretch',
      marginTop: Space.md,
    },
  });
}
