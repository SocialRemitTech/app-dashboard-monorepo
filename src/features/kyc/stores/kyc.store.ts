// apps/mobile/src/features/kyc/stores/kyc.store.ts
import { create } from 'zustand';
import type { KycStatus } from '@sr/domain';

interface KycState {
  status: KycStatus;
  setStatus: (s: KycStatus) => void;
}
export const useKyc = create<KycState>((set) => ({
  status: 'not_started',
  setStatus: (status) => set({ status }),
}));
