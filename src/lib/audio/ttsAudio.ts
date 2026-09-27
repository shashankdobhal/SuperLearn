import { createAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

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

// Every autoPlay-ing card (Intro/Rule/Mcq/Build/Speak) calls playAudio() the
// moment it mounts, with no coordination between them — advancing from one
// card to the next used to leave the OLD card's audio still playing while
// the NEW card's autoplay started on top of it (two overlapping voices).
// Tracking "whatever's currently playing" here, and stopping it at the
// start of every playAudio() call (regardless of whether the new sound is
// a file or on-device speech), fixes that without every card needing to
// know about every other card.
let stopCurrentAudio: (() => void) | null = null;

/** Stops whatever playAudio() started most recently, if anything — used as
 * an unmount safety net (e.g. closing a lesson mid-narration) on top of the
 * automatic stop-before-play above. Safe to call when nothing is playing. */
export function stopAllAudio(): void {
  stopCurrentAudio?.();
  stopCurrentAudio = null;
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
  stopAllAudio();
  const url = getAudioUrl(text, language);
  if (await fileExists(url)) {
    const player = createAudioPlayer(url);
    let settled = false;
    await new Promise<void>((resolve) => {
      stopCurrentAudio = () => {
        if (settled) return;
        settled = true;
        subscription.remove();
        player.remove();
        resolve();
      };
      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish && !settled) {
          settled = true;
          stopCurrentAudio = null;
          subscription.remove();
          player.remove();
          resolve();
        }
      });
      player.play();
    });
    return;
  }
  stopCurrentAudio = () => Speech.stop();
  await speak(text, language);
  stopCurrentAudio = null;
}
