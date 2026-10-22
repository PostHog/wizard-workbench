import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogLoggerProvider =
  posthogProjectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'next-js-pages-router-saas'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogProjectToken}`,
                'Content-Type': 'application/json'
              }
            })
          })
        ]
      })
    : undefined;

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!posthogLoggerProvider) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !posthogProjectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return;
  }

  logs.setGlobalLoggerProvider(posthogLoggerProvider);
}
