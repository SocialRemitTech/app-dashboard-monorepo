// apps/mobile/src/features/send-money/data/corridors.ts
/** Seed corridors with indicative rates. In production this comes from the config service. */
export interface CorridorSeed {
  id: string;
  country: string;
  flag: 'gh' | 'ng' | 'ke' | 'in';
  currency: string;
  rate: number; // 1 GBP -> currency
  feeMinor: number; // 0 = Free
  popular: boolean;
  live: boolean;
}

export const SEND_CURRENCY = 'GBP';
export const SEND_FLAG = 'gb' as const;

export const corridors: CorridorSeed[] = [
  {
    id: 'uk-gh',
    country: 'Ghana',
    flag: 'gh',
    currency: 'GHS',
    rate: 18.75,
    feeMinor: 0,
    popular: true,
    live: true,
  },
  {
    id: 'uk-ng',
    country: 'Nigeria',
    flag: 'ng',
    currency: 'NGN',
    rate: 1850.0,
    feeMinor: 0,
    popular: true,
    live: false,
  },
  {
    id: 'uk-ke',
    country: 'Kenya',
    flag: 'ke',
    currency: 'KES',
    rate: 165.0,
    feeMinor: 0,
    popular: true,
    live: false,
  },
  {
    id: 'uk-in',
    country: 'India',
    flag: 'in',
    currency: 'INR',
    rate: 105.0,
    feeMinor: 0,
    popular: true,
    live: false,
  },
];

export const popularAmountsMinor = [5000, 10000, 20000, 50000]; // £50 / £100 / £200 / £500
