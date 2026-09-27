import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SupportLanguage } from '@/components/supernova/LanguageToggle';
import { PlayAudioButton } from '@/components/supernova/PlayAudioButton';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { RuleStep } from '@/lib/curriculum/lesson-types';

export function RuleCard({
  step,
  language,
  onNext,
}: {
  step: RuleStep;
  language: SupportLanguage;
  onNext: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Most existing content predates textEn — fall back to Hindi rather than
  // show a blank caption when a step hasn't been authored with one yet.
  const caption = language === 'en' && step.textEn ? step.textEn : step.textHi;
  return (
    <View style={styles.card}>
      <Text style={styles.caption}>{caption}</Text>
      <View style={styles.patternBox}>
        <Text style={styles.pattern}>{step.pattern}</Text>
      </View>
      <Text style={styles.example}>{step.example}</Text>
      <PlayAudioButton text={step.example} autoPlay />
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
      gap: Space.md,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    caption: {
      color: colors.muted,
      fontSize: 14,
    },
    patternBox: {
      backgroundColor: colors.brandOrangeMuted,
      borderRadius: Radii.md,
      paddingVertical: Space.lg,
      paddingHorizontal: Space.lg,
    },
    pattern: {
      color: colors.brandOrange,
      fontWeight: '800',
      fontSize: 18,
      textAlign: 'center',
    },
    example: {
      color: colors.graphite,
      fontSize: 15,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    button: {
      marginTop: Space.md,
    },
  });
}
