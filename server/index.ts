import cors from 'cors';
import express from 'express';

import { getAvailableDays, getDayLesson } from './lessons';

const app = express();
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Supernova API listening on http://localhost:${PORT}`);
});
