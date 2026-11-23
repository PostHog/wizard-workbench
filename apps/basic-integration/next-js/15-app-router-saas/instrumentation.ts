import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  token && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'next-js-saas'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }),
            exportTimeoutMillis: 2000
          })
        ]
      })
    : null;

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!loggerProvider) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  process.once('beforeExit', () => {
    void loggerProvider.shutdown().catch(() => {});
  });
}
