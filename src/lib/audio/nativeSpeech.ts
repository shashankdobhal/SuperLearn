import * as Speech from 'expo-speech';

// expo-speech has no way to pick a "playful"/"clear" voice generically — it
// just plays through whatever TTS engine + voice the OS/browser defaults to.
// This is the on-device fallback for lines that don't have a pre-generated
// Kokoro audio file yet (see src/lib/audio/ttsAudio.ts) — name a specific
// well-regarded built-in voice per language instead of leaving it to the
// platform's own default, and nudge pitch/rate for a warmer, clearer
// delivery. `voice` is matched by exact identifier (web:
// SpeechSynthesisVoice.voiceURI) — a platform/voice combination that
// doesn't exist just silently falls back to that platform's own default,
// never throws.
const LOCALE_BY_LANGUAGE: Record<string, string> = { en: 'en-US', hi: 'hi-IN' };
const VOICE_BY_LOCALE: Record<string, string> = {
  'en-US': 'Samantha',
  'en-GB': 'Daniel',
  'hi-IN': 'Lekha',
};

/** Speaks `text` aloud via on-device/browser TTS. `language` is 'en'/'hi'
 * (matching SupportLanguage) — mapped internally to a locale + voice.
 * Resolves once speech actually finishes (or stops/errors) — existing
 * fire-and-forget callers (PlayAudioButton etc.) don't await this, so
 * they're unaffected; NovaConversation needs it to know when to start
 * listening for the learner's next turn. */
export function speak(text: string, language: 'en' | 'hi' = 'en'): Promise<void> {
  const locale = LOCALE_BY_LANGUAGE[language];
  return new Promise((resolve) => {
    Speech.speak(text, {
      language: locale,
      voice: VOICE_BY_LOCALE[locale],
      pitch: 1.05,
      rate: 0.92,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}
