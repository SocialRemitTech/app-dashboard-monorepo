import { http, HttpResponse } from 'msw';

/**
 * MSW handlers — the frontend builds against these BEFORE the backend exists, then flips to the
 * real API without code changes. Keeps the demo alive without setTimeout fakery leaking into prod.
 */
export const handlers = [
  http.post('*/auth/otp/start', () => HttpResponse.json({ requestId: 'req_1' })),
  http.post('*/auth/otp/verify', () =>
    HttpResponse.json({
      accessToken: 'mock.access',
      refreshToken: 'mock.refresh',
      expiresIn: 3600,
    }),
  ),
];
