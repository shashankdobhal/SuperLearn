import { getDay } from './curriculum';
import { pool } from './db';

interface ContentItemRow {
  id: string;
  quest_index: number;
  task_index: number;
  task_type: 'intro' | 'rule' | 'mcq' | 'build' | 'speak';
  skill_id: string;
  payload: Record<string, unknown>;
}

interface TranslationRow {
  content_item_id: string;
  locale: string;
  fields: Record<string, string>;
}

/**
 * Rebuilds the exact DayLesson/LearnFlowStep/SpeakStep shape the app
 * already renders (see src/lib/curriculum/lesson-types.ts), from DB rows.
 * Deliberately keeps both 'hi' and 'en' text where the source data has them
 * (matching today's in-lesson language toggle) rather than resolving to one
 * locale — supporting more than hi/en in the *UI* is a separate follow-up
 * (see docs/CONTENT_DATABASE.md).
 */
export async function getDayLesson(week: number, day: number) {
  const dayMeta = await getDay(week, day);
  if (!dayMeta) return null;

  const { rows: items } = await pool.query<ContentItemRow>(
    `select id, quest_index, task_index, task_type, skill_id, payload
     from content_items
     where week = $1 and day = $2
     order by quest_index, task_index`,
    [week, day],
  );
  if (items.length === 0) return null;

  const { rows: translations } = await pool.query<TranslationRow>(
    `select content_item_id, locale, fields
     from content_translations
     where content_item_id = any($1)`,
    [items.map((i) => i.id)],
  );
  const fieldsFor = (itemId: string, locale: string) => translations.find((t) => t.content_item_id === itemId && t.locale === locale)?.fields;

  const toStep = (item: ContentItemRow) => {
    const hi = fieldsFor(item.id, 'hi');
    const en = fieldsFor(item.id, 'en');
    const p = item.payload;
    switch (item.task_type) {
      case 'intro':
        return {
          type: 'intro',
          id: item.id,
          quest: item.quest_index,
          emoji: p.emoji,
          textHi: hi?.text ?? '',
          textEn: en?.text ?? '',
          audioTextEn: p.audioTextEn ?? undefined,
        };
      case 'rule':
        return {
          type: 'rule',
          id: item.id,
          quest: item.quest_index,
          pattern: p.pattern,
          example: p.example,
          textHi: hi?.text ?? '',
        };
      case 'mcq':
        return {
          type: 'mcq',
          id: item.id,
          quest: item.quest_index,
          isPopQuiz: p.isPopQuiz ?? false,
          options: p.options,
          hint: p.hint ?? undefined,
          promptHi: hi?.prompt ?? '',
          promptEn: en?.prompt ?? '',
          explanationHi: hi?.explanation ?? '',
          explanationEn: en?.explanation ?? '',
          audioTextEn: p.audioTextEn ?? undefined,
        };
      case 'build':
        return {
          type: 'build',
          id: item.id,
          quest: item.quest_index,
          promptHi: hi?.prompt ?? '',
          answer: p.answer,
          distractors: p.distractors ?? undefined,
          hint: p.hint,
          audioTextEn: p.audioTextEn ?? undefined,
        };
      case 'speak':
        return {
          id: item.id,
          promptEn: en?.prompt ?? '',
          promptHi: hi?.prompt ?? '',
          hint: p.hint ?? undefined,
          isFinal: p.isFinal ?? false,
        };
    }
  };

  const learnFlow = items.filter((i) => i.task_type !== 'speak').map(toStep);
  const speakFlow = items.filter((i) => i.task_type === 'speak').map(toStep);

  return {
    week,
    day,
    skillId: items[0].skill_id,
    weeklyOutcome: dayMeta.weekly_outcome,
    dailyOutcome: dayMeta.daily_mini_outcome,
    learnFlow,
    speakFlow,
  };
}

export async function getAvailableDays(week: number): Promise<number[]> {
  const { rows } = await pool.query<{ day: number }>(
    `select distinct day from content_items where week = $1 order by day`,
    [week],
  );
  return rows.map((r) => r.day);
}
