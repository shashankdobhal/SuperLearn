import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

/** Speaks `text` aloud via on-device/browser TTS (`language` picks the voice
 * — 'en-US' by default, pass 'hi-IN' for Hindi text). Shared by any card
 * that needs a "read aloud" affordance: the listening-comprehension
 * `audioTextEn` field (see SpeakCard, and the intro/mcq/build cards), and
 * more generally the visible instructional text on intro/rule/mcq cards. */
export function PlayAudioButton({ text, language = 'en-US' }: { text: string; language?: string }) {
  return (
    <Pressable onPress={() => Speech.speak(text, { language })} style={styles.button}>
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
