import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogProjectToken && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
  );
}

export const loggerProvider = posthogProjectToken && posthogHost
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'todo-app' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            timeoutMillis: 2_000,
            headers: {
              Authorization: `Bearer ${posthogProjectToken}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : undefined;

export const todoApiLogger = loggerProvider?.getLogger('posthog.todo-api');

export function logTodoMutation(operation: string, statusCode: number) {
  todoApiLogger?.emit({
    body: 'Todo API mutation completed',
    severityNumber: SeverityNumber.INFO,
    attributes: { operation, status_code: statusCode },
  });
}

export function flushPostHogLogs() {
  return loggerProvider?.forceFlush().catch(() => {});
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
