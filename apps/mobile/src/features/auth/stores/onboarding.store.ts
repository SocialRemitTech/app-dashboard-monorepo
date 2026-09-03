// apps/mobile/src/features/auth/stores/onboarding.store.ts
import { create } from 'zustand';
import type { AuthTokens } from '@sr/api-contract';

/**
 * Transient onboarding state. Held in memory only for the duration of sign-up.
 * The PIN lives here just long enough to confirm it, then is sent to the backend and cleared —
 * it is NEVER written to secure storage in plaintext (see security architecture §3.8).
 */
interface OnboardingState {
  countryCode: string;
  country: string;
  phone: string;
  referral: string; // optional invite code captured on sign-up
  pinDraft: string; // first PIN entry, compared against confirm
  tokens: AuthTokens | null; // captured at OTP verify, applied at flow end
  preferredName: string;
  greeting: string;
  set: (partial: Partial<OnboardingState>) => void;
  reset: () => void;
}

const initial = {
  countryCode: '+44',
  country: 'United Kingdom',
  phone: '',
  referral: '',
  pinDraft: '',
  tokens: null,
  preferredName: '',
  greeting: '',
};

export const useOnboarding = create<OnboardingState>((set) => ({
  ...initial,
  set: (partial) => set(partial),
  reset: () => set(initial),
}));
