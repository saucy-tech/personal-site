type LogLevel = 'info' | 'warn' | 'error';

/**
 * Single-line JSON logs for Cloudflare Workers Logs (`wrangler tail`) / grep-friendly monitoring.
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
    // Keep retained logs operational. Provider bodies, IPs, query values and
    // exception messages can contain subscriber or payment data.
    ...(typeof fields?.endpoint === 'string' ? { endpoint: fields.endpoint } : {}),
    ...(typeof fields?.status === 'number' ? { status: fields.status } : {}),
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

export function logApiEvent(
  level: LogLevel,
  endpoint: string,
  event: string,
  fields?: Record<string, unknown>
): void {
  logStructured(level, event, {
    endpoint,
    ...fields,
  });
}
