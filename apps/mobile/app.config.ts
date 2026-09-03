// apps/mobile/app.config.ts
import type { ExpoConfig } from 'expo/config';

/**
 * Social Remit — Expo config (SDK 56).
 * Splash is configured via the expo-splash-screen PLUGIN, not a top-level `splash` field.
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
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/d8578f9d-7ab9-44f4-8e06-349b37636934',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.socialremit.app',
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: 'com.socialremit.app',
    adaptiveIcon: {
      foregroundImage: './assets/logo-mark.png',
      backgroundColor: '#FF5A2A',
    },
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-local-authentication',
    'expo-notifications',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/logo-mark-cream.png',
        backgroundColor: '#FF5A2A',
        imageWidth: 160,
        resizeMode: 'contain',
        dark: {
          image: './assets/logo-mark-cream.png',
          backgroundColor: '#FF5A2A',
        },
      },
    ],
    ['expo-build-properties', { ios: { deploymentTarget: '16.4' } }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    environment: process.env.ENVIRONMENT ?? 'development',
    sentryDsn: process.env.SENTRY_DSN,
    eas: {
      projectId: 'd8578f9d-7ab9-44f4-8e06-349b37636934',
    },
  },
};

export default config;
