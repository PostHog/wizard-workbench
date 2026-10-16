import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogLogsEnabled = Boolean(posthogProjectToken && posthogHost);

if (!posthogProjectToken && process.env.NODE_ENV === 'development') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (!posthogHost && process.env.NODE_ENV === 'development') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
  );
}

const processors = [];

if (posthogProjectToken && posthogHost) {
  processors.push(
    new BatchLogRecordProcessor({
      exporter: new OTLPLogExporter({
        url: new URL('/i/v1/logs', posthogHost).toString(),
        headers: {
          Authorization: `Bearer ${posthogProjectToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
  );
}

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'next-pages-router-todo' }),
  processors,
});

export function register() {}
