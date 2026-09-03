// apps/mobile/src/features/wallet/stores/wallet.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/shared/platform/storage';

type AddMethod = 'open_banking' | 'debit_card';

interface WalletState {
  balanceMinor: number;
  topupAmountMinor: number; // transient (not persisted meaningfully, but harmless)
  method: AddMethod;
  setTopupAmount: (m: number) => void;
  setMethod: (m: AddMethod) => void;
  commitTopup: () => void;
  debit: (m: number) => boolean;
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      balanceMinor: 0,
      topupAmountMinor: 0,
      method: 'open_banking',
      setTopupAmount: (m) => set({ topupAmountMinor: Math.max(0, m) }),
      setMethod: (method) => set({ method }),
      commitTopup: () => set((s) => ({ balanceMinor: s.balanceMinor + s.topupAmountMinor })),
      debit: (m) => {
        if (get().balanceMinor < m) return false;
        set((s) => ({ balanceMinor: s.balanceMinor - m }));
        return true;
      },
    }),
    {
      name: 'sr-wallet',
      storage: persistStorage,
      partialize: (s) => ({ balanceMinor: s.balanceMinor }),
    },
  ),
);

export const gbp = (minor: number) =>
  `£${(minor / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
