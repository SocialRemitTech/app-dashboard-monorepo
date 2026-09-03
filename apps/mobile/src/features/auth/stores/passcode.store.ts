// apps/mobile/src/features/auth/stores/passcode.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/shared/platform/storage';

export const PIN_LENGTH = 5;
export const MAX_ATTEMPTS = 5;
export const WARN_FROM_ATTEMPT = 3;
export const LOCK_MINUTES = 30;

interface PasscodeState {
  code: string;
  failedAttempts: number;
  lockedUntil: number | null;
  verify: (input: string) => boolean;
  registerFailure: () => { attempts: number; locked: boolean };
  clearFailures: () => void;
  setCode: (code: string) => void;
}

/**
 * Attempt state is persisted so a force-quit can't bypass the lockout.
 *
 * NOTE: there is deliberately no `isLocked()` action. A getter that writes state (clearing
 * an expired lock while being read) causes render/navigation loops — screens read
 * `lockedUntil` directly via the pure helpers below and call `clearFailures()` explicitly.
 */
export const usePasscode = create<PasscodeState>()(
  persist(
    (set, get) => ({
      code: '12345',
      failedAttempts: 0,
      lockedUntil: null,

      verify: (input) => input === get().code,

      registerFailure: () => {
        const attempts = get().failedAttempts + 1;
        const locked = attempts >= MAX_ATTEMPTS;
        set({
          failedAttempts: attempts,
          lockedUntil: locked ? Date.now() + LOCK_MINUTES * 60_000 : get().lockedUntil,
        });
        return { attempts, locked };
      },

      clearFailures: () => set({ failedAttempts: 0, lockedUntil: null }),
      setCode: (code) => set({ code, failedAttempts: 0, lockedUntil: null }),
    }),
    { name: 'sr-passcode', storage: persistStorage },
  ),
);

/* ---- pure helpers (no state writes) ---- */
export const isLockActive = (lockedUntil: number | null) =>
  !!lockedUntil && Date.now() < lockedUntil;
export const secondsLeft = (lockedUntil: number | null) =>
  lockedUntil ? Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)) : 0;
export const attemptsLeft = (attempts: number) => Math.max(0, MAX_ATTEMPTS - attempts);
