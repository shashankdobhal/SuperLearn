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
  [Indic Parler-TTS](https://huggingface.co/ai4bharat/indic-parler-tts)
  (Apache-2.0, self-hosted, no API key beyond a one-time gate, no
  per-character cost) and writes one MP3 into
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

## Choosing the TTS engine

Three options were tried, in order, each rejected/replaced for a concrete
reason:

1. **OS/browser built-in TTS** (`expo-speech` alone) — free, zero setup, but
   quality and language coverage depend entirely on what's installed on the
   user's device. On the original dev machine, the Hindi voice (`Lekha`,
   macOS) reported successful playback events but produced no audible sound
   — the voice's sound data isn't actually downloaded, a real per-device
   failure mode with no app-side fix. Still used as the fallback for any
   line that hasn't been batch-generated.
2. **Kokoro-82M** — a small, fast, fully free open-source neural TTS model.
   Fixed the silent-Hindi bug (self-hosted, not device-dependent) but two
   problems remained: sounded synthetic ("robotic") to a real listener, and
   its only English voices are American/British — no Indian-English option
   at all, which matters for a curriculum meant to sound relatable to
   Indian learners.
3. **Indic Parler-TTS** (`ai4bharat/indic-parler-tts`, Apache-2.0, AI4Bharat
   / IIT Madras) — what's actually used now. Trained specifically for
   Indian languages, including English spoken with an Indian accent — its
   English voices (`Mary`/`Thoma`) are the first option here that isn't
   American- or British-accented, and it has native Hindi voices
   (`Rohit`/`Divya`) in the same model rather than routing Hindi through a
   generic phonemizer the way Kokoro does. Confirmed by listening to actual
   generated samples before committing to the switch.

**Tradeoff accepted:** Indic Parler-TTS is ~0.9B parameters vs Kokoro's 82M
— an order of magnitude slower to generate and a multi-GB download, versus
Kokoro's few-minutes/one-download footprint. Acceptable here because
generation is a one-time batch job, not a per-request cost — the ongoing
cost is identical (zero) either way.

**Not chosen:** a live TTS server (e.g.
[Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) via Docker, the
shape [freelingo](https://github.com/ArtCC/freelingo) runs) — we don't need
one for fixed content, and calling the Python packages directly in a batch
script gets the same models with less moving parts and no Docker
dependency.

## Setup (one-time)

Needs Python 3.10+ (not the system `python3`, which may be older), and a
Hugging Face account since `ai4bharat/indic-parler-tts` is a gated
repository (free, instant on accepting the gate — not a manual review):

1. Log into [huggingface.co](https://huggingface.co), visit
   [huggingface.co/ai4bharat/indic-parler-tts](https://huggingface.co/ai4bharat/indic-parler-tts),
   and accept the access gate on that page.
2. Create a **Read** access token at
   [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
3. Save it locally (gitignored via `.env.*`, never commit this):
   ```
   # .env.tts
   HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
   ```
4. Set up the Python environment:
   ```bash
   python3.12 -m venv .venv-tts
   source .venv-tts/bin/activate
   pip install -r scripts/tts/requirements.txt --index-url https://download.pytorch.org/whl/cpu --extra-index-url https://pypi.org/simple
   ```
   The `--index-url` fetches the CPU-only `torch` wheel (much smaller, no
   CUDA) with the `--extra-index-url` fallback for the other packages
   (including `parler-tts`, installed straight from its GitHub repo since
   it isn't on PyPI).

## Regenerating audio

```bash
npx tsx scripts/tts/dump_manifest.ts        # 1. re-scan lesson content
source .venv-tts/bin/activate
python3 scripts/tts/generate_audio.py        # 2. synthesize any new lines
```

`generate_audio.py` reads `.env.tts` itself, so no need to `source` it
separately. The first run downloads the model (~3.6GB, cached by
`huggingface_hub` afterward) — expect real per-line generation time on CPU
(seconds, not milliseconds, per short lesson line) given the model's size;
this is fine since it's a background batch job, not something a user waits
on. Run this after authoring new lesson days — `npm run server` picks up
new files immediately since it's just static serving, no restart needed.

To force a full regeneration (e.g. after changing a speaker/description in
`generate_audio.py`), delete `server/public/audio/*.mp3` first — the script
only fills in missing hashes, it never overwrites existing files.

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
