# SuperLearn — Master Curriculum & Product Instructions

This is the persistent product/curriculum brief for SuperLearn. Any AI session or
contributor generating curriculum content, designing data models, or building
learner-facing flows should read this first and stay aligned with it.

## 1. Project Context

SuperLearn is a **speaking-first** English learning product for Hindi and other
Indian-language speakers. It is **not** a conventional grammar course.

Primary objective: **help learners become capable, confident speakers of English.**
Grammar, vocabulary, listening, reading, writing and translation are supporting
mechanisms for spoken-English outcomes.

The learner should continuously feel: *"I can say more in English than I could before."*

## 2. Core Product Philosophy

`Learn → Practice → Speak → Converse → Become confident using English.`

Emphasis order (not a strict pedagogical ranking — a product priority):

1. Speaking
2. Conversation
3. Listening
4. Useful language / vocabulary
5. Grammar
6. Translation
7. Reading
8. Writing

**Do NOT** turn SuperLearn into a grammar syllabus, a vocabulary-memorization app,
a translation app, a reading course, or a writing course. Those exist only to
support spoken English.

## 3. The Curriculum Hierarchy

```
PERSONA / GOAL
    ↓
PROFICIENCY LEVEL
    ↓
50-WEEK JOURNEY
    ↓
WEEKLY SPEAKING OUTCOME
    ↓
7 DAILY MINI-OUTCOMES
    ↓
1–4 DAILY QUESTS
    ↓
5–8 TASKS PER QUEST
    ↓
LEARN / TRANSLATE / LISTEN / READ / WRITE / SPEAK / CONVERSE
    ↓
ASSESSMENT
    ↓
MASTERY
    ↓
REVIEW / ADAPTATION
```

Do not collapse this into a simpler `Course → Lesson → Question` model.

## 4. Personas / Goal Journeys

Seven initial goal personas: Everyday Confidence, Family & Social, Travel Abroad,
Higher Studies, Job Interview, Work & Career, Business & Entrepreneurship.

These are **goal journeys, not separate languages**. The same underlying
competencies are reusable across personas — only context, vocabulary, scenario
and complexity change per persona. Example: `ask_for_help_politely` is one
skill; "ask hotel staff for help" (Travel) and "ask a professor for
clarification" (Higher Studies) are persona-contextualized instances of it.

**Never duplicate a competency just because it appears in another persona.**

## 5. Proficiency Levels

Each persona has Beginner / Intermediate / Advanced, 50 weeks each.

`7 personas × 3 levels × 50 weeks = 21 course tracks`, sharing one underlying
competency graph, grammar graph, vocabulary graph, content repository and
assessment framework — persona only supplies context.

## 6. Beginner 50-Week Arc Structure (10-week arcs)

- **Weeks 1–10 — Me & My World**: self, home, family, friends, routine,
  interests, feelings, preferences, wants, needs.
- **Weeks 11–20 — Everyday Interaction**: start conversations, ask/answer
  questions, small talk, clarification, offering/asking for help,
  agree/disagree, simple advice, maintaining conversation.
- **Weeks 21–30 — Getting Things Done**: directions, transport, hotels,
  ordering food, shopping, appointments, describing problems, explaining what
  happened, experiences, simple decisions.
- **Weeks 31–40 — Opinions & Everyday Expression**: opinions, comparisons,
  advice, health, weather, hobbies, describing people/places, memories,
  preferences.
- **Weeks 41–50 — Conversation & Confidence**: small talk, phone/chat English,
  solving small problems, goals, change, sustained conversation, unexpected
  questions, personal stories, spontaneous communication.

The first three weeks must feel like real spoken progress, not grammar labels
(never "Week 1 = Pronouns"):

1. **Introduce Yourself** → outcome: give a 60-second self-introduction.
2. **Talk About Your Life** → outcome: talk about your life for 1–2 minutes.
3. **Have a Basic Conversation** → outcome: have a basic conversation with Nova.

## 7. Weekly Outcome

Every week has exactly **one** Weekly Speaking Outcome answering: *"What can
the learner actually DO in spoken English by the end of this week?"*

Good: "Explain what happened yesterday." / "Ask for help politely."
Bad: "Learn Past Simple." / "Learn 20 vocabulary words."

## 8. Seven Daily Mini-Outcomes

Every week has 7 daily mini-outcomes that progress toward the weekly outcome
(smaller capability → contributes to the bigger one). The seven days should
feel like a progression, not seven unrelated exercises.

## 9. Daily Experience Must Be Mixed

Do not assign one modality per day (e.g. Mon=Grammar, Tue=Translation).
Each day mixes 1–4 of: Learn, Translate, Listen, Read, Write, Speak, Converse.
Some days are light (1–2 modes), others heavier (3–4 modes).

