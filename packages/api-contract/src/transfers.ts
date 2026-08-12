import { z } from 'zod';

/** One canonical status the client trusts — partner-specific enums are mapped to this server-side. */
export const CanonicalStatus = z.enum([
  'created', 'screening', 'priced', 'pay_in', 'reserved', 'routing',
  'payout_submitted', 'processing', 'paid_on_partner', 'reconciled',
  'completed', 'failed', 'rejected',
]);
export type CanonicalStatus = z.infer<typeof CanonicalStatus>;

export const InitiateTransfer = z.object({
  quoteId: z.string().uuid(),
  recipientId: z.string().uuid(),
  // Client-minted, unique per attempt. The server dedupes on it → at-most-once. (§1.3)
  idempotencyKey: z.string().uuid(),
});
export type InitiateTransfer = z.infer<typeof InitiateTransfer>;

export const Transfer = z.object({
  id: z.string().uuid(),
  status: CanonicalStatus,
  createdAt: z.string().datetime(),
});
export type Transfer = z.infer<typeof Transfer>;
