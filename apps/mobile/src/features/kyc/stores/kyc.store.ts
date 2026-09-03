// apps/mobile/src/features/kyc/stores/kyc.store.ts
import { create } from 'zustand';
import type { KycStatus } from '@sr/domain';

export interface KycDetails {
  legalName: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  nationality: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  relationship: string;
  purpose: string;
}

interface KycState extends KycDetails {
  status: KycStatus;
  setStatus: (s: KycStatus) => void;
  set: (p: Partial<KycDetails>) => void;
}

const initial: KycDetails = {
  legalName: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  nationality: 'United Kingdom',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  relationship: '',
  purpose: '',
};

export const useKyc = create<KycState>((set) => ({
  ...initial,
  status: 'not_started',
  setStatus: (status) => set({ status }),
  set: (p) => set(p),
}));
