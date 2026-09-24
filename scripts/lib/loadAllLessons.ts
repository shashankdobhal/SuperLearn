import { readdirSync } from 'fs';
import path from 'path';

import type { DayLesson } from '../../src/lib/curriculum/lesson-types';

const LESSONS_DIR = path.join(__dirname, '..', '..', 'src', 'content', 'lessons', 'everyday-confidence-beginner');

/** Dynamically imports every authored lesson file instead of a hand-edited
 * static import list — with 350 possible files (50 weeks x 7 days), an
 * import per file would mean editing 3+ scripts every time a new week gets
 * authored, by any means (hand-written, Claude, or scripts/content-gen/).
 * Sorted by (week, day) so callers get a deterministic order. */
export async function loadAllLessons(): Promise<DayLesson[]> {
  const files = readdirSync(LESSONS_DIR)
    .filter((f) => /^week-\d{2}-day-\d{2}\.ts$/.test(f))
    .sort();

  const lessons: DayLesson[] = [];
  for (const file of files) {
    const mod = await import(path.join(LESSONS_DIR, file));
    const exportName = Object.keys(mod).find((k) => k.startsWith('week'));
    if (!exportName) throw new Error(`${file}: no weekXXDayYY export found`);
    lessons.push(mod[exportName] as DayLesson);
  }
  return lessons.sort((a, b) => a.week - b.week || a.day - b.day);
}
