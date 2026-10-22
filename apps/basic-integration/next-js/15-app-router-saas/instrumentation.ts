import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isPostHogConfigured = Boolean(posthogKey && posthogHost);

if (!isPostHogConfigured && process.env.NODE_ENV === 'development') {
  if (!posthogKey) {
    console.error(
      'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
    );
  }

  if (!posthogHost) {
    console.error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }
}

export const posthogLogProvider = isPostHogConfigured
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'nextjs-saas'
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json'
            }
          })
        })
      ]
    })
  : null;

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && posthogLogProvider) {
    logs.setGlobalLoggerProvider(posthogLogProvider);
  }
}
