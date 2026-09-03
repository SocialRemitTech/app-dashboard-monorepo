// apps/mobile/src/features/send-money/stores/send.store.ts
import { create } from 'zustand';
import { Money } from '@sr/domain';
import { corridors, type CorridorSeed } from '../data/corridors';

export type DeliveryType = 'mobile_wallet' | 'bank';
export type PaymentMethod = 'debit_card' | 'pay_by_bank' | 'wallet';

interface SendState {
  corridor: CorridorSeed;
  sendAmountMinor: number;
  deliveryType: DeliveryType | null;
  recipientName: string;
  recipientAccount: string; // momo number OR bank account number
  recipientBank: string; // bank name (bank delivery)
  paymentMethod: PaymentMethod | null;
  personalReference: string;
  idempotencyKey: string | null;
  transferId: string | null;
  setCorridor: (c: CorridorSeed) => void;
  setAmountMinor: (m: number) => void;
  set: (p: Partial<SendState>) => void;
  receive: () => Money;
  reset: () => void;
}

const initial = {
  corridor: corridors[0]!,
  sendAmountMinor: 50000,
  deliveryType: null as DeliveryType | null,
  recipientName: '',
  recipientAccount: '',
  recipientBank: '',
  paymentMethod: null as PaymentMethod | null,
  personalReference: '',
  idempotencyKey: null,
  transferId: null,
};

export const useSend = create<SendState>((set, get) => ({
  ...initial,
  setCorridor: (c) => set({ corridor: c }),
  setAmountMinor: (m) => set({ sendAmountMinor: Math.max(0, m) }),
  set: (p) => set(p),
  receive: () => {
    const { sendAmountMinor, corridor } = get();
    return Money.of(sendAmountMinor, 'GBP').convert(corridor.rate, corridor.currency);
  },
  reset: () => set(initial),
}));
