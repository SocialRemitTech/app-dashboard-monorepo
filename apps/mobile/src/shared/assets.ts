// apps/mobile/src/shared/assets.ts
/**
 * Central asset registry.
 *
 * Metro resolves images by STATICALLY analysing require() calls, so the path must be a
 * plain relative literal — aliases like `@/../assets/x.jpg` are not reliably resolved and
 * were causing "Unable to resolve @/../assets/". Keeping every require in one file means
 * there is a single place to fix if the folder ever moves.
 *
 * Path is relative to this file: src/shared -> src -> apps/mobile -> assets
 */
export const images = {
  // Home
  promoZeroFees: require('../../assets/family9.png'),

  // Onboarding / welcome
  welcomePhoto: require('../../assets/family1.png'),

  // Brand
  waveCream: require('../../assets/wave-cream.png'),
  logoLockupCoral: require('../../assets/logo-mark-cream.png'),
} as const;

/** Intro carousel slides, in order. */
export const introSlides = [
  require('../../assets/intro/slide1.png'),
  require('../../assets/intro/slide2.png'),
  require('../../assets/intro/slide3.png'),
];

/** Flag art by corridor code. Only codes with bundled art belong here. */
export const flags = {
  gb: require('../../assets/flags/gb.png'),
  gh: require('../../assets/flags/gh.png'),
  ng: require('../../assets/flags/ng.png'),
  ke: require('../../assets/flags/ke.png'),
  in: require('../../assets/flags/in.png'),
} as const;

export type FlagCode = keyof typeof flags;
