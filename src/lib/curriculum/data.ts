import skillsData from '@content/curriculum/everyday-confidence/beginner/skills.json';

import type { SkillRecord } from './types';

// weeks/days now live in Postgres and are fetched via src/lib/api/curriculum.ts
// (see docs/CONTENT_DATABASE.md) — no longer bundled into the app as JSON.
// skills.json stays static for now: it's small, stable, and only used for a
// label lookup (getSkill), not per-track content worth a DB round trip yet.
export const skills = skillsData as SkillRecord[];

export function getSkill(skillId: string): SkillRecord | undefined {
  return skills.find((s) => s.skill_id === skillId);
}
