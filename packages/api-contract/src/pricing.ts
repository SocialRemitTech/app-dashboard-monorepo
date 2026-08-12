import { z } from 'zod';
import { Money } from './common';

export const QuoteRequest = z.object({
  corridorId: z.string().uuid(),
  deliveryType: z.enum(['mobile_wallet', 'bank', 'cash_pickup', 'account_credit']),
  sendAmountMinor: z.number().int().positive(),
});
export type QuoteRequest = z.infer<typeof QuoteRequest>;

/** The rate is locked: rateId + expiresAt. The client must re-quote past expiry (FE §3.4). */
export const Quote = z.object({
  quoteId: z.string().uuid(),
  rateId: z.string(),
  corridorId: z.string().uuid(),
  send: Money,
  receive: Money,
  fxRate: z.number().positive(),
  fee: Money,
  expiresAt: z.string().datetime(),
});
export type Quote = z.infer<typeof Quote>;
