// Wrapper minimalista de logging. Hoy delega en console.* pero centraliza
// las llamadas para que cuando se instale Sentry (u otro APM), conectarlo
// sea una sola edición de este archivo.
//
// Cuando configuren Sentry:
//   1. npm install @sentry/nextjs
//   2. npx @sentry/wizard@latest -i nextjs  (genera sentry.client/server.config.ts)
//   3. setear SENTRY_DSN en .env.local
//   4. en `captureError` de abajo, reemplazar el console.error por:
//        Sentry.captureException(err, { extra: context });
//      y en `captureMessage`: Sentry.captureMessage(msg, { level, extra: context });

export type LogContext = Record<string, unknown>;

export function captureError(
  err: unknown,
  context: LogContext = {}
): void {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  // Una sola línea estructurada — fácil de parsear en Vercel logs / Datadog.
  console.error(
    JSON.stringify({
      level: 'error',
      message,
      stack,
      ...context,
    })
  );
}

export function captureMessage(
  message: string,
  level: 'info' | 'warn' = 'info',
  context: LogContext = {}
): void {
  const fn = level === 'warn' ? console.warn : console.log;
  fn(
    JSON.stringify({
      level,
      message,
      ...context,
    })
  );
}
