/**
 * Money — the one correct way to represent value in this system.
 * Integer minor units + ISO currency. All arithmetic is exact and currency-checked.
 * Floats are structurally impossible here; that is the point.
 */
export class Money {
  private constructor(
    readonly amountMinor: number,
    readonly currency: string,
  ) {
    if (!Number.isInteger(amountMinor)) throw new Error('Money must be integer minor units');
  }

  static of(amountMinor: number, currency: string): Money {
    return new Money(amountMinor, currency.toUpperCase());
  }

  static zero(currency: string): Money {
    return new Money(0, currency.toUpperCase());
  }

  private assertSame(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  add(other: Money): Money {
    this.assertSame(other);
    return new Money(this.amountMinor + other.amountMinor, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSame(other);
    return new Money(this.amountMinor - other.amountMinor, this.currency);
  }

  /** Multiply by a rate/scalar and round half-up to whole minor units. */
  scale(factor: number): Money {
    return new Money(Math.round(this.amountMinor * factor), this.currency);
  }

  /**
   * Split into n parts with no lost/created minor units (largest-remainder).
   * Guarantees sum(parts) === this.
   */
  allocate(n: number): Money[] {
    if (n <= 0) throw new Error('allocate requires n > 0');
    const base = Math.trunc(this.amountMinor / n);
    let remainder = this.amountMinor - base * n;
    return Array.from({ length: n }, () => {
      const extra = remainder > 0 ? 1 : remainder < 0 ? -1 : 0;
      if (remainder > 0) remainder -= 1;
      else if (remainder < 0) remainder += 1;
      return new Money(base + extra, this.currency);
    });
  }

  isPositive(): boolean { return this.amountMinor > 0; }
  equals(other: Money): boolean { return this.amountMinor === other.amountMinor && this.currency === other.currency; }

  /** Convert to the recipient currency at a given rate (result in target currency). */
  convert(rate: number, toCurrency: string): Money {
    return new Money(Math.round(this.amountMinor * rate), toCurrency.toUpperCase());
  }
}