## 10. Speaking Must Appear Frequently

Because SuperLearn is speaking-first, most days include **Speak and/or
Converse**. Occasional lighter input/review days are fine, but speaking stays
central:

```
Understand → Practice → Speak → Interact → Speak spontaneously
```

## 11. Activity Types (core primitives)

- **Learn** — a rule, useful phrases, vocabulary, a sentence pattern,
  pronunciation. Short and directly tied to the day's speaking objective.
- **Translate** — support-language → English, immediately followed by saying
  it aloud. A bridge to speaking, never the destination.
- **Listen** — identify / choose / respond / repeat / retell natural spoken
  English, supporting comprehension and speaking.
- **Read** — short dialogues/messages/passages that generally lead to spoken
  production.
- **Write** — supporting practice only (construct/complete/write a sentence),
  ideally followed by "say it aloud."
- **Speak** — scaffolding decreases over time:
  `Repeat → Guided → Semi-guided → Prompted → Independent → Extempore`.
- **Converse** — dynamic interaction with Nova: roleplay, follow-ups,
  unexpected questions, clarification, disagreement, scenarios, free talk.

## 12. Quests

The primary user-facing daily unit. **1–4 quests/day**:

- Light day: 1 quest, ~5 min.
- Normal day: 2 quests, ~10–15 min.
- Heavy day: 3–4 quests, ~20–30 min.

Adapt workload to the learner; don't force every day to be heavy.

## 13. Quest Size & Types

Each quest normally has **5–8 tasks** and **one primary purpose**. Use a
reusable quest-type library: Learn, Translation, Listening, Reading, Writing,
Practice, Speaking, Conversation, Review, Mission, Mixed. Don't force every
quest to touch every modality.

## 14. Repeat Track

Core mechanic. On a wrong/weak answer:

```
Task → Wrong/weak → Identify underlying skill → Generate a parallel item
  → Retry → Evaluate again
```

Never just re-show the exact same question — generate a different scenario
that tests the same underlying skill (e.g. "Can you help me?" translation →
retry as "You're at a hotel, ask the receptionist for help," both testing
`ask_for_help_politely`).

## 15. Spaced Repetition

Suggested initial checkpoints: Day 1, 2, 4, 7, 14, 30 — adaptive, based on
correctness, speaking performance, confidence, attempts, recency, difficulty,
prior failures. Reviews should favor active retrieval / speaking over passive
recognition.

## 16. Revision Days

First-class, can be very light: retrieve a handful of older skills, then use
them again in a short conversation. The adaptive engine decides what actually
needs revisiting — not a full replay of the week.

## 17. Grammar Philosophy

