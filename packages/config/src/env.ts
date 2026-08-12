import { z } from 'zod';

/** Runtime env is validated once at boot; a missing/invalid var fails fast, never silently. */
const EnvSchema = z.object({
  API_BASE_URL: z.string().url(),
  ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  SENTRY_DSN: z.string().optional(),
  ANALYTICS_KEY: z.string().optional(),
  FEATURE_FLAGS_KEY: z.string().optional(),
});
export type Env = z.infer<typeof EnvSchema>;

export function parseEnv(raw: Record<string, string | undefined>): Env {
  const result = EnvSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${result.error.toString()}`);
  }
  return result.data;
}
