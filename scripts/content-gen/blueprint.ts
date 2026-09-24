import { readFileSync } from 'fs';
import path from 'path';

const CURRICULUM_DIR = path.join(__dirname, '..', '..', 'content', 'curriculum', 'everyday-confidence', 'beginner');

export interface BlueprintDay {
  week: number;
  week_arc: string;
  weekly_outcome: string;
  day: number;
  daily_mini_outcome: string;
  activity_mix: string;
  revision: string;
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
  repeat_track: string;
  primary_skills: string;
  grammar_language_focus: string;
  vocabulary_context: string;
  speaking_evidence: string;
  estimated_minutes: number;
}

export interface Skill {
  skill_id: string;
  skill: string;
  role: string;
  introduced_week: number;
  suggested_prerequisite_relationship: string;
}

export interface QuestType {
  quest_type: string;
  purpose: string;
  typical_task_count: string;
  example_task_mix: string;
  speaking_role: string;
  repeat_track_behaviour: string;
}

export interface DesignRule {
  rule: string;
  specification: string;
}

function load<T>(filename: string): T {
  return JSON.parse(readFileSync(path.join(CURRICULUM_DIR, filename), 'utf-8'));
}

export function loadDays(): BlueprintDay[] {
  return load<BlueprintDay[]>('days.json');
}

export function loadSkills(): Skill[] {
  return load<Skill[]>('skills.json');
}

export function loadQuestTypes(): QuestType[] {
  return load<QuestType[]>('quest-types.json');
}

export function loadDesignRules(): DesignRule[] {
  return load<DesignRule[]>('design-rules.json');
}

/** The skill_id introduced in a given week — every day in a week shares the
 * same skill (see days.json's primary_skills, constant across a week's 7
 * days). Weeks with no newly-introduced skill (review weeks etc.) return
 * undefined; callers should skip generation for those rather than guess. */
export function skillForWeek(skills: Skill[], week: number): Skill | undefined {
  return skills.find((s) => s.introduced_week === week);
}

export function questTypesForDay(day: BlueprintDay): string[] {
  return [day.quest_1_type, day.quest_2_type, day.quest_3_type, day.quest_4_type]
    .slice(0, day.quest_count)
    .filter((t): t is string => !!t);
}
