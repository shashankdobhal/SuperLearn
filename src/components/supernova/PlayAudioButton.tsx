import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

/** Speaks `text` aloud in English via on-device TTS. Shared by any card that
 * needs a listening-comprehension "PLAY" affordance (see SpeakCard, and the
 * intro/mcq/build cards' optional `audioTextEn` field). */
export function PlayAudioButton({ text }: { text: string }) {
  return (
    <Pressable onPress={() => Speech.speak(text, { language: 'en-US' })} style={styles.button}>
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
