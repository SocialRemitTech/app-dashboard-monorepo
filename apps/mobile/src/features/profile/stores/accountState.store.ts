// apps/mobile/src/features/profile/stores/accountState.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/shared/platform/storage';

export type AccountState =
  | 'setup_not_started'
  | 'setup_in_progress'
  | 'verification_not_started'
  | 'verification_in_progress'
  | 'more_info_needed'
  | 'verified';

export const ACCOUNT_STATE_LABELS: Record<AccountState, string> = {
  setup_not_started: 'Account setup not started',
  setup_in_progress: 'Account setup in progress',
  verification_not_started: 'Verification not started',
  verification_in_progress: 'Verification in progress',
  more_info_needed: 'More information needed',
  verified: 'Account verified',
};

export const ACCOUNT_STATES: AccountState[] = [
  'setup_not_started',
  'setup_in_progress',
  'verification_not_started',
  'verification_in_progress',
  'more_info_needed',
  'verified',
];

/** The four things the setup sheet promises to collect, in order. */
export type SetupStep = 'identity' | 'address' | 'email' | 'extra';

export const SETUP_STEPS: SetupStep[] = ['identity', 'address', 'email', 'extra'];

export const SETUP_STEP_ROUTE: Record<SetupStep, string> = {
  identity: '/(app)/account/kyc-step-1',
  address: '/(app)/account/kyc-step-1', // step 1 collects name+DOB AND the address
  email: '/(app)/account/email',
  extra: '/(app)/account/kyc-step-2',
};

export interface PersonalDetails {
  preferredName: string;
  legalName: string;
  dateOfBirth: string;
  homeAddress: string;
  emailAddress: string;
  emailConfirmed: boolean;
  mobileNumber: string;
  mobileConfirmed: boolean;
  socialRemitId: string;
}

interface AccountStateStore extends PersonalDetails {
  state: AccountState;
  /** Persisted progress — resuming always continues from the first incomplete step. */
  stepsDone: Record<SetupStep, boolean>;
  setState: (s: AccountState) => void;
  setDetails: (p: Partial<PersonalDetails>) => void;
  markStepDone: (...steps: SetupStep[]) => void;
  nextIncompleteStep: () => SetupStep | null;
  resumeRoute: () => string;
  reset: () => void;
}

const BASE: PersonalDetails = {
  preferredName: '',
  legalName: '',
  dateOfBirth: '',
  homeAddress: '',
  emailAddress: '',
  emailConfirmed: false,
  mobileNumber: '+44 7700 900000',
  mobileConfirmed: true,
  socialRemitId: 'SRID-U6XV-FMXM',
};

const NONE: Record<SetupStep, boolean> = {
  identity: false,
  address: false,
  email: false,
  extra: false,
};
const ALL: Record<SetupStep, boolean> = { identity: true, address: true, email: true, extra: true };

/** Each state implies both how much of the profile is filled AND which steps are done. */
const SEED: Record<
  AccountState,
  { details: Partial<PersonalDetails>; steps: Record<SetupStep, boolean> }
> = {
  setup_not_started: { details: {}, steps: { ...NONE } },

  setup_in_progress: {
    details: { preferredName: 'Nana', legalName: 'Nana Kofi Mensah' },
    steps: { ...NONE, identity: true },
  },

  verification_not_started: {
    details: {
      preferredName: 'Nana',
      legalName: 'Nana Kofi Mensah',
      dateOfBirth: '15 March 1990',
      homeAddress: '42 Maple Road, London, E1 4LR',
      emailAddress: 'nana.mensah@gmail.com',
      emailConfirmed: true,
    },
    steps: { ...ALL, extra: false },
  },

  verification_in_progress: {
    details: {
      preferredName: 'Nana',
      legalName: 'Nana Kofi Mensah',
      dateOfBirth: '15 March 1990',
      homeAddress: '42 Maple Road, London, E1 4LR',
      emailAddress: 'nana.mensah@gmail.com',
      emailConfirmed: true,
    },
    steps: { ...ALL },
  },

  // Something came back from review — the extra-information step reopens.
  more_info_needed: {
    details: {
      preferredName: 'Nana',
      legalName: 'Nana Kofi Mensah',
      dateOfBirth: '15 March 1990',
      homeAddress: '42 Maple Road, London, E1 4LR',
      emailAddress: 'nana.mensah@gmail.com',
      emailConfirmed: true,
    },
    steps: { ...ALL, extra: false },
  },

  verified: {
    details: {
      preferredName: 'Nana',
      legalName: 'Nana Kofi Mensah',
      dateOfBirth: '15 March 1990',
      homeAddress: '42 Maple Road, London, E1 4LR',
      emailAddress: 'nana.mensah@gmail.com',
      emailConfirmed: true,
    },
    steps: { ...ALL },
  },
};

export const useAccountState = create<AccountStateStore>()(
  persist(
    (set, get) => ({
      ...BASE,
      state: 'setup_not_started',
      stepsDone: { ...NONE },

      setState: (s) =>
        set({ ...BASE, ...SEED[s].details, stepsDone: { ...SEED[s].steps }, state: s }),
      setDetails: (p) => set(p),

      markStepDone: (...steps) =>
        set({
          stepsDone: { ...get().stepsDone, ...Object.fromEntries(steps.map((s) => [s, true])) },
        }),

      nextIncompleteStep: () => SETUP_STEPS.find((s) => !get().stepsDone[s]) ?? null,

      resumeRoute: () => {
        const done = get().stepsDone;
        const next = SETUP_STEPS.find((s) => !done[s]);
        if (!next) return '/(app)/account/verifying';
        // A fresh start sees the reassurance screen first; resuming skips it and drops the
        // customer straight back at the step they left off on.
        const nothingDone = SETUP_STEPS.every((s) => !done[s]);
        return nothingDone ? '/(app)/account/verify-identity' : SETUP_STEP_ROUTE[next];
      },

      reset: () => set({ ...BASE, stepsDone: { ...NONE }, state: 'setup_not_started' }),
    }),
    { name: 'sr-account-state', storage: persistStorage },
  ),
);

export function verificationSummary(s: AccountState): {
  label: string;
  tone: 'muted' | 'progress' | 'warn' | 'ok';
} {
  switch (s) {
    case 'setup_not_started':
      return { label: 'Not started', tone: 'muted' };
    case 'setup_in_progress':
      return { label: 'Setup in progress', tone: 'progress' };
    case 'verification_not_started':
      return { label: 'Not started', tone: 'muted' };
    case 'verification_in_progress':
      return { label: 'In review', tone: 'progress' };
    case 'more_info_needed':
      return { label: 'More information needed', tone: 'warn' };
    case 'verified':
      return { label: 'Verified', tone: 'ok' };
  }
}
