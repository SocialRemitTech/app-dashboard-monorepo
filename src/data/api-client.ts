// apps/mobile/src/data/api-client.ts
import { randomUUID } from 'expo-crypto';
import type { ZodType } from 'zod';
import { AppError } from './http-error';
import { secureStore } from '@/shared/platform/secure-store';
import { logger } from '@/shared/observability/logger';
import { findMock } from './dev-mocks';

/**
 * The ONLY thing allowed to touch the network. Validates every response against its Zod schema.
 * In development it consults dev-mocks first (so the app runs with no backend).
 */
export interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  schema: ZodType<T>;
  idempotent?: boolean;
}

let baseUrl = '';
let isDev = false;
export function configureApi(url: string, dev = false) {
  baseUrl = url;
  isDev = dev;
}

export async function request<T>(path: string, opts: RequestOptions<T>): Promise<T> {
  const method = opts.method ?? 'GET';
  const correlationId = randomUUID();

  // --- development short-circuit ---
  if (isDev) {
    const mock = findMock(method, path);
    if (mock) {
      await new Promise((r) => setTimeout(r, mock.delayMs ?? 300));
      try {
        const body = mock.body(opts.body);
        const parsed = opts.schema.safeParse(body);
        if (!parsed.success) throw new AppError('contract_violation', 'Mock shape mismatch', correlationId);
        return parsed.data;
      } catch (e) {
        const err = e as { status?: number; code?: string; message?: string };
        if (err?.code) throw new AppError(err.code, err.message ?? 'Error', correlationId, err.status);
        throw e;
      }
    }
  }

  const token = await secureStore.get('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Correlation-Id': correlationId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.idempotent ? { 'Idempotency-Key': randomUUID() } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    logger.error('network_error', { path, correlationId });
    throw new AppError('network_error', 'No connection', correlationId);
  }

  const json = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw AppError.fromResponse(res.status, json, correlationId);

  const parsed = opts.schema.safeParse(json);
  if (!parsed.success) {
    logger.error('contract_violation', { path, correlationId });
    throw new AppError('contract_violation', 'Unexpected response shape', correlationId, res.status);
  }
  return parsed.data;
}
