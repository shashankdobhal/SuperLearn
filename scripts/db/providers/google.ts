import type { TranslateProvider } from './types';

/**
 * Google Cloud Translation API v2 (https://cloud.google.com/translate/docs/reference/rest/v2/translate).
 * Needs GOOGLE_TRANSLATE_API_KEY — a Cloud Translation API key from a Google
 * Cloud project with the Cloud Translation API enabled and billing set up.
 * Not free at real volume; check current pricing before running this over
 * the whole curriculum.
 */
export function makeGoogleProvider(apiKey: string): TranslateProvider {
  return {
    name: 'google',
    async translate(text, targetLocale, sourceLocale) {
      const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: sourceLocale, target: targetLocale, format: 'text' }),
      });
      if (!res.ok) {
        throw new Error(`Google Translate API error ${res.status}: ${await res.text()}`);
      }
      const data = (await res.json()) as { data: { translations: { translatedText: string }[] } };
      return data.data.translations[0].translatedText;
    },
  };
}

/**
 * Bhashini (Government of India / AI4Bharat, https://bhashini.gov.in) is
 * worth trying for Indian-language quality/cost, but its API is a two-step
 * ULCA pipeline (fetch a model/pipeline config, then call its inference
 * endpoint) rather than a single REST call, and needs a registered
 * Bhashini API key. Not implemented here — add a `makeBhashiniProvider`
 * alongside this one, matching the same TranslateProvider shape, once you
 * have credentials to test against.
 */
