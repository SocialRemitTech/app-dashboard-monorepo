// apps/mobile/src/features/activity/stores/transactions.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/shared/platform/storage';

export type TxType = 'topup' | 'send';
export type TxStatus = 'completed' | 'processing' | 'failed';

export interface Transaction {
  id: string;
  type: TxType;
  status: TxStatus;
  createdAt: string;
  amountMinor: number;
  recipientName?: string | undefined;
  corridorCountry?: string | undefined;
  corridorCode?: string | undefined;
  deliveryType?: string | undefined;
  recipientAccount?: string | undefined;
  recipientBank?: string | undefined;
  receiveLabel?: string | undefined;
  method?: string | undefined;
  reference?: string | undefined;
}

interface TxState {
  transactions: Transaction[];
  add: (t: Omit<Transaction, 'id' | 'createdAt'> & { id?: string | undefined }) => Transaction;
  updateStatus: (id: string, status: TxStatus) => void;
  clear: () => void;
}

export const useTransactions = create<TxState>()(
  persist(
    (set, get) => ({
      transactions: [],
      add: (input) => {
        const { id, ...rest } = input;
        const tx: Transaction = {
          id: id ?? `SR-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          ...rest,
        };
        set({ transactions: [tx, ...get().transactions] });
        return tx;
      },
      updateStatus: (id, status) =>
        set((s) => ({
          transactions: s.transactions.map((x) => (x.id === id ? { ...x, status } : x)),
        })),
      clear: () => set({ transactions: [] }),
    }),
    { name: 'sr-transactions', storage: persistStorage },
  ),
);
