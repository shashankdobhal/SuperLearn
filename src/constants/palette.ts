/**
 * Supernova's fixed dark, "gamified" brand palette — not adaptive to system
 * light/dark mode. Distinct from constants/theme.ts, which belongs to the
 * Expo template's light/dark-adaptive demo screens.
 */
export const Colors = {
  bg: '#0A0B14',
  bgElevated: '#12142380',
  bgCard: '#171933',
  bgCardAlt: '#1C1E3A',
  cardBorder: 'rgba(255,255,255,0.08)',

  primary: '#7B61FF',
  primaryDark: '#5A3FD9',
  primaryMuted: 'rgba(123,97,255,0.16)',

  success: '#34D399',
  successMuted: 'rgba(52,211,153,0.14)',

  warning: '#F5A623',
  warningMuted: 'rgba(245,166,35,0.14)',

  danger: '#F45B69',
  dangerMuted: 'rgba(244,91,105,0.14)',

  text: '#FFFFFF',
  textSecondary: '#A6A8C1',
  textMuted: '#6B6E85',

  trackBg: '#23253F',

  pillBg: '#1E2038',
  pillBorder: 'rgba(255,255,255,0.10)',
} as const;

export const Radii = { sm: 8, md: 14, lg: 20, pill: 999 } as const;

export const Space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
