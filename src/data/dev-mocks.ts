// apps/mobile/src/data/dev-mocks.ts
/**
 * Lightweight dev mock. When ENVIRONMENT=development, the api-client short-circuits
 * matching routes to these responses instead of hitting the network. This unblocks the
 * whole flow with no backend and no MSW-native worker. Swap to the real API by setting
 * ENVIRONMENT=staging/production (or deleting the guard in api-client).
 */
type Mock = { match: (method: string, path: string) => boolean; delayMs?: number; body: (input: unknown) => unknown };

export const devMocks: Mock[] = [
  { match: (m, p) => m === 'POST' && p.endsWith('/auth/otp/start'), delayMs: 400, body: () => ({ requestId: 'req_mock_1' }) },
  {
    match: (m, p) => m === 'POST' && p.endsWith('/auth/otp/verify'),
    delayMs: 500,
    // any 6-digit code succeeds in dev; use 000000 to simulate an error if you want
    body: (input) => {
      const code = (input as { code?: string })?.code;
      if (code === '000000') throw { status: 401, code: 'invalid_code', message: 'Incorrect code' };
      return { accessToken: 'dev.access', refreshToken: 'dev.refresh', expiresIn: 3600 };
    },
  },
];

export function findMock(method: string, path: string) {
  return devMocks.find((mk) => mk.match(method, path)) ?? null;
}
