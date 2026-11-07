import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const hasPostHogLogConfiguration = posthogKey && posthogHost;

if (!hasPostHogLogConfiguration && process.env.NODE_ENV !== 'production') {
  const missingVariable = posthogKey
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-api' }),
  processors: hasPostHogLogConfiguration
    ? [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', posthogHost).toString(),
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json',
            },
          })
        ),
      ]
    : [],
});

export function register() {
  // The Pages Router API routes obtain their logger directly from this provider.
}