Grammar supports speaking; it is not the curriculum spine. Introduce
just-in-time: identify the speaking objective first (e.g. "talk about future
plans"), then teach only the structure that unlocks it (`will + verb`),
followed by examples → translation → controlled practice → speaking →
conversation.

A structured grammar graph still exists underneath (be, have, pronouns, basic
sentence structure, present simple, negatives, questions, question words,
articles, plurals, prepositions, frequency, can/could, should, past simple,
future forms, comparatives, basic connectors, basic present-perfect exposure
for Beginner) — but it's mapped to competencies
(`describe_daily_routine supports present_simple, frequency, time_expressions`),
never "Week 4 = Present Simple."

## 18. Competency Graph

One of the most important parts of the system. Skills are reusable across
personas and can have prerequisites, e.g.
`ask_for_help_politely → ask_for_help → basic_question_formation`.
The competency graph ultimately determines readiness to progress. See
`content/curriculum/everyday-confidence/beginner/skills.json` for the
Beginner/Everyday-Confidence skill map (source data).

## 19. Mastery ≠ Completion

Each skill has an internal mastery score, tracked **separately** per
dimension (speaking, listening, grammar, vocabulary, pronunciation, fluency,
interaction):

```
0–39   Not learned
40–59  Introduced
60–74  Developing
75–89  Proficient
90–100 Mastered
```

Internal product heuristics, not official CEFR bands. A learner's overall
level should never hide dimension-level differences (e.g. Grammar 78 /
Speaking 61).

## 20. Speaking Assessment Dimensions

Fluency, Grammar, Vocabulary, Pronunciation, Comprehensibility, Interaction,
Spontaneity. See
`content/curriculum/everyday-confidence/beginner/speaking-rubric.json` for
Beginner target descriptors per dimension.

## 21. Support Language

Learner picks a support language (Hindi, Bengali, Tamil, Telugu, Marathi,
Gujarati, Punjabi, Kannada, Malayalam, Urdu, …) used for explanations,
translations, hints and grammar notes. **The output target is always
English.** One English curriculum + a localization/support layer — never a
separate curriculum per support language.

## 22. Persona-Specific Content

When generating persona variants of a skill, change context, vocabulary,
scenarios, roleplays, examples and mission — never the underlying skill ID.

## 23. Content Data Model (conceptual)

```
PERSONAS → COURSE_TRACKS → COURSE_WEEKS → DAILY_OUTCOMES → QUESTS → QUEST_TASKS → CONTENT_ITEMS

SKILLS → SKILL_PREREQUISITES → GRAMMAR_CONCEPTS → VOCABULARY

LEARNER → LEARNER_GOALS → LEARNER_SKILL_MASTERY → QUEST_ATTEMPTS → TASK_ATTEMPTS
  → SPEAKING_ASSESSMENTS → REVIEW_ITEMS
```

Content items are reusable — a single content item (e.g. "Could you help me?")
can link to multiple skills, quests, personas and activity types. Don't
duplicate content unnecessarily.

## 24. Don't Hard-Code Curriculum Into the UI

The UI renders curriculum data (`Course Track → Week → Day → Quests → Tasks →
Content`). Never branch the app on `if week == 1 { ... }`. This is what lets
SuperLearn later add personas, levels, languages, revised curriculum,
AI-generated variants and adaptive sequencing without rewriting the app.

## 25. Daily Experience (what the learner sees)

Internally a deep hierarchy; externally, something light:

```
Today
🗣️ Ask for clarification — 5 min
💬 Practice with Nova — 7 min
2 quests · ~12 min
```

The 50-week curriculum is largely invisible — the learner experiences
"today," SuperLearn manages long-term progression underneath.

## 26. Adaptive Learning

The system dynamically decides which quest to show, how many, which
questions, which skills need review, when to introduce grammar, when to
reduce scaffolding, when to increase difficulty, when to repeat a skill, when
the learner is ready to progress. **The curriculum spine stays stable —
adaptation changes the route and support, not the fundamental progression.**

## 27. The Product Invariant

- Every **week** answers: "What can this learner now say or do in spoken
  English that they could not comfortably do before?"
- Every **day** answers: "What smaller speaking capability are we building
  today?"
- Every **quest** answers: "What specific skill is this quest helping the
  learner practice?"
- Every **task** answers: "What evidence do we get about the learner's
  ability?"

## 28. Content-Generation Rules

When creating curriculum content, always provide: weekly outcome, daily
outcome, quest purpose, task types, skill being developed, grammar support
where relevant, vocabulary support where relevant, the speaking component, and
assessment criteria.

Avoid: isolated grammar chapters, vocabulary lists with no communication
purpose, repetitive MCQ-heavy lessons, excessive written exercises,
translation without eventual speaking, identical questions repeated in the
retry track, overly long daily sessions, arbitrary difficulty increases.

## 29. Process for Designing a New Week

1. Define the weekly speaking outcome.
2. Define required competencies/skills.
3. Identify prerequisite skills.
4. Define the 7 daily mini-outcomes.
5. Decide which language components are needed (grammar, vocabulary,
   pronunciation, listening, etc.).
6. Design 1–4 quests per day.
7. Give each quest 5–8 tasks.
8. Define the speaking evidence.
9. Define likely failure modes.
10. Define repeat-track behavior.
11. Define spaced-repetition candidates.

## 30. Optimization Priorities

When choosing between two curriculum designs, prefer the one that: produces
more actual speaking; gives a clear real-world communication outcome; reduces
unnecessary cognitive load; uses grammar in context; uses translation as a
bridge, not a destination; creates opportunities for spontaneous speech;
allows lightweight daily experiences; provides measurable mastery evidence;
reuses competencies across personas; maintains long-term progression.

## 31. The SuperLearn Learning Loop

```
I understand it.
    ↓
I can construct it.
    ↓
I can say it with help.
    ↓
I can say it independently.
    ↓
I can use it in conversation.
    ↓
I can use it spontaneously.
    ↓
I can use it confidently in real life.
```

The learner doesn't study English to complete lessons — they complete
activities so they can use English.

---

## Source of truth for Everyday Confidence → Beginner

`content/curriculum/everyday-confidence/beginner/` (parsed from
`SuperLearn_Everyday_Confidence_Beginner_50_Weeks.xlsx`) is the **initial
curriculum reference and source of truth** for that specific track: the
50-week map, 350 daily outcomes, quest blueprint, skill map, speaking rubric
and design rules it contains.

**Do not silently redesign this curriculum.** If a change is proposed (a
different weekly outcome, a reordered skill, a different quest mix, etc.),
say explicitly that it is a *proposed improvement*, distinct from the existing
curriculum — never present a deviation as if it were already the agreed
curriculum.
