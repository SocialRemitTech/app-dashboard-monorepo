// apps/mobile/src/features/send-money/stores/send.store.ts
import { create } from 'zustand';
import { Money } from '@sr/domain';
import { corridors, type CorridorSeed } from '../data/corridors';

interface SendState {
  corridor: CorridorSeed;
  sendAmountMinor: number;
  setCorridor: (c: CorridorSeed) => void;
  setAmountMinor: (m: number) => void;
  receive: () => Money; // recipient receives, computed exactly (no floats)
}

export const useSend = create<SendState>((set, get) => ({
  corridor: corridors[0]!,
  sendAmountMinor: 50000, // £500 default (matches the design)
  setCorridor: (c) => set({ corridor: c }),
  setAmountMinor: (m) => set({ sendAmountMinor: Math.max(0, m) }),
  receive: () => {
    const { sendAmountMinor, corridor } = get();
    return Money.of(sendAmountMinor, 'GBP').convert(corridor.rate, corridor.currency);
  },
}));
