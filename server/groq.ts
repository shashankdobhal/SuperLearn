import { existsSync, readFileSync } from 'fs';
import path from 'path';

const REPO = path.join(__dirname, '..');

// Mirrors scripts/content-gen/callGroq.ts's loader (same .env.groq file,
// same env var) — kept as its own small copy rather than a shared import
// because this is a different runtime entry point (a live API request,
// not a batch script) with different failure handling below: a live
// request needs to fail fast and let the caller fall back, not retry for
// minutes the way the batch pipeline reasonably does.
function loadGroqKey(): string {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  const envPath = path.join(REPO, '.env.groq');
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, 'utf-8')
      .split('\n')
      .find((l) => l.startsWith('GROQ_API_KEY='));
    if (line) return line.slice('GROQ_API_KEY='.length).trim();
  }
  throw new Error('GROQ_API_KEY not set and .env.groq not found');
}

const MODEL = 'openai/gpt-oss-120b';

/**
 * Calls Groq for a single JSON completion, for use in a live request path
 * (speak-answer grading — see server/speakGrading.ts). Deliberately simple
 * compared to scripts/content-gen/callGroq.ts: one retry on a per-minute
 * 429 with a short capped wait, then gives up — a user waiting on feedback
 * shouldn't sit through Groq's real rate-limit backoff, and the caller
 * already has a graceful local fallback (see speakGrading.ts) for exactly
 * this case.
 */
export async function callGroqForJsonFast(prompt: string, options?: { timeoutMs?: number; temperature?: number }): Promise<unknown> {
  const timeoutMs = options?.timeoutMs ?? 8000;
  // Grading (speakGrading.ts, Nova's end-of-session report) wants low
  // temperature — consistent, conservative judgments. Nova's live replies
  // (server/nova.ts) pass a higher one — a beginner-safe but genuinely
  // varied conversation partner, not the same few "How was your day?"
  // phrasings every time.
  const temperature = options?.temperature ?? 0.3;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loadGroqKey()}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (res.status === 429 && attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Groq API error ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error('Groq response had no message content');
    return JSON.parse(content);
  }
  throw new Error('Groq rate-limited twice in a row');
}
