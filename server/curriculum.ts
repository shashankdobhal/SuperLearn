import { pool } from './db';

// Only track that exists today — see docs/CURRICULUM_DATA.md. Every query
// here is scoped to it; a persona/level switcher is a later feature, not a
// schema problem (see supabase/migrations/0002_curriculum_blueprint.sql).
const PERSONA = 'everyday-confidence';
const LEVEL = 'beginner';

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
  quest_1_type: string | null;
  quest_2: string | null;
  quest_2_type: string | null;
  quest_3: string | null;
  quest_3_type: string | null;
  quest_4: string | null;
  quest_4_type: string | null;
  tasks_quest: string;
  estimated_minutes: number;
}

export async function getWeek(week: number): Promise<WeekRow | null> {
  const { rows } = await pool.query<WeekRow>(
    `select week, week_arc, weekly_outcome, speaking_mission, primary_language_support
     from weeks where persona = $1 and level = $2 and week = $3`,
    [PERSONA, LEVEL, week],
  );
  return rows[0] ?? null;
}

export async function getDaysForWeek(week: number): Promise<DayRow[]> {
  const { rows } = await pool.query<DayRow>(
    `select week, day, week_arc, weekly_outcome, daily_mini_outcome, activity_mix, revision, quest_count,
            quest_1, quest_1_type, quest_2, quest_2_type, quest_3, quest_3_type, quest_4, quest_4_type,
            tasks_quest, estimated_minutes
     from days where persona = $1 and level = $2 and week = $3
     order by day`,
    [PERSONA, LEVEL, week],
  );
  return rows;
}

export async function getDay(week: number, day: number): Promise<DayRow | null> {
  const { rows } = await pool.query<DayRow>(
    `select week, day, week_arc, weekly_outcome, daily_mini_outcome, activity_mix, revision, quest_count,
            quest_1, quest_1_type, quest_2, quest_2_type, quest_3, quest_3_type, quest_4, quest_4_type,
            tasks_quest, estimated_minutes
     from days where persona = $1 and level = $2 and week = $3 and day = $4`,
    [PERSONA, LEVEL, week, day],
  );
  return rows[0] ?? null;
}
