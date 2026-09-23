import type { QuestType } from '@/lib/curriculum/types';

import { apiGet } from './client';

export interface WeekRow {
  week: number;
  week_arc: string;
  weekly_outcome: string;
  speaking_mission: string;
  primary_language_support: string;
}

export interface DayRow {
  week: number;
  day: number;
  week_arc: string;
  weekly_outcome: string;
  daily_mini_outcome: string;
  activity_mix: string;
  revision: boolean;
  quest_count: number;
  quest_1: string | null;
  quest_1_type: QuestType | null;
  quest_2: string | null;
  quest_2_type: QuestType | null;
  quest_3: string | null;
  quest_3_type: QuestType | null;
  quest_4: string | null;
  quest_4_type: QuestType | null;
  tasks_quest: string;
  estimated_minutes: number;
}

export async function fetchWeek(week: number): Promise<WeekRow> {
  return apiGet<WeekRow>(`/api/curriculum/weeks/${week}`);
}

export async function fetchDaysForWeek(week: number): Promise<DayRow[]> {
  const { days } = await apiGet<{ week: number; days: DayRow[] }>(`/api/curriculum/weeks/${week}/days`);
  return days;
}
