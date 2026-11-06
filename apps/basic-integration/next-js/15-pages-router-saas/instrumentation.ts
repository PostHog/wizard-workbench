import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'saas-starter'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                'Content-Type': 'application/json'
              },
              timeoutMillis: 2000
            })
          })
        ]
      })
    : new LoggerProvider();

export function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV !== 'production'
  ) {
    if (!posthogKey) {
      console.warn(
        'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
      );
    }

    if (!posthogHost) {
      console.warn(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
  }
}
