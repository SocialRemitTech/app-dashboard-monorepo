// apps/dashboard/src/data/mock.ts
import type { CanonicalStatus } from '@sr/api-contract';

export interface TransferRow {
  id: string;
  createdAt: string;
  sender: string;
  recipient: string;
  corridor: string;      // e.g. UK→GH
  sendMinor: number;     // GBP minor
  receiveMinor: number;  // dest ccy minor
  receiveCcy: string;
  status: CanonicalStatus;
  partner: string;
}

const NAMES = ['A. Osei', 'K. Mensah', 'N. Adeyemi', 'J. Okafor', 'M. Wanjiru', 'S. Patel', 'D. Boateng', 'F. Eze'];
const CORRIDORS = [
  { c: 'UK→GH', ccy: 'GHS', rate: 18.75, partner: 'BigPay' },
  { c: 'UK→NG', ccy: 'NGN', rate: 1850, partner: 'Velocity' },
  { c: 'UK→KE', ccy: 'KES', rate: 165, partner: 'M-Pesa' },
];
const STATUSES: CanonicalStatus[] = ['completed', 'completed', 'completed', 'processing', 'paid_on_partner', 'reconciled', 'failed', 'screening'];

export const transfers: TransferRow[] = Array.from({ length: 24 }).map((_, i) => {
  const corr = CORRIDORS[i % CORRIDORS.length]!;
  const sendMinor = [5000, 10000, 20000, 50000, 30000][i % 5]!;
  return {
    id: `SR-${(1042 + i).toString(36).toUpperCase()}`,
    createdAt: new Date(Date.now() - i * 3.2e6).toISOString(),
    sender: NAMES[i % NAMES.length]!,
    recipient: NAMES[(i + 3) % NAMES.length]!,
    corridor: corr.c,
    sendMinor,
    receiveMinor: Math.round(sendMinor * corr.rate),
    receiveCcy: corr.ccy,
    status: STATUSES[i % STATUSES.length]!,
    partner: corr.partner,
  };
});

export interface ReconBreak {
  id: string;
  transferId: string;
  partner: string;
  type: 'partner_paid_no_record' | 'platform_paid_missing' | 'amount_mismatch' | 'duplicate' | 'stuck';
  amountMinor: number;
  ccy: string;
  ageHours: number;
}
export const breaks: ReconBreak[] = [
  { id: 'BRK-1', transferId: 'SR-1051', partner: 'BigPay', type: 'stuck', amountMinor: 937500, ccy: 'GHS', ageHours: 6 },
  { id: 'BRK-2', transferId: 'SR-1048', partner: 'Velocity', type: 'amount_mismatch', amountMinor: 18500000, ccy: 'NGN', ageHours: 14 },
  { id: 'BRK-3', transferId: 'SR-1043', partner: 'BigPay', type: 'platform_paid_missing', amountMinor: 187500, ccy: 'GHS', ageHours: 26 },
];

export const volumeByDay = [
  { day: 'Mon', gbp: 4200 }, { day: 'Tue', gbp: 5100 }, { day: 'Wed', gbp: 3800 },
  { day: 'Thu', gbp: 6400 }, { day: 'Fri', gbp: 7200 }, { day: 'Sat', gbp: 5600 }, { day: 'Sun', gbp: 4900 },
];
