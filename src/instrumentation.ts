export async function register(): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn,
      tracesSampleRate: 0.05,
    });
  }
}
