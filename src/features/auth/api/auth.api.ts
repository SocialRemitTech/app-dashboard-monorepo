import { useMutation } from '@tanstack/react-query';
import { AuthTokens, StartOtp, VerifyOtp } from '@sr/api-contract';
import { request } from '../../../data/api-client';
import { z } from 'zod';

export function useStartOtp() {
  return useMutation({
    mutationFn: (input: z.infer<typeof StartOtp>) =>
      request('/auth/otp/start', { method: 'POST', body: input, schema: z.object({ requestId: z.string() }) }),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (input: z.infer<typeof VerifyOtp>) =>
      request('/auth/otp/verify', { method: 'POST', body: input, schema: AuthTokens }),
  });
}
