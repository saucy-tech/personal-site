type LogLevel = 'info' | 'warn' | 'error';

/**
 * Single-line JSON logs for Vercel log drains / grep-friendly monitoring.
 */
export function logStructured(
  level: LogLevel,
  event: string,
  fields?: Record<string, unknown>
): void {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...fields,
  };
  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}
