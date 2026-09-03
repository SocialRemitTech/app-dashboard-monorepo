// apps/mobile/src/features/send-money/data/corridors.ts
import { corridorRegistry } from '@sr/config';

export interface CorridorSeed {
  id: string;
  code: string;
  country: string;
  flag: 'gh' | 'ng' | 'ke' | 'in';
  currency: string;
  rate: number;
  feeMinor: number;
  popular: boolean;
  live: boolean;
  payoutMethods: ('mobile_money' | 'bank')[];
}

// The app ships flag art for these four; everything else is shown as "coming soon" (emoji flag).
const APP_FLAGS: Record<string, CorridorSeed['flag']> = { GH: 'gh', NG: 'ng', KE: 'ke', IN: 'in' };

export const corridors: CorridorSeed[] = corridorRegistry
  .filter((c) => APP_FLAGS[c.code])
  .map((c) => ({
    id: `uk-${c.code.toLowerCase()}`,
    code: c.code,
    country: c.country,
    flag: APP_FLAGS[c.code]!,
    currency: c.receiveCurrency,
    rate: c.rate,
    feeMinor: 0,
    popular: true,
    live: c.live,
    payoutMethods: c.payoutMethods,
  }));

// Destinations without bundled flag art — rendered with their emoji flag in the "coming soon" list.
export const comingSoonCorridors = corridorRegistry
  .filter((c) => !APP_FLAGS[c.code])
  .map((c) => ({ code: c.code, country: c.country, flag: c.flag }));

export const SEND_CURRENCY = 'GBP';
export const SEND_FLAG = 'gb' as const;
export const popularAmountsMinor = [5000, 10000, 20000, 50000];
