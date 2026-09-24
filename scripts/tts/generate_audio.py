"""Batch-generates lesson audio for every (lang, text) entry in
manifest.json (see dump_manifest.ts) using AI4Bharat's Indic Parler-TTS —
real Indian-accented English + native Hindi in one model — writing one MP3
per entry into server/public/audio/, named by the same FNV-1a hash the
client computes (src/lib/audio/hash.ts) to build its playback URL — see
docs/TTS_AUDIO.md.

This is a one-time/occasional batch job, not a live server: the app never
calls this model directly, it just plays whatever static file this script
wrote. Idempotent — skips any hash that already has a file, so re-running
after adding new lesson content only generates the new lines. Delete
server/public/audio/*.mp3 first if you want to force a full regeneration
(e.g. after changing a description/speaker below).

Setup: ai4bharat/indic-parler-tts is a gated model — see docs/TTS_AUDIO.md
for accepting the gate and creating a Hugging Face token in .env.tts.

Usage:
    source .venv-tts/bin/activate
    python3 scripts/tts/generate_audio.py
"""
import json
import os
import subprocess
import sys

import soundfile as sf
import torch
from huggingface_hub import login
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer

REPO = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
MANIFEST_PATH = os.path.join(REPO, "scripts", "tts", "manifest.json")
OUT_DIR = os.path.join(REPO, "server", "public", "audio")
MODEL_ID = "ai4bharat/indic-parler-tts"

# Speaker + description per language — named speakers per the model card's
# "using a specific speaker" table. Mary/Thoma are the model's recommended
# English speakers and specifically produce an Indian English accent (not
# American/British, which is what every other open TTS option defaults to).
DESCRIPTION_BY_LANG = {
    "en": "Mary speaks in a clear Indian English accent, at a natural, moderate pace, with a warm and friendly tone. The recording is very high quality with no background noise.",
    "hi": "Divya speaks in a clear, natural tone at a moderate pace, with a warm and friendly delivery. The recording is very high quality with no background noise.",
}


def fnv1a(lang: str, text: str) -> str:
    """Must match src/lib/audio/hash.ts exactly — see that file's docstring."""
    data = f"{lang}::{text}".encode("utf-8")
    h = 0x811C9DC5
    for byte in data:
        h ^= byte
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def load_hf_token():
    """Reads HF_TOKEN from .env.tts (gitignored) if not already in the
    environment — see docs/TTS_AUDIO.md for how that file gets created."""
    if os.environ.get("HF_TOKEN"):
        return
    env_path = os.path.join(REPO, ".env.tts")
    if not os.path.exists(env_path):
        return
    with open(env_path) as f:
        for line in f:
            if line.startswith("HF_TOKEN="):
                os.environ["HF_TOKEN"] = line.strip().split("=", 1)[1]
                return


def main():
    load_hf_token()
    if os.environ.get("HF_TOKEN"):
        login(token=os.environ["HF_TOKEN"])

    with open(MANIFEST_PATH) as f:
        manifest = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)

    print("Loading Indic Parler-TTS (first run downloads ~3.6GB)...")
    model = ParlerTTSForConditionalGeneration.from_pretrained(MODEL_ID).to("cpu")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)

    # The description (voice/style) is identical for every line in a given
    # language, so encode it once per language instead of on every entry.
    description_ids_by_lang = {
        lang: description_tokenizer(desc, return_tensors="pt").input_ids
        for lang, desc in DESCRIPTION_BY_LANG.items()
    }

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

        prompt_ids = tokenizer(text, return_tensors="pt").input_ids
        with torch.no_grad():
            generation = model.generate(input_ids=description_ids_by_lang[lang], prompt_input_ids=prompt_ids)
        audio = generation.cpu().numpy().squeeze()

        wav_path = out_path + ".tmp.wav"
        sf.write(wav_path, audio, model.config.sampling_rate)
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
