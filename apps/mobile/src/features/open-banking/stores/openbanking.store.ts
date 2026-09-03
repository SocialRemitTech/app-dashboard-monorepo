// apps/mobile/src/features/open-banking/stores/openbanking.store.ts
import { create } from 'zustand';

export type ObContext = 'topup' | 'send';

interface OpenBankingState {
  context: ObContext;
  amountMinor: number;
  bankId: string;
  bankName: string;
  bankColor: string;
  bankInitials: string;
  begin: (context: ObContext, amountMinor: number) => void;
  selectBank: (b: { id: string; name: string; color: string; initials: string }) => void;
}

/** Reused by wallet top-up and send "Pay by bank". `context` tells the processing screen how to finish. */
export const useOpenBanking = create<OpenBankingState>((set) => ({
  context: 'topup',
  amountMinor: 0,
  bankId: '',
  bankName: '',
  bankColor: '',
  bankInitials: '',
  begin: (context, amountMinor) => set({ context, amountMinor, bankId: '', bankName: '' }),
  selectBank: (b) =>
    set({ bankId: b.id, bankName: b.name, bankColor: b.color, bankInitials: b.initials }),
}));
