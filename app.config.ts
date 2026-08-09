// apps/mobile/app.config.ts
import type { ExpoConfig } from 'expo/config';

/**
 * Social Remit — Expo config (SDK 56).
 * Splash is configured via the expo-splash-screen PLUGIN now, not a top-level `splash` field.
 * Only packages with a real config plugin belong in `plugins`.
 * NOTE: changing slug/scheme/bundle identifiers or splash/icon takes effect on the next
 * `expo prebuild --clean` (native regen) — not on a JS reload.
 */
const config: ExpoConfig = {
  name: 'Social Remit',
  slug: 'social-remit',
  scheme: 'socialremit',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  ios: { supportsTablet: false, bundleIdentifier: 'com.socialremit.app' },
  android: { package: 'com.socialremit.app' },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-local-authentication',
    'expo-notifications',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/icon.png',
        resizeMode: 'contain',
        backgroundColor: '#FEF6EE', // brand splash background (spec)
      },
    ],
    ['expo-build-properties', { ios: { deploymentTarget: '16.4' } }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    environment: process.env.ENVIRONMENT ?? 'development',
    sentryDsn: process.env.SENTRY_DSN,
  },
};

export default config;
