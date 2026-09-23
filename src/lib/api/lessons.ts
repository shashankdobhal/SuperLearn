import type { DayLesson } from '@/lib/curriculum/lesson-types';

import { apiGet, ApiError } from './client';

/** null = that day genuinely has no authored lesson content (API 404s this). */
export async function fetchDayLesson(week: number, day: number): Promise<DayLesson | null> {
  try {
    return await apiGet<DayLesson>(`/api/lessons/${week}/${day}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchAvailableDays(week: number): Promise<number[]> {
  const { days } = await apiGet<{ week: number; days: number[] }>(`/api/lessons/available?week=${week}`);
  return days;
}
