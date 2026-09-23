import daysData from '@content/curriculum/everyday-confidence/beginner/days.json';
import questTypesData from '@content/curriculum/everyday-confidence/beginner/quest-types.json';
import skillsData from '@content/curriculum/everyday-confidence/beginner/skills.json';
import weeksData from '@content/curriculum/everyday-confidence/beginner/weeks.json';

import type { DayRecord, QuestTypeRecord, SkillRecord, WeekRecord } from './types';

// Everyday Confidence → Beginner is the only authored track today. When more
// personas/levels exist, this becomes a lookup keyed by persona+level instead
// of a single hardcoded import.
export const weeks = weeksData as WeekRecord[];
export const days = daysData as DayRecord[];
export const skills = skillsData as SkillRecord[];
export const questTypes = questTypesData as QuestTypeRecord[];

export function getWeek(week: number): WeekRecord | undefined {
  return weeks.find((w) => w.week === week);
}

export function getDay(week: number, day: number): DayRecord | undefined {
  return days.find((d) => d.week === week && d.day === day);
}

export function getDaysForWeek(week: number): DayRecord[] {
  return days.filter((d) => d.week === week).sort((a, b) => a.day - b.day);
}

export function getSkill(skillId: string): SkillRecord | undefined {
  return skills.find((s) => s.skill_id === skillId);
}

/** `days.json.primary_skills` is free text, occasionally comma-separated. */
export function parseSkillIds(primarySkills: string): string[] {
  return primarySkills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
