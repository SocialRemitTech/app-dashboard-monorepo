import { z } from 'zod';

export const DeliveryType = z.enum(['mobile_wallet', 'bank', 'cash_pickup', 'account_credit']);
export type DeliveryType = z.infer<typeof DeliveryType>;

/** A recipient field spec — drives config-driven recipient forms (no hardcoded per-corridor UI). */
export const RecipientField = z.object({
  key: z.string(),
  label: z.string(),
  kind: z.enum(['text', 'number', 'select', 'phone']),
  required: z.boolean(),
  pattern: z.string().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

export const DeliveryMethod = z.object({
  type: DeliveryType,
  recipientSchema: z.array(RecipientField),
  minAmountMinor: z.number().int(),
  maxAmountMinor: z.number().int(),
});

export const Corridor = z.object({
  id: z.string().uuid(),
  fromCountry: z.string().length(2),
  toCountry: z.string().length(2),
  sendCurrency: z.string().length(3),
  receiveCurrency: z.string().length(3),
  requiredKycLevel: z.enum(['basic', 'edd']),
  deliveryMethods: z.array(DeliveryMethod),
});
export type Corridor = z.infer<typeof Corridor>;
