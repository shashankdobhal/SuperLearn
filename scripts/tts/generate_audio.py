"""Batch-generates self-hosted Kokoro TTS audio for every (lang, text) entry
in manifest.json (see dump_manifest.ts), writing one MP3 per entry into
server/public/audio/, named by the same FNV-1a hash the client computes
(src/lib/audio/hash.ts) to build its playback URL — see docs/TTS_AUDIO.md.

This is a one-time/occasional batch job, not a live server: the app never
calls Kokoro directly, it just plays whatever static file this script wrote.
Idempotent — skips any hash that already has a file, so re-running after
adding new lesson content only generates the new lines.

Usage:
    source .venv-tts/bin/activate  # see docs/TTS_AUDIO.md for setup
    python3 scripts/tts/generate_audio.py
"""
import json
import os
import subprocess
import sys

import soundfile as sf
from kokoro import KPipeline

REPO = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
MANIFEST_PATH = os.path.join(REPO, "scripts", "tts", "manifest.json")
OUT_DIR = os.path.join(REPO, "server", "public", "audio")

# lang -> (Kokoro lang_code, voice). Voices are Kokoro-82M's own bundled
# speakers, not tied to whatever the OS happens to have installed.
VOICE_BY_LANG = {
    "en": ("a", "af_heart"),
    "hi": ("h", "hf_alpha"),
}


def fnv1a(lang: str, text: str) -> str:
    """Must match src/lib/audio/hash.ts exactly — see that file's docstring."""
    data = f"{lang}::{text}".encode("utf-8")
    h = 0x811C9DC5
    for byte in data:
        h ^= byte
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def main():
    with open(MANIFEST_PATH) as f:
        manifest = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)

    pipelines = {}
    generated = 0
    skipped = 0
    for entry in manifest:
        lang, text, hash_ = entry["lang"], entry["text"], entry["hash"]
        computed = fnv1a(lang, text)
        if computed != hash_:
            print(f"FAIL: hash mismatch for {lang!r} {text[:40]!r} — TS said {hash_}, Python computed {computed}")
            sys.exit(1)

        out_path = os.path.join(OUT_DIR, f"{hash_}.mp3")
        if os.path.exists(out_path):
            skipped += 1
            continue

        if lang not in pipelines:
            lang_code, _ = VOICE_BY_LANG[lang]
            pipelines[lang] = KPipeline(lang_code=lang_code, repo_id="hexgrad/Kokoro-82M")
        pipeline = pipelines[lang]
        _, voice = VOICE_BY_LANG[lang]

        wav_path = out_path + ".tmp.wav"
        for _, _, audio in pipeline(text, voice=voice):
            sf.write(wav_path, audio, 24000)
            break  # one chunk per short lesson line; long texts would need concatenation
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path, "-codec:a", "libmp3lame", "-qscale:a", "4", out_path],
            check=True,
        )
        os.remove(wav_path)
        generated += 1
        print(f"[{generated + skipped}/{len(manifest)}] generated {lang} {hash_}.mp3: {text[:60]!r}")

    print(f"\nDone. Generated {generated}, skipped {skipped} already-existing, total {len(manifest)}.")


if __name__ == "__main__":
    main()
