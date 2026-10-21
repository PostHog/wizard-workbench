import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const loggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-pages-router-todo',
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', posthogHost).toString(),
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : undefined;

const todoApiLogger = loggerProvider?.getLogger('posthog-todo-api');

export function logTodoApiActivity(
  body: string,
  attributes: Record<string, string | boolean>,
) {
  todoApiLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes,
  });
}

export async function flushPosthogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch (error) {
    console.error('Failed to flush PostHog logs:', error);
  }
}

export function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    (!posthogKey || !posthogHost) &&
    process.env.NODE_ENV === 'development'
  ) {
    const missingVariable = !posthogKey
      ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'NEXT_PUBLIC_POSTHOG_HOST';

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}
