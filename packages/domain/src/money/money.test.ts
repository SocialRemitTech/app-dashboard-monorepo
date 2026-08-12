import { describe, expect, it } from 'vitest';
import { Money } from './money';

describe('Money', () => {
  it('adds and subtracts within a currency', () => {
    expect(Money.of(10000, 'GBP').add(Money.of(250, 'GBP')).amountMinor).toBe(10250);
    expect(Money.of(10000, 'GBP').subtract(Money.of(250, 'GBP')).amountMinor).toBe(9750);
  });

  it('refuses cross-currency arithmetic', () => {
    expect(() => Money.of(100, 'GBP').add(Money.of(100, 'GHS'))).toThrow(/mismatch/i);
  });

  it('rejects non-integer minor units', () => {
    expect(() => Money.of(10.5, 'GBP')).toThrow(/integer/i);
  });

  it('converts £100 -> GHS at 17.45 with half-up rounding', () => {
    // 10000 * 17.45 = 174500 pesewa = 1745.00 GHS
    expect(Money.of(10000, 'GBP').convert(17.45, 'GHS').amountMinor).toBe(174500);
  });

  it('allocates without losing or creating minor units', () => {
    const parts = Money.of(10001, 'GBP').allocate(3);
    expect(parts.map((p) => p.amountMinor)).toEqual([3334, 3334, 3333]);
    const sum = parts.reduce((a, p) => a + p.amountMinor, 0);
    expect(sum).toBe(10001);
  });
});
