/**
 * Walks every authored lesson file and collects exactly the (language, text)
 * pairs the app ever passes to a "read aloud" button — see
 * src/components/supernova/PlayAudioButton.tsx and SpeakCard.tsx for the
 * call sites this mirrors. Writes a deduplicated manifest for
 * generate_audio.py to synthesize. Re-run whenever lesson content changes;
 * idempotent since generate_audio.py skips files that already exist.
 *
 * Usage: npx tsx scripts/tts/dump_manifest.ts
 */
import { writeFileSync } from 'fs';

import { loadAllLessons } from '../lib/loadAllLessons';
import { audioFileHash } from '../../src/lib/audio/hash';

interface ManifestEntry {
  lang: 'en' | 'hi';
  text: string;
  hash: string;
}

async function main() {
  const lessons = await loadAllLessons();
  const entries = new Map<string, ManifestEntry>();
  function add(lang: 'en' | 'hi', text: string | undefined) {
    if (!text) return;
    const hash = audioFileHash(lang, text);
    entries.set(hash, { lang, text, hash });
  }

  for (const lesson of lessons) {
    for (const step of lesson.learnFlow) {
      if (step.type === 'intro') {
        add('hi', step.textHi);
        add('en', step.textEn);
        add('en', step.audioTextEn);
      } else if (step.type === 'rule') {
        add('en', step.example);
      } else if (step.type === 'mcq') {
        add('hi', step.promptHi);
        add('en', step.promptEn);
        add('en', step.audioTextEn);
      } else if (step.type === 'build') {
        add('en', step.audioTextEn);
      }
    }
    for (const step of lesson.speakFlow) {
      add('en', step.promptEn);
    }
  }

  const manifest = Array.from(entries.values());
  writeFileSync(`${__dirname}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifest.length} unique (lang, text) entries to scripts/tts/manifest.json`);
}

main();
