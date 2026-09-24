/**
 * Design tokens sourced from ZealMint's Atlas design system (see
 * "Atlas project design.md" §4-9, §19) — colors, typography, spacing,
 * radius, elevation, and motion only. Atlas's component specs (§20),
 * layout system (§21), mobile guidelines (§22), and product language
 * (§17) are written for ZealMint's industrial-operations product and
 * don't apply here — Supernova keeps its own component structure and
 * language, just restyled with Atlas's visual tokens.
 *
 * Atlas is documented light-mode only. `dark` below is derived (not
 * spec'd) — same hues, same "orange is the only interactive-affordance
 * color" rule, same semantic meanings, adjusted for dark-background
 * contrast.
 */
import { Platform } from 'react-native';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  cardBorder: string;
  graphite: string;
  muted: string;
  textMuted: string;
  hairline: string;

  brandOrange: string;
  brandOrangeHover: string;
  brandOrangeActive: string;
  brandOrangeMuted: string;

  healthy: string;
  healthyMuted: string;
  attention: string;
  attentionMuted: string;
  critical: string;
  criticalMuted: string;
  semanticTrack: string;
}

// --- Atlas §19 color tokens, verbatim ---
const light: ThemeColors = {
  background: '#FAFAFB',
  surface: '#F6F7F8',
  card: '#FFFFFF',
  cardBorder: 'rgba(66,87,138,0.12)',
  graphite: '#17191F',
  muted: '#69707D',
  textMuted: '#9AA0AC',
  hairline: 'rgba(66,87,138,0.12)',

  brandOrange: '#F25C2A',
  brandOrangeHover: '#D94F20',
  brandOrangeActive: '#BF441B',
  brandOrangeMuted: 'rgba(242,92,42,0.12)',

  healthy: '#1E7F5C',
  healthyMuted: 'rgba(30,127,92,0.12)',
  attention: '#E2A33D',
  attentionMuted: 'rgba(226,163,61,0.14)',
  critical: '#C94B3F',
  criticalMuted: 'rgba(201,75,63,0.12)',
  semanticTrack: '#E7E7E3',
};

// --- Derived dark variant — same hues/meanings, adjusted for contrast on
// a dark background. Not part of the Atlas spec (light-mode only). ---
const dark: ThemeColors = {
  background: '#111318',
  surface: '#181A21',
  card: '#1C1F27',
  cardBorder: 'rgba(255,255,255,0.08)',
  graphite: '#F2F3F5',
  muted: '#9BA1AE',
  textMuted: '#6B7280',
  hairline: 'rgba(255,255,255,0.08)',

  brandOrange: '#F25C2A',
  brandOrangeHover: '#FF7043',
  brandOrangeActive: '#D94F20',
  brandOrangeMuted: 'rgba(242,92,42,0.18)',

  // Lightened ~15-20% from the Atlas values so they hold contrast on a
  // dark surface — same hue family, still recognizable as the same
  // healthy/attention/critical meaning.
  healthy: '#3DDC97',
  healthyMuted: 'rgba(61,220,151,0.16)',
  attention: '#F0BB5E',
  attentionMuted: 'rgba(240,187,94,0.16)',
  critical: '#E37066',
  criticalMuted: 'rgba(227,112,102,0.16)',
  semanticTrack: '#2A2D36',
};

export const themes = { light, dark };
export type ThemeMode = 'light' | 'dark';

// --- Atlas §19 typography tokens ---
export const Typography = {
  fontFamily: Platform.select({ web: 'Inter, -apple-system, sans-serif', default: 'Inter_400Regular' }),
  fontFamilyMedium: Platform.select({ web: 'Inter, -apple-system, sans-serif', default: 'Inter_500Medium' }),
  display: { fontSize: 28, fontWeight: '500' as const, lineHeight: 34 },
  heading: { fontSize: 18, fontWeight: '500' as const, lineHeight: 23 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '500' as const, lineHeight: 17 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 17 },
};

// --- Atlas §19 spacing scale ---
export const Space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

// --- Atlas §19 radius scale (+ `pill` for badges/pill buttons, an
// addition of Supernova's own — Atlas doesn't define one) ---
export const Radii = { sm: 6, md: 10, lg: 12, xl: 20, pill: 999 } as const;

// --- Atlas §19 motion durations ---
export const Motion = { fast: 100, base: 130, slow: 150 } as const;

// --- Atlas §8/§19 elevation, translated to RN's shadow* + Android
// `elevation` + web `boxShadow` (RN Web passes extra style props through) ---
export const Elevation = {
  flat: {},
  hairline: (color: string) => ({ borderWidth: 1, borderColor: color }),
  soft: {
    shadowColor: '#17191F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  hover: {
    shadowColor: '#17191F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  modal: {
    shadowColor: '#17191F',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 12,
  },
} as const;
