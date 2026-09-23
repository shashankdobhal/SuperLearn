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
 * button, matching the app's general "degrade gracefully" behavior.
 */
export async function playAudio(text: string, language: SpokenLanguage = 'en'): Promise<void> {
  const url = getAudioUrl(text, language);
  if (await fileExists(url)) {
    const player = createAudioPlayer(url);
    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) {
        subscription.remove();
        player.remove();
      }
    });
    player.play();
    return;
  }
  speak(text, language);
}
