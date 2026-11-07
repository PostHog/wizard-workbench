import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  posthogProjectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-pages-router-saas'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogProjectToken}`,
                'Content-Type': 'application/json'
              }
            })
          })
        ]
      })
    : undefined;

if (!loggerProvider && process.env.NODE_ENV !== 'production') {
  if (!posthogProjectToken) {
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

if (loggerProvider) {
  process.once('SIGTERM', () => {
    void loggerProvider.shutdown().catch(() => {});
  });
}

export function register() {}
