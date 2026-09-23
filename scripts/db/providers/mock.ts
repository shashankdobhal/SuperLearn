import type { TranslateProvider } from './types';

/**
 * Demonstrates the pipeline shape without calling a real API or needing a
 * key. Output is deliberately, visibly NOT a real translation — it's a
 * fixture so you can prove the fetch → translate → insert round-trip works
 * end to end. Swap in `google` (or a `bhashini` provider you add the same
 * way) for actual translations.
 */
export const mockProvider: TranslateProvider = {
  name: 'mock',
  async translate(text, targetLocale) {
    return `⟦mock:${targetLocale}⟧ ${text}`;
  },
};
