// packages/config/src/corridors.ts
/**
 * Canonical corridor registry — the single source of truth for which corridors exist and
 * whether they're live. The app reads this to decide what senders can pick; the ops dashboard
 * reads and (in production, via the config service) toggles the `live` flag. Ghana + Nigeria live.
 */
export interface CorridorDef {
  code: string;           // ISO-2 destination
  country: string;
  flag: string;           // emoji (dashboard/web); the app maps `code` to bundled flag art
  receiveCurrency: string;
  rate: number;           // indicative 1 GBP -> receiveCurrency
  partner: string;
  live: boolean;
}

export const corridorRegistry: CorridorDef[] = [
  { code: 'GH', country: 'Ghana',        flag: '🇬🇭', receiveCurrency: 'GHS', rate: 18.75, partner: 'BigPay',     live: true },
  { code: 'NG', country: 'Nigeria',      flag: '🇳🇬', receiveCurrency: 'NGN', rate: 1850,  partner: 'Velocity',   live: true },
  { code: 'KE', country: 'Kenya',        flag: '🇰🇪', receiveCurrency: 'KES', rate: 165,   partner: 'M-Pesa',     live: false },
  { code: 'IN', country: 'India',        flag: '🇮🇳', receiveCurrency: 'INR', rate: 105,   partner: 'MoneyMatch', live: false },
  { code: 'ZA', country: 'South Africa', flag: '🇿🇦', receiveCurrency: 'ZAR', rate: 23.4,  partner: 'Mukuru',     live: false },
  { code: 'TZ', country: 'Tanzania',     flag: '🇹🇿', receiveCurrency: 'TZS', rate: 2900,  partner: 'M-Pesa',     live: false },
  { code: 'SN', country: 'Senegal',      flag: '🇸🇳', receiveCurrency: 'XOF', rate: 730,   partner: 'Pixel',      live: false },
];

export const liveCorridors = () => corridorRegistry.filter((c) => c.live);
