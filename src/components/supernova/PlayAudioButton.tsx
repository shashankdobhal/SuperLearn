import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

// expo-speech has no way to pick a "playful"/"clear" voice generically — it
// just plays through whatever TTS engine + voice the OS/browser defaults to.
// A real upgrade there means a hosted neural TTS engine (e.g. Piper), not a
// library swap. This is the free lever available today: name a specific
// well-regarded built-in voice per language instead of leaving it to the
// platform's own default, and nudge pitch/rate for a
// warmer, more energetic delivery. `voice` is matched by exact identifier
// (web: SpeechSynthesisVoice.voiceURI) — verified against this machine's
// voice list, but a platform/voice combination that doesn't exist just
// silently falls back to that platform's own default, never throws.
const VOICE_BY_LANGUAGE: Record<string, string> = {
  'en-US': 'Samantha',
  'en-GB': 'Daniel',
  'hi-IN': 'Lekha',
};

/** Speaks `text` aloud (see the tuning note above) — exported so SpeakCard's
 * own PLAY button can use the same voice/pitch/rate instead of duplicating
 * it with a bare `Speech.speak` call. */
export function speak(text: string, language = 'en-US') {
  Speech.speak(text, { language, voice: VOICE_BY_LANGUAGE[language], pitch: 1.05, rate: 0.92 });
}

/** Speaks `text` aloud via on-device/browser TTS (`language` picks the voice
 * — 'en-US' by default, pass 'hi-IN' for Hindi text). Shared by any card
 * that needs a "read aloud" affordance: the listening-comprehension
 * `audioTextEn` field (see SpeakCard, and the intro/mcq/build cards), and
 * more generally the visible instructional text on intro/rule/mcq cards. */
export function PlayAudioButton({ text, language = 'en-US' }: { text: string; language?: string }) {
  return (
    <Pressable onPress={() => speak(text, language)} style={styles.button}>
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
