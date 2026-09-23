-- Multi-language content layer for Supernova.
--
-- Scope: this migration covers LESSON TASK content only — the intro/rule/
-- mcq/build/speak steps that make up a day's lessons — split into
-- content_items (language-invariant) + content_translations (per locale), so
-- adding a new support language is "translate + insert rows," not a code
-- change or an app rebuild.
--
-- NOT covered here (left as static JSON for now — see docs/CONTENT_DATABASE.md
-- for why): weeks.json / days.json (curriculum blueprint: which quests exist,
-- in what order — structural, changes rarely), skills.json is mirrored below
-- only because content_items references it as a foreign key.
--
-- English is not special-cased: it is stored as locale='en' in
-- content_translations like any other support language, because for task
-- types where the app shows an English *instructional* line (intro/mcq/speak
-- prompts), that line is itself translatable copy, not the target-language
-- content being taught. The target-language content the learner is being
-- taught (patterns, examples, MCQ options, correct answers) never changes
-- per locale, so it lives in content_items.payload instead.

create extension if not exists pgcrypto;

create table if not exists skills (
  skill_id text primary key,
  label text not null,
  role text not null,
  introduced_week integer not null,
  prerequisite_note text
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  week integer not null,
  day integer not null,
  quest_index integer not null,        -- 1-based, matches days.json's quest_N ordering
  task_index integer not null,         -- 0-based position within that quest
  task_type text not null check (task_type in ('intro', 'rule', 'mcq', 'build', 'speak')),
  skill_id text references skills (skill_id),
  payload jsonb not null,              -- invariant target-language content; shape depends on task_type
  created_at timestamptz not null default now(),
  unique (week, day, quest_index, task_index)
);

create table if not exists content_translations (
  content_item_id uuid not null references content_items (id) on delete cascade,
  locale text not null,                -- 'en', 'hi', 'ta', 'te', ... (BCP-47-ish, lowercase)
  fields jsonb not null,               -- translatable strings; shape depends on task_type
  source text not null default 'human' check (source in ('human', 'machine', 'machine_reviewed')),
  updated_at timestamptz not null default now(),
  primary key (content_item_id, locale)
);

create index if not exists content_items_week_day_idx on content_items (week, day);
create index if not exists content_translations_locale_idx on content_translations (locale);

comment on table content_items is
  'One row per learn/speak task. payload holds the English target-language content (never translated).';
comment on table content_translations is
  'One row per (content_item, locale). fields holds the translatable instructional copy for that locale.';
comment on column content_translations.source is
  'human = authored directly; machine = MT output, unreviewed; machine_reviewed = MT output a human has checked.';
