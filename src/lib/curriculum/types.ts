// Shape of content/curriculum/**/*.json — see docs/CURRICULUM_DATA.md.
// These are the source-of-truth curriculum records; don't hand-edit the JSON,
// regenerate it from the source workbook instead.

export type QuestType =
  | 'learn'
  | 'translation'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'practice'
  | 'speaking'
  | 'conversation'
  | 'review'
  | 'mission'
  | 'mixed';

export interface WeekRecord {
  week: number;
  week_arc: string;
  weekly_outcome: string;
  speaking_mission: string;
  primary_language_support: string;
}

export interface DayRecord {
  week: number;
  week_arc: string;
  weekly_outcome: string;
  day: number;
  daily_mini_outcome: string;
  activity_mix: string;
  revision: 'Yes' | 'No';
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
  repeat_track: string;
  primary_skills: string;
  grammar_language_focus: string;
  vocabulary_context: string;
  speaking_evidence: string;
  estimated_minutes: number;
}

export interface SkillRecord {
  skill_id: string;
  skill: string;
  role: string;
  introduced_week: number;
  suggested_prerequisite_relationship: string;
}

export interface QuestTypeRecord {
  quest_type: string;
  purpose: string;
  typical_task_count: string;
  example_task_mix: string;
  speaking_role: string;
  repeat_track_behaviour: string;
}
