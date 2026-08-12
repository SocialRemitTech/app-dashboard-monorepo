// packages/design-tokens/src/index.ts
/**
 * Social Remit design tokens — the single source of truth for the brand.
 * Encodes the brand spec (colours, type, radius, shadow, motion).
 * Consumed by NativeWind (via tailwind-preset) and directly by RN primitives.
 * Change a value here → it propagates to every screen and (later) the web dashboards.
 *
 * THE ONE RULE (spec §5): coral is the ACTION colour only. Never use it for
 * error / warning / success — each state has its own token below. This is why
 * `danger`, `warning`, and `success` are separate names: so coral can't be reached
 * for by habit on a state.
 */

export const color = {
  // ── Brand ───────────────────────────────────────────────
  coral: {
    DEFAULT: '#FF5A2A', // brand primary — CTAs, active states, focused borders
    pressed: '#E8511F', // held/pressed
    light: '#FFB399', // active OTP/input border tint
    softer: '#FFC0AA', // focused PIN/amount border tint
  },
  navy: {
    DEFAULT: '#12233B', // body text on cream
    deep: '#1B365D', // form/flow headings
  },

  // ── Surfaces ────────────────────────────────────────────
  cream: '#FEFBF5', // authenticated screen background
  splash: '#FEF6EE', // splash/loading background
  white: '#FFFFFF', // cards, inputs, modals

  // ── Neutrals / text ─────────────────────────────────────
  grey: {
    mid: '#6B7280', // secondary labels, "View all"
    light: '#9CA3AF', // placeholders, inactive tab icons
  },

  // ── Lines ───────────────────────────────────────────────
  border: {
    DEFAULT: '#E5E5E5', // input borders at rest
    form: '#E5E7EB', // form borders in card/KYC screens
    divider: '#F3F4F6', // row separators, section dividers
  },

  // ── Semantic states (NEVER coral — spec §5) ─────────────
  success: {
    DEFAULT: '#2E9E6F', // "Delivered" status
    transfer: '#5F9F62', // transfer-tracking timeline complete
    wallet: '#16A34A', // wallet top-up, "Free" fee label
  },
  processing: '#F59E0B', // "Processing" status / warning
  warning: '#FFC107', // security-pause / notice accent
  failed: '#E5533D', // "Failed" status text
  error: '#D64545', // form validation, OTP error
} as const;

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// Corner radii per spec §4.
export const radius = {
  input: 12, // OTP/PIN cells, inputs
  button: 15, // primary/secondary CTAs (14–16)
  card: 20, // cards / summary panels (16–24)
  sheet: 24, // modal / bottom sheet top corners (20–28)
  pill: 999, // status pills, filter tags, avatars, badges
} as const;

export const typography = {
  // Sora = display/headings. Inter = everything else. Do not add other fonts (spec §2).
  fontFamily: { display: 'Sora', sans: 'Inter' },
  size: {
    caption: 12,
    label: 14,
    body: 15,
    base: 16,
    lg: 18,
    h2: 24,
    h1: 30,
    balance: 40,
  },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
} as const;

// Coral-tinted shadows for active CTAs; neutral for cards (spec §4).
export const shadow = {
  ctaActive: {
    shadowColor: '#FF5A2A',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  sheet: {
    shadowColor: '#12233B',
    shadowOpacity: 0.13,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
} as const;

export const motion = {
  duration: { fast: 150, base: 250, slow: 400 },
} as const;

export const tokens = { color, space, radius, typography, shadow, motion } as const;
export type Tokens = typeof tokens;
