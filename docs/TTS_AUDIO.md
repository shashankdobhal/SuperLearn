# Lesson audio (text-to-speech)

How the app plays lesson text aloud, and why it's not a live TTS call.

## The shape of the problem

The curriculum is fixed content — the same finite set of English/Hindi
sentences, played to every learner. That means we don't need a live TTS
server calling a model per request (what a chatbot-style tutor would need):
**generate each sentence's audio once, store it as a static file, and every
learner just plays that file.** Near-zero ongoing cost at any number of
users, versus paying for inference on every playback.

This is why the pipeline is a batch script, not a server:

- **`scripts/tts/dump_manifest.ts`** walks every authored lesson file
  (`src/content/lessons/**`) and collects the exact `(language, text)` pairs
  the app ever passes to a "read aloud" button — `IntroCard`'s intro line,
  `RuleCard`'s example, `McqCard`'s prompt, `audioTextEn` listening lines,
  and `SpeakCard`'s prompt. Writes `scripts/tts/manifest.json` (gitignored,
  regenerated on demand).
- **`scripts/tts/generate_audio.py`** synthesizes each manifest entry with
  [Kokoro](https://github.com/hexgrad/kokoro-onnx) (Apache-2.0, self-hosted,
  no API key, no per-character cost) and writes one MP3 into
  `server/public/audio/<hash>.mp3`. Idempotent — skips any hash that already
  has a file, so re-running after adding new lesson content only generates
  the new lines.
- **`server/index.ts`** serves `server/public/audio/` as static files at
  `/audio/*` — no TTS logic in the request path at all.
- **`src/lib/audio/ttsAudio.ts`**'s `playAudio(text, language)` computes the
  same hash, checks whether that file exists, and plays it via `expo-audio`
  if so. If it doesn't (not generated yet, or the API server is
  unreachable), it falls back to on-device TTS
  (`src/lib/audio/nativeSpeech.ts`, `expo-speech`) — never a dead button.

## The hash

Both sides need to agree on a filename for the same `(language, text)` pair
without ever talking to each other: `src/lib/audio/hash.ts`'s `audioFileHash`
(FNV-1a 32-bit over the UTF-8 bytes of `` `${lang}::${text}` ``) is
reimplemented byte-for-byte in `generate_audio.py`. If the two ever
disagree, every lookup 404s and the app silently falls back to on-device
speech (not a crash, but silently worse audio) — `generate_audio.py`
recomputes the hash itself before writing each file and hard-fails if it
doesn't match what the manifest says, so a hash-algorithm drift is caught at
generation time, not discovered later as a mysteriously-missing file.

## Choosing Kokoro

Two open-source options were considered:

- **OS/browser built-in TTS** (`expo-speech` alone) — free, zero setup, but
  quality and language coverage depend entirely on what's installed on the
  user's device. On this dev machine, the Hindi voice (`Lekha`, macOS)
  reported successful playback events but produced no audible sound — the
  voice's sound data isn't actually downloaded, a real per-device failure
  mode with no app-side fix.
- **Kokoro-82M** — a small (82M parameter) open-source neural TTS model with
  real trained voices for both English and Hindi (`lang_code='h'`, e.g.
  `hf_alpha`), runs on CPU (no GPU required, ~1-3s per short lesson line on
  this machine), self-hosted with no ongoing API cost. This is what
  `generate_audio.py` uses.

Not chosen: [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) /
Docker (the shape [freelingo](https://github.com/ArtCC/freelingo) uses) —
that's a *live* server, which we don't need for fixed content, and this
machine has no Docker installed. Calling the `kokoro` Python package
directly in a batch script gets the same model with less moving parts.

**Known limitation:** Kokoro's Hindi phonemization routes through
`espeak-ng` (a generic rule-based phonemizer, bundled via the pip-installed
`espeakng-loader` — no system package needed), not a dedicated Hindi
frontend the way English gets. The acoustic voice itself is still a real
Hindi-trained neural voice, but pronunciation nuance may be a notch behind
the English voice's. If Hindi quality specifically becomes a blocker later,
that's the component to revisit.

## Setup (one-time)

Needs Python 3.10+ (not the system `python3`, which may be older):

```bash
python3.12 -m venv .venv-tts
source .venv-tts/bin/activate
pip install -r scripts/tts/requirements.txt --index-url https://download.pytorch.org/whl/cpu --extra-index-url https://pypi.org/simple
```

The `--index-url` fetches the CPU-only `torch` wheel (much smaller, no CUDA)
with the `--extra-index-url` fallback for the other, non-torch packages.

## Regenerating audio

```bash
npx tsx scripts/tts/dump_manifest.ts        # 1. re-scan lesson content
source .venv-tts/bin/activate
python3 scripts/tts/generate_audio.py        # 2. synthesize any new lines
```

The first run downloads the Kokoro-82M model (~330MB, cached by
`huggingface_hub` afterward). Run this after authoring new lesson days —
`npm run server` picks up new files immediately since it's just static
serving, no restart needed.

## What's not done yet

- Only Weeks 1-4's content has been batch-generated. Re-run the two
  commands above after authoring Weeks 5-50.
- No CDN/object storage — files are served straight from the local API
  server's disk, fine for local dev, not for a production deployment at
  scale (though still just static-file hosting, not compute).
- No cache-busting if a lesson's text is edited without changing the
  `(language, text)` — since the hash is content-addressed, an edited
  sentence gets a *new* hash automatically, but the *old* audio file is
  never cleaned up. Not a bug (harmless orphaned file), just unswept.
