import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  process.env.NEXT_RUNTIME === 'nodejs' && posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'next-js-mcp-route',
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', posthogHost).toString(),
              timeoutMillis: 2000,
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : undefined;

if (!posthogKey && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
  );
}

export function register() {}

// This dedicated logger is intentionally not installed globally: only log records added here are exported.
export const todoLogger = loggerProvider?.getLogger('posthog.todo-lifecycle');

export const todoLogSeverity = SeverityNumber.INFO;

export function flushPostHogLogs() {
  return loggerProvider?.forceFlush().catch(() => {});
}
