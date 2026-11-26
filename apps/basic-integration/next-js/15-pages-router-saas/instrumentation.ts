import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!posthogKey || !posthogHost) && process.env.NODE_ENV !== 'production') {
  const missingVariable = posthogKey
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_KEY';

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthogLoggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'next-js-saas'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', posthogHost).toString(),
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                'Content-Type': 'application/json'
              },
              timeoutMillis: 2000
            })
          })
        ]
      })
    : null;

export const posthogLogger = posthogLoggerProvider?.getLogger(
  'posthog-exporter'
);

export async function flushPostHogLogs() {
  await posthogLoggerProvider?.forceFlush().catch(() => {});
}

export function register() {
  if (!posthogLoggerProvider || process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  process.once('beforeExit', () => {
    void posthogLoggerProvider.shutdown().catch(() => {});
  });
}
