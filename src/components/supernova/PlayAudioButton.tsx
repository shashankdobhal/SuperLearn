import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';
import { playAudio, type SpokenLanguage } from '@/lib/audio/ttsAudio';

/** Speaks `text` aloud — a pre-generated Kokoro audio file when one exists
 * for this exact (language, text) pair, on-device TTS otherwise (see
 * src/lib/audio/ttsAudio.ts). `language` is 'en' (default) or 'hi'. Shared
 * by any card that needs a "read aloud" affordance: the
 * listening-comprehension `audioTextEn` field (see SpeakCard, and the
 * intro/mcq/build cards), and more generally the visible instructional
 * text on intro/rule/mcq cards. */
export function PlayAudioButton({ text, language = 'en' }: { text: string; language?: SpokenLanguage }) {
  return (
    <Pressable onPress={() => playAudio(text, language)} style={styles.button}>
      <Ionicons name="volume-high" size={16} color={Colors.primary} />
      <Text style={styles.text}>PLAY</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radii.pill,
    paddingVertical: Space.xs,
    paddingHorizontal: Space.md,
  },
  text: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
});
