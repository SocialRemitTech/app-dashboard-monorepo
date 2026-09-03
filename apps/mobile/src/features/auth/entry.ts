// apps/mobile/src/features/auth/entry.ts
/**
 * Unauthenticated entry route — used by the launch gate and the logout redirect. Flip ENTRY
 * to switch onboarding experiments.
 */
const ROUTES = {
  welcome: '/(auth)/welcome', // full-bleed photo + coral wordmark + Create/Log in (current direction)
  launch: '/(auth)/launch', // cream splash → morphs into Create your account
  intro: '/intro', // animated intro carousel
  welcome2: '/(auth)/welcome2', // rotating-hero welcome
} as const;

export type Entry = keyof typeof ROUTES;
export const ENTRY: Entry = 'welcome';
export const entryHref = ROUTES[ENTRY];
