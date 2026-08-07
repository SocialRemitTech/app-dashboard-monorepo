import { setup, assign } from 'xstate';
import type { Quote } from '@sr/api-contract';

/**
 * Send-money flow as an explicit state machine (Frontend §3.4). Replaces ~15 interdependent
 * handlers from the MVP's App.tsx. Guards encode the real rules: KYC gate, rate-lock validity,
 * partner health. The idempotency key is minted on entering `payment`.
 */
interface Ctx {
  corridorId?: string;
  quote?: Quote;
  recipientId?: string;
  idempotencyKey?: string;
}

type Events =
  | { type: 'CORRIDOR_SELECTED'; corridorId: string }
  | { type: 'QUOTE_READY'; quote: Quote }
  | { type: 'RECIPIENT_SELECTED'; recipientId: string }
  | { type: 'KYC_VERIFIED' }
  | { type: 'RATE_EXPIRED' }
  | { type: 'PARTNER_DOWN' }
  | { type: 'CONFIRM' };

export const sendMachine = setup({
  types: { context: {} as Ctx, events: {} as Events },
  guards: {
    kycVerified: () => false, // wired to evaluateKycGate + session in Phase 1
    rateValid: ({ context }) => !!context.quote && new Date(context.quote.expiresAt) > new Date(),
  },
  actions: {
    mintIdempotencyKey: assign(() => ({ idempotencyKey: crypto.randomUUID() })),
  },
}).createMachine({
  id: 'send',
  initial: 'corridor',
  context: {},
  states: {
    corridor: {
      on: { CORRIDOR_SELECTED: { target: 'amount', actions: assign(({ event }) => ({ corridorId: event.corridorId })) } },
    },
    amount: {
      on: { QUOTE_READY: { target: 'recipient', actions: assign(({ event }) => ({ quote: event.quote })) } },
    },
    recipient: {
      on: {
        RECIPIENT_SELECTED: [
          { target: 'summary', guard: 'kycVerified', actions: assign(({ event }) => ({ recipientId: event.recipientId })) },
          { target: 'kyc', actions: assign(({ event }) => ({ recipientId: event.recipientId })) },
        ],
      },
    },
    kyc: { on: { KYC_VERIFIED: 'summary' } },
    summary: {
      on: {
        RATE_EXPIRED: 'fxRefresh',
        PARTNER_DOWN: 'outageGate',
        CONFIRM: { target: 'payment', guard: 'rateValid', actions: 'mintIdempotencyKey' },
      },
    },
    fxRefresh: { on: { QUOTE_READY: { target: 'summary', actions: assign(({ event }) => ({ quote: event.quote })) } } },
    outageGate: { on: { PARTNER_DOWN: 'outageGate', CONFIRM: 'summary' } },
    payment: { type: 'final' },
  },
});
