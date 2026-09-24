import { readFileSync, existsSync } from 'fs';
import path from 'path';

const REPO = path.join(__dirname, '..', '..');

function loadGroqKey(): string {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  const envPath = path.join(REPO, '.env.groq');
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, 'utf-8')
      .split('\n')
      .find((l) => l.startsWith('GROQ_API_KEY='));
    if (line) return line.slice('GROQ_API_KEY='.length).trim();
  }
  throw new Error('GROQ_API_KEY not set and .env.groq not found — see docs/CONTENT_GENERATION.md');
}

// Groq's free tier caps each MODEL at 200,000 tokens/DAY (not just per
// minute) — gpt-oss-120b's daily budget got fully consumed generating
// Weeks 5-7 ("Used 196841" of 200000 in one observed 429). gpt-oss-20b
// (separate daily bucket) was tried as a workaround but failed outright —
// every single request 400'd with "Failed to validate JSON. Please adjust
// your prompt" (code json_validate_failed) — the smaller model can't
// reliably follow response_format:json_object for a prompt this complex at
// all, not just lower quality. Back to 120b; see docs/CONTENT_GENERATION.md
// for the real constraint this leaves us with (roughly one week's worth of
// days per calendar day, bounded by the slow daily-quota refill rate).
const MODEL = 'openai/gpt-oss-120b';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Groq's 429 body names the exact wait time, but the format varies by
 * magnitude — "36.645s" for a short wait, "1m57.9s" or "30m59.3s" once
 * hours/minutes are involved. A regex anchored on a bare "([\d.]+)s" alone
 * silently matches only the trailing seconds component and drops the
 * minutes — misparsing "30m59.328s" as ~59s instead of ~31 minutes, which
 * looks like "it's rate limited but recovering fast" when it absolutely is
 * not. Parse all present h/m/s components. */
function parseRetryAfterSeconds(message: string): number {
  const match = message.match(/try again in (?:(\d+)h)?(?:(\d+)m)?(?:([\d.]+)s)?/);
  if (!match) return 20;
  const [, h, m, s] = match;
  const seconds = (Number(h ?? 0) * 3600) + (Number(m ?? 0) * 60) + Number(s ?? 0);
  return seconds > 0 ? Math.ceil(seconds) : 20;
}

/** True for Groq's "tokens per day (TPD)" rate-limit message specifically
 * — distinct from the per-minute (TPM) limit. A TPD exhaustion doesn't
 * recover on the timescale a single script invocation should sit around
 * waiting for (real minutes-to-hours, refilling continuously rather than
 * resetting at a fixed instant — see docs/CONTENT_GENERATION.md) — so this
 * is surfaced as a distinct, fast-failing error instead of retried in a
 * loop, letting the caller (generate_days.ts) log it and move on rather
 * than block for an unpredictable, potentially very long stretch. */
export class DailyQuotaExceededError extends Error {
  constructor(public waitSeconds: number, rawMessage: string) {
    super(rawMessage);
  }
}

/** Calls Groq's (OpenAI-compatible) chat completions endpoint, asking for a
 * raw JSON object back. Retries a *per-minute* 429 by waiting the exact
 * time Groq reports (a single one of our prompts can use ~90% of the
 * 8000-tokens/minute budget on its own, so this is expected and recovers
 * within a request or two). A *per-day* 429 throws DailyQuotaExceededError
 * immediately instead of looping — see that class's docs. Throws a plain
 * Error for any other non-429 API error, which generate_days.ts's caller
 * treats as a content problem (and retries with a corrective prompt). */
export async function callGroqForJson(prompt: string): Promise<unknown> {
  for (let rateLimitRetries = 0; rateLimitRetries < 6; rateLimitRetries++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loadGroqKey()}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (res.status === 429) {
      const body = await res.text();
      const waitSeconds = parseRetryAfterSeconds(body);
      if (body.includes('tokens per day') || body.includes('(TPD)')) {
        throw new DailyQuotaExceededError(waitSeconds, body.slice(0, 500));
      }
      console.log(`  (rate limited, waiting ${waitSeconds}s...)`);
      await sleep((waitSeconds + 1) * 1000);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Groq API error ${res.status}: ${body.slice(0, 500)}`);
    }

    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error('Groq response had no message content');
    try {
      return JSON.parse(content);
    } catch (err) {
      throw new Error(`Groq returned unparseable JSON: ${(err as Error).message}\n---\n${content.slice(0, 1000)}`);
    }
  }
  throw new Error('Groq per-minute rate limit: exceeded 6 retries — unexpected, per-minute limits should clear within 1-2 retries');
}
