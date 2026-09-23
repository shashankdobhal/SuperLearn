/**
 * FNV-1a 32-bit hash over the exact UTF-8 bytes of `lang::text`. Deterministic
 * and dependency-free (no `Buffer`, so it runs the same on web/iOS/Android),
 * used to name pre-generated TTS audio files (see docs/TTS_AUDIO.md):
 * `scripts/tts/generate_audio.py` computes this same hash (a manual
 * reimplementation, since that side is Python) to name each file it writes,
 * and this client-side copy computes it to build the URL to fetch. If the
 * two ever disagree, every lookup 404s, so the algorithm must not change
 * without updating both copies together — verified to match via
 * scripts/tts/verify_hash_parity.py.
 */
function utf8Bytes(text: string): number[] {
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    }
  }
  return bytes;
}

export function audioFileHash(lang: string, text: string): string {
  const bytes = utf8Bytes(`${lang}::${text}`);
  let h = 0x811c9dc5;
  for (const byte of bytes) {
    h ^= byte;
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
