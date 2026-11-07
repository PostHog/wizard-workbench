import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const missingVariable = !posthogKey
  ? 'NEXT_PUBLIC_POSTHOG_KEY'
  : !posthogHost
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : null;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const processors = posthogKey && posthogHost
  ? [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogKey}`,
            'Content-Type': 'application/json',
          },
          timeoutMillis: 2000,
        }),
      }),
    ]
  : [];

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-app' }),
  processors,
});

// This logger is intentionally isolated so only log records added by this integration are exported.
export const posthogLogger = loggerProvider.getLogger('posthog-todo-api');

export const posthogLogSeverity = SeverityNumber;

export function register() {}
