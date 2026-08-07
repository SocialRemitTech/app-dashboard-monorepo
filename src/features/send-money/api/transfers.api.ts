// apps/mobile/src/features/send-money/api/transfers.api.ts
import { useMutation } from '@tanstack/react-query';
import { InitiateTransfer, Transfer } from '@sr/api-contract';
import { request } from '@/data/api-client';
import type { z } from 'zod';

/** Money-moving POST → idempotent (the api-client attaches the Idempotency-Key header). */
export function useInitiateTransfer() {
  return useMutation({
    mutationFn: (input: z.infer<typeof InitiateTransfer>) =>
      request('/transfers', { method: 'POST', body: input, schema: Transfer, idempotent: true }),
  });
}
