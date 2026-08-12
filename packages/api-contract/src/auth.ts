import { z } from 'zod';

export const StartOtp = z.object({
  channel: z.enum(['phone', 'email']),
  value: z.string().min(3),
});
export const VerifyOtp = z.object({ requestId: z.string(), code: z.string().length(6) });
export const AuthTokens = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int(),
});
export type AuthTokens = z.infer<typeof AuthTokens>;
