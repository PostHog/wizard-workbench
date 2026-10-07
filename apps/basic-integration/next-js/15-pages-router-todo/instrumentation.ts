import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function getLoggerProvider() {
  if (!projectToken) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
      );
    }

    return null;
  }

  if (!posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
      );
    }

    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-app' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
}

export const loggerProvider = getLoggerProvider();

export function register() {}
