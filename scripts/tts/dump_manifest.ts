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

import { week01Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-01';
import { week01Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-02';
import { week01Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-03';
import { week01Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-04';
import { week01Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-05';
import { week01Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-06';
import { week01Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-01-day-07';
import { week02Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-01';
import { week02Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-02';
import { week02Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-03';
import { week02Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-04';
import { week02Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-05';
import { week02Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-06';
import { week02Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-02-day-07';
import { week03Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-01';
import { week03Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-02';
import { week03Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-03';
import { week03Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-04';
import { week03Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-05';
import { week03Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-06';
import { week03Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-03-day-07';
import { week04Day01 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-01';
import { week04Day02 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-02';
import { week04Day03 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-03';
import { week04Day04 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-04';
import { week04Day05 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-05';
import { week04Day06 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-06';
import { week04Day07 } from '../../src/content/lessons/everyday-confidence-beginner/week-04-day-07';
import { audioFileHash } from '../../src/lib/audio/hash';
import type { DayLesson } from '../../src/lib/curriculum/lesson-types';

const LESSONS: DayLesson[] = [
  week01Day01, week01Day02, week01Day03, week01Day04, week01Day05, week01Day06, week01Day07,
  week02Day01, week02Day02, week02Day03, week02Day04, week02Day05, week02Day06, week02Day07,
  week03Day01, week03Day02, week03Day03, week03Day04, week03Day05, week03Day06, week03Day07,
  week04Day01, week04Day02, week04Day03, week04Day04, week04Day05, week04Day06, week04Day07,
];

interface ManifestEntry {
  lang: 'en' | 'hi';
  text: string;
  hash: string;
}

const entries = new Map<string, ManifestEntry>();
function add(lang: 'en' | 'hi', text: string | undefined) {
  if (!text) return;
  const hash = audioFileHash(lang, text);
  entries.set(hash, { lang, text, hash });
}

for (const lesson of LESSONS) {
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
