// apps/mobile/src/features/send-money/stores/send.store.ts
import { create } from 'zustand';
import { Money } from '@sr/domain';
import { corridors, type CorridorSeed } from '../data/corridors';

export type DeliveryType = 'mobile_wallet' | 'bank' | 'cash_pickup' | 'account_credit';
export type PaymentMethod = 'open_banking' | 'card' | 'apple_pay' | 'google_pay';

interface SendState {
  corridor: CorridorSeed;
  sendAmountMinor: number;
  deliveryType: DeliveryType;
  recipientName: string;
  recipientAccount: string;
  paymentMethod: PaymentMethod | null;
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
  deliveryType: 'mobile_wallet' as DeliveryType,
  recipientName: '',
  recipientAccount: '',
  paymentMethod: null,
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
