// apps/mobile/src/data/dev-mocks.ts
type Mock = {
  match: (m: string, p: string) => boolean;
  delayMs?: number;
  body: (input: unknown) => unknown;
};

export const devMocks: Mock[] = [
  {
    match: (m, p) => m === 'POST' && p.endsWith('/auth/otp/start'),
    delayMs: 400,
    body: () => ({ requestId: 'req_mock_1' }),
  },
  {
    match: (m, p) => m === 'POST' && p.endsWith('/auth/otp/verify'),
    delayMs: 500,
    body: (input) => {
      const code = (input as { code?: string })?.code;
      if (code === '000000') throw { status: 401, code: 'invalid_code', message: 'Incorrect code' };
      return { accessToken: 'dev.access', refreshToken: 'dev.refresh', expiresIn: 3600 };
    },
  },
  {
    match: (m, p) => m === 'POST' && p.endsWith('/transfers'),
    delayMs: 700,
    body: () => ({
      id: `SR-${Date.now().toString(36).toUpperCase()}`,
      status: 'processing',
      createdAt: new Date().toISOString(),
    }),
  },
];

export function findMock(method: string, path: string) {
  return devMocks.find((mk) => mk.match(method, path)) ?? null;
}
