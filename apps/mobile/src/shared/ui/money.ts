// apps/mobile/src/shared/ui/money.ts
import type { Money } from '@sr/domain';

/** Display a Money value with grouping. Value stays integer minor units internally. */
export function formatMoney(m: Money, opts?: { symbol?: string }): string {
  const major = m.amountMinor / 100;
  const s = major.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return opts?.symbol ? `${opts.symbol}${s}` : s;
}
export function formatMinorGBP(minor: number): string {
  return `£${(minor / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
}
