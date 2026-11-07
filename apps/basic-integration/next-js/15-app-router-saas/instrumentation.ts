import {
  BatchLogRecordProcessor,
  LoggerProvider
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!posthogKey || !posthogHost) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !posthogKey
    ? 'NEXT_PUBLIC_POSTHOG_KEY'
    : 'NEXT_PUBLIC_POSTHOG_HOST';
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthogLoggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-saas'
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

export const posthogLogger = posthogLoggerProvider?.getLogger('posthog-exporter');

export function register() {}
