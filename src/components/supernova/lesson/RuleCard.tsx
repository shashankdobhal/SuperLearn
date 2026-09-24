import { StyleSheet, Text, View } from 'react-native';

import type { SupportLanguage } from '@/components/supernova/LanguageToggle';
import { PlayAudioButton } from '@/components/supernova/PlayAudioButton';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Colors, Radii, Space } from '@/constants/palette';
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
      <PlayAudioButton text={step.example} />
      <PrimaryButton label="NEXT!" onPress={onNext} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg,
    padding: Space.xl,
    gap: Space.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  caption: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  patternBox: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radii.md,
    paddingVertical: Space.lg,
    paddingHorizontal: Space.lg,
  },
  pattern: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
  },
  example: {
    color: Colors.text,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    marginTop: Space.md,
  },
});
