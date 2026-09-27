import { createAudioPlayer } from 'expo-audio';

import { API_BASE_URL } from '@/lib/api/client';
import { audioFileHash } from '@/lib/audio/hash';
import { speak } from '@/lib/audio/nativeSpeech';

export type SpokenLanguage = 'en' | 'hi';

export function getAudioUrl(text: string, language: SpokenLanguage): string {
  return `${API_BASE_URL}/audio/${audioFileHash(language, text)}.mp3`;
}

async function fileExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Plays `text` aloud. Prefers a pre-generated Kokoro audio file (see
 * docs/TTS_AUDIO.md, scripts/tts/) for real neural-voice quality; falls back
 * to on-device TTS (PlayAudioButton's `speak`) when that line hasn't been
 * batch-generated yet (or the API server is unreachable) — never a dead
 * button, matching the app's general "degrade gracefully" behavior. Nova's
 * conversational replies (src/components/supernova/nova/NovaConversation.tsx)
 * are generated live and can never have a pre-rendered file, so they always
 * take the on-device path here — expected, not a fallback failure.
 *
 * Resolves once playback actually finishes, not just once it starts —
 * needed so a caller can await "Nova finished speaking" before listening
 * for the next turn.
 */
export async function playAudio(text: string, language: SpokenLanguage = 'en'): Promise<void> {
  const url = getAudioUrl(text, language);
  if (await fileExists(url)) {
    const player = createAudioPlayer(url);
    await new Promise<void>((resolve) => {
      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          subscription.remove();
          player.remove();
          resolve();
        }
      });
      player.play();
    });
    return;
  }
  await speak(text, language);
}
