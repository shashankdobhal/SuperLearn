import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { playAudio, stopAllAudio, type SpokenLanguage } from '@/lib/audio/ttsAudio';

/** Speaks `text` aloud — a pre-generated Indic Parler-TTS audio file when
 * one exists for this exact (language, text) pair, on-device TTS
 * otherwise (see src/lib/audio/ttsAudio.ts). `language` is 'en' (default)
 * or 'hi'. Shared by any card that needs a "read aloud" affordance: the
 * listening-comprehension `audioTextEn` field (see SpeakCard, and the
 * intro/mcq/build cards), and more generally the visible instructional
 * text on intro/rule/mcq cards.
 *
 * `autoPlay` speaks it once as soon as the button mounts, not just on tap
 * — every card should have exactly one `autoPlay` button (the "primary"
 * narration for that card: the listening-comprehension `audioTextEn` clip
 * when a step has one, otherwise its visible text), never two on the same
 * card, or they'd talk over each other. Call sites decide which one that
 * is (see IntroCard/McqCard's `autoPlay={!step.audioTextEn}` pattern). */
export function PlayAudioButton({
  text,
  language = 'en',
  autoPlay = false,
}: {
  text: string;
  language?: SpokenLanguage;
  autoPlay?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (autoPlay) playAudio(text, language);
    // Runs once per mount only — the card this button lives on remounts
    // per step (key={step.id}) when the text would actually change, so
    // this never needs to re-fire mid-mount. playAudio() itself now stops
    // whatever was previously playing before starting, but this cleanup is
    // still needed for the case where nothing new ever calls playAudio —
    // e.g. closing the lesson entirely mid-narration — so audio doesn't
    // keep playing over whatever screen comes next.
    return () => {
      if (autoPlay) stopAllAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable onPress={() => playAudio(text, language)} style={styles.button}>
      <Ionicons name="volume-high" size={16} color={colors.brandOrange} />
      <Text style={styles.text}>PLAY</Text>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.brandOrangeMuted,
      borderRadius: Radii.pill,
      paddingVertical: Space.xs,
      paddingHorizontal: Space.md,
    },
    text: {
      color: colors.brandOrange,
      fontWeight: '800',
      fontSize: 12,
    },
  });
}
