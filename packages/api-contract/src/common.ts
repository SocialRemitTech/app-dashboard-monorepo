import { z } from 'zod';

/** Money is ALWAYS integer minor units + ISO currency. Never a float, anywhere on the wire. */
export const Money = z.object({
  amountMinor: z.number().int(),
  currency: z.string().length(3),
});
export type Money = z.infer<typeof Money>;

/** Normalised error envelope — every non-2xx response conforms to this. */
export const ApiError = z.object({
  code: z.string(),
  message: z.string(),
  correlationId: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});
export type ApiError = z.infer<typeof ApiError>;

export const Page = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), nextCursor: z.string().nullable() });
