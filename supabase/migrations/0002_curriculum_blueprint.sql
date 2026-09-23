-- The curriculum *blueprint* — the 50-week map, 350-day curriculum, quest
-- type library, speaking rubric and design rules parsed from the source
-- workbook (docs/sources/*.xlsx) into content/curriculum/**/*.json. This is
-- distinct from 0001's content_items/content_translations (the actual
-- authored task content inside a quest) — see docs/CONTENT_DATABASE.md.
--
-- weeks/days/speaking_rubric carry persona+level because the product design
-- (docs/CURRICULUM_PHILOSOPHY.md §5) is 7 personas x 3 levels x 50 weeks —
-- only 'everyday-confidence'/'beginner' has data today, but the column
-- avoids a schema change when track #2 shows up. skills and quest_types are
-- deliberately NOT persona/level-scoped: the whole point of the competency
-- graph and the quest-type library is that they're shared across personas.

create table if not exists weeks (
  persona text not null,
  level text not null,
  week integer not null,
  week_arc text not null,
  weekly_outcome text not null,
  speaking_mission text not null,
  primary_language_support text not null,
  primary key (persona, level, week)
);

create table if not exists days (
  persona text not null,
  level text not null,
  week integer not null,
  day integer not null,
  week_arc text not null,
  weekly_outcome text not null,
  daily_mini_outcome text not null,
  activity_mix text not null,
  revision boolean not null default false,
  quest_count integer not null,
  quest_1 text,
  quest_1_type text,
  quest_2 text,
  quest_2_type text,
  quest_3 text,
  quest_3_type text,
  quest_4 text,
  quest_4_type text,
  tasks_quest text not null,
  repeat_track text not null,
  primary_skills text not null,
  grammar_language_focus text not null,
  vocabulary_context text not null,
  speaking_evidence text not null,
  estimated_minutes integer not null,
  primary key (persona, level, week, day),
  foreign key (persona, level, week) references weeks (persona, level, week)
);

create table if not exists quest_types (
  quest_type text primary key,
  purpose text not null,
  typical_task_count text not null,
  example_task_mix text not null,
  speaking_role text not null,
  repeat_track_behaviour text not null
);

create table if not exists speaking_rubric (
  persona text not null,
  level text not null,
  dimension text not null,
  what_supernova_evaluates text not null,
  target_description text not null,
  primary key (persona, level, dimension)
);

create table if not exists design_rules (
  id serial primary key,
  rule text not null unique,
  specification text not null
);

create index if not exists days_week_idx on days (persona, level, week);
