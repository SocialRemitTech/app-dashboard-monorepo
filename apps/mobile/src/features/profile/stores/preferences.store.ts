// apps/mobile/src/features/profile/stores/preferences.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/shared/platform/storage';

interface PreferencesState {
  email?: string | undefined;
  emailPromptDismissed: boolean;
  setEmail: (email: string) => void;
  dismissEmailPrompt: () => void;
}

/** Controls the "add email" prompt: once an email is saved OR the prompt is dismissed, it won't show again. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      email: undefined,
      emailPromptDismissed: false,
      setEmail: (email) => set({ email, emailPromptDismissed: true }),
      dismissEmailPrompt: () => set({ emailPromptDismissed: true }),
    }),
    { name: 'sr-preferences', storage: persistStorage },
  ),
);
