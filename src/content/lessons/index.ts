import type { DayLesson } from '@/lib/curriculum/lesson-types';

import { week01Day01 } from './everyday-confidence-beginner/week-01-day-01';

// Only Week 1 / Day 1 is authored so far — this is the vertical-slice proof
// of the Learn → Translate → Speak loop, not the full 350-day set.
const registry: Record<string, DayLesson> = {
  '1-1': week01Day01,
};

export function getDayLesson(week: number, day: number): DayLesson | undefined {
  return registry[`${week}-${day}`];
}

export function hasDayLesson(week: number, day: number): boolean {
  return `${week}-${day}` in registry;
}
