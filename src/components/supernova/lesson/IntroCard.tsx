import { StyleSheet, Text, View } from 'react-native';

import { PlayAudioButton } from '@/components/supernova/PlayAudioButton';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Colors, Radii, Space } from '@/constants/palette';
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
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{step.emoji}</Text>
      {step.audioTextEn ? <PlayAudioButton text={step.audioTextEn} /> : null}
      <Text style={styles.text}>{language === 'hi' ? step.textHi : step.textEn}</Text>
      <PlayAudioButton text={language === 'hi' ? step.textHi : step.textEn} language={language} />
      <PrimaryButton label="NEXT!" onPress={onNext} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg,
    padding: Space.xl,
    alignItems: 'center',
    gap: Space.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emoji: {
    fontSize: 56,
  },
  text: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Space.md,
  },
});
