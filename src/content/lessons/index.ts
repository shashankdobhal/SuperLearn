import type { DayLesson } from '@/lib/curriculum/lesson-types';

import { week01Day01 } from './everyday-confidence-beginner/week-01-day-01';
import { week01Day02 } from './everyday-confidence-beginner/week-01-day-02';

// Only Week 1 / Days 1-2 are authored so far, proving the loop and the
// "not every day uses every modality" rule — not the full 350-day set.
const registry: Record<string, DayLesson> = {
  '1-1': week01Day01,
  '1-2': week01Day02,
};

export function getDayLesson(week: number, day: number): DayLesson | undefined {
  return registry[`${week}-${day}`];
}

export function hasDayLesson(week: number, day: number): boolean {
  return `${week}-${day}` in registry;
}
