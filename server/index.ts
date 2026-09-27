import cors from 'cors';
import express from 'express';
import path from 'path';

import { getDaysForWeek, getWeek } from './curriculum';
import { getAvailableDays, getDayLesson, getWeeksWithContent } from './lessons';
import { getNovaReply, getNovaReport, type NovaTurn } from './nova';
import { gradeSpokenAnswer } from './speakGrading';

const app = express();
app.use(cors());
app.use(express.json());

// Pre-generated TTS audio (see docs/TTS_AUDIO.md / scripts/tts/) — static
// files, not a live TTS call. Missing files 404 and the client falls back
// to on-device speech synthesis (src/lib/audio/ttsAudio.ts).
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

const PORT = Number(process.env.PORT ?? 4000);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/lessons/available', async (req, res) => {
  const week = Number(req.query.week);
  if (!Number.isFinite(week)) {
    res.status(400).json({ error: 'week query param is required' });
    return;
  }
  const days = await getAvailableDays(week);
  res.json({ week, days });
});

app.get('/api/lessons/:week/:day', async (req, res) => {
  const week = Number(req.params.week);
  const day = Number(req.params.day);
  const lesson = await getDayLesson(week, day);
  if (!lesson) {
    res.status(404).json({ error: 'not_authored' });
    return;
  }
  res.json(lesson);
});

app.get('/api/curriculum/weeks/:week', async (req, res) => {
  const week = Number(req.params.week);
  const weekRow = await getWeek(week);
  if (!weekRow) {
    res.status(404).json({ error: 'week_not_found' });
    return;
  }
  res.json(weekRow);
});

app.get('/api/curriculum/weeks/:week/days', async (req, res) => {
  const week = Number(req.params.week);
  const days = await getDaysForWeek(week);
  res.json({ week, days });
});

// Every week that has authored content so far, each with its days + which
// are actually playable — lets the Home screen keep appending newly
// generated weeks to the path automatically (see docs/CONTENT_GENERATION.md)
// without the client needing to guess how many weeks exist.
app.get('/api/curriculum/roadmap', async (_req, res) => {
  const weekNumbers = await getWeeksWithContent();
  const weeks = [];
  for (const week of weekNumbers) {
    const weekRow = await getWeek(week);
    if (!weekRow) continue;
    const [days, availableDays] = await Promise.all([getDaysForWeek(week), getAvailableDays(week)]);
    weeks.push({ ...weekRow, days, availableDays });
  }
  res.json({ weeks });
});

// Grades a SpeakCard answer's transcript for grammar/relevance/correctness
// (see server/speakGrading.ts — this is the transcript-level half of
// "vetting what someone spoke"; pronunciation/fluency would need the raw
// audio and a different, purpose-built API). Falls back to a 503 on any
// Groq failure — the client already has a local heuristic
// (src/lib/audio/wordMatch.ts) to fall back to, so this never blocks the
// lesson on Groq being unavailable.
app.post('/api/speak/grade', async (req, res) => {
  const { transcript, promptEn, hint } = req.body ?? {};
  if (typeof transcript !== 'string' || typeof promptEn !== 'string') {
    res.status(400).json({ error: 'transcript and promptEn (strings) are required' });
    return;
  }
  try {
    const result = await gradeSpokenAnswer({ transcript, promptEn, hint });
    res.json(result);
  } catch (err) {
    console.error('speak grading failed:', err);
    res.status(503).json({ error: 'grading_unavailable' });
  }
});

function parseHistory(body: unknown): NovaTurn[] | null {
  const history = (body as { history?: unknown } | null)?.history;
  if (!Array.isArray(history)) return null;
  if (!history.every((t) => t && (t.role === 'nova' || t.role === 'user') && typeof t.text === 'string')) return null;
  return history as NovaTurn[];
}

// Free-form Nova AI conversation (Nova AI tab) — see server/nova.ts. Falls
// back to a 503 on any Groq failure; the client has a canned line to keep
// the conversation moving rather than dead-ending on it.
app.post('/api/nova/reply', async (req, res) => {
  const history = parseHistory(req.body);
  if (!history) {
    res.status(400).json({ error: 'history (array of {role, text}) is required' });
    return;
  }
  try {
    res.json(await getNovaReply(history));
  } catch (err) {
    console.error('nova reply failed:', err);
    res.status(503).json({ error: 'nova_unavailable' });
  }
});

// Grades a whole finished conversation session at once (see server/nova.ts).
app.post('/api/nova/report', async (req, res) => {
  const history = parseHistory(req.body);
  if (!history) {
    res.status(400).json({ error: 'history (array of {role, text}) is required' });
    return;
  }
  try {
    res.json(await getNovaReport(history));
  } catch (err) {
    console.error('nova report failed:', err);
    res.status(503).json({ error: 'report_unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`Supernova API listening on http://localhost:${PORT}`);
});
