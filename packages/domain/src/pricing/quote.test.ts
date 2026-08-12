import { describe, expect, it } from 'vitest';
import { Money } from '../money/money';
import { computeFee, computeQuote } from './quote';

describe('pricing', () => {
  it('flat fee', () => {
    expect(computeFee(Money.of(10000, 'GBP'), { kind: 'flat', params: { flatMinor: 250 } }).amountMinor).toBe(250);
  });
  it('percent fee in bps', () => {
    // 1.5% of £100 = £1.50
    expect(computeFee(Money.of(10000, 'GBP'), { kind: 'percent', params: { bps: 150 } }).amountMinor).toBe(150);
  });
  it('captures fx margin as the sourced/quoted spread', () => {
    const q = computeQuote({
      send: Money.of(10000, 'GBP'),
      feeModel: { kind: 'flat', params: { flatMinor: 250 } },
      sourcedRate: 17.6,
      quotedRate: 17.45,
      receiveCurrency: 'GHS',
    });
    expect(q.receive.amountMinor).toBe(174500);       // shown to customer
    expect(q.marginReceiveCcy.amountMinor).toBe(1500); // 176000 - 174500 pesewa margin
    expect(q.fee.amountMinor).toBe(250);
  });
});
