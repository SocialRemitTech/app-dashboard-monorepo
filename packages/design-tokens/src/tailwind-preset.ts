// packages/design-tokens/src/tailwind-preset.ts
import { color, space, radius } from './index';

/** NativeWind/Tailwind preset generated from tokens — class names and tokens stay in lockstep. */
export const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        coral: color.coral,
        navy: color.navy,
        cream: color.cream,
        splash: color.splash,
        white: color.white,
        grey: color.grey,
        border: color.border,
        success: color.success,
        processing: color.processing,
        warning: color.warning,
        failed: color.failed,
        error: color.error,
      },
      spacing: Object.fromEntries(Object.entries(space).map(([k, v]) => [k, `${v}px`])),
      borderRadius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, `${v}px`])),
      // Sora (display) + Inter (body) per spec §2. Weight-specific families = the actual loaded fonts.
      fontFamily: {
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-semibold': ['Inter_600SemiBold'],
        'sans-bold': ['Inter_700Bold'],
        display: ['Sora_600SemiBold'],
        'display-bold': ['Sora_700Bold'],
      },
    },
  },
};
