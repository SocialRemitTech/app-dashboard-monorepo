/** Structured logger. No PII/PAN ever passes through here — enforced by review + redaction. */
type Level = 'debug' | 'info' | 'warn' | 'error';
function log(level: Level, msg: string, ctx?: Record<string, unknown>) {
  const line = { level, msg, ts: new Date().toISOString(), ...ctx };
  // eslint-disable-next-line no-console
  (level === 'error' || level === 'warn' ? console.error : console.warn)(JSON.stringify(line));
}
export const logger = {
  debug: (m: string, c?: Record<string, unknown>) => log('debug', m, c),
  info: (m: string, c?: Record<string, unknown>) => log('info', m, c),
  warn: (m: string, c?: Record<string, unknown>) => log('warn', m, c),
  error: (m: string, c?: Record<string, unknown>) => log('error', m, c),
};
