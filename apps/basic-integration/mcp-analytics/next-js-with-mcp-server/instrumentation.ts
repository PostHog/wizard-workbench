import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const missingVariable = !posthogProjectToken
  ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
  : !posthogHost
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : undefined;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'todo-app' }),
  processors:
    posthogProjectToken && posthogHost
      ? [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', posthogHost).toString(),
              headers: {
                Authorization: `Bearer ${posthogProjectToken}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ]
      : [],
});

export function register() {}
