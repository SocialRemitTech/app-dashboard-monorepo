import { Money } from '../money/money';

export interface FeeModel {
  kind: 'flat' | 'percent' | 'tiered';
  /** flat: minor units; percent: basis points; tiered: [{ uptoMinor, feeMinor }] */
  params: { flatMinor?: number; bps?: number; tiers?: { uptoMinor: number; feeMinor: number }[] };
}

export function computeFee(send: Money, model: FeeModel): Money {
  switch (model.kind) {
    case 'flat':
      return Money.of(model.params.flatMinor ?? 0, send.currency);
    case 'percent':
      return send.scale((model.params.bps ?? 0) / 10_000);
    case 'tiered': {
      const tier = (model.params.tiers ?? []).find((t) => send.amountMinor <= t.uptoMinor);
      return Money.of(tier?.feeMinor ?? model.params.flatMinor ?? 0, send.currency);
    }
  }
}

/**
 * Produce the customer-facing quote. `sourcedRate` is what we buy FX at; `quotedRate` is what we show.
 * The spread between them is FX margin — captured explicitly, never implied (Backend §1.2).
 */
export function computeQuote(params: {
  send: Money;
  feeModel: FeeModel;
  sourcedRate: number;
  quotedRate: number;
  receiveCurrency: string;
}) {
  const fee = computeFee(params.send, params.feeModel);
  const receive = params.send.convert(params.quotedRate, params.receiveCurrency);
  const sourcedReceive = params.send.convert(params.sourcedRate, params.receiveCurrency);
  const marginReceiveCcy = sourcedReceive.subtract(receive); // positive if we quote below sourced
  return { fee, receive, fxRate: params.quotedRate, marginReceiveCcy };
}
