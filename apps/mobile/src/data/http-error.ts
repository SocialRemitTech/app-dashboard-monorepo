import { ApiError } from '@sr/api-contract';

/** One error type the whole app catches. Network/parse/HTTP all normalise to this. */
export class AppError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly correlationId?: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromResponse(status: number, body: unknown, correlationId?: string): AppError {
    const parsed = ApiError.safeParse(body);
    if (parsed.success) {
      return new AppError(
        parsed.data.code,
        parsed.data.message,
        parsed.data.correlationId ?? correlationId,
        status,
      );
    }
    return new AppError('unknown_error', `Request failed (${status})`, correlationId, status);
  }
}
