import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export let loggerProvider: LoggerProvider | undefined;

if (!posthogKey) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    );
  }
} else if (!posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
    );
  }
} else {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'todo-api' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogKey}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
}

const todoLogger = loggerProvider?.getLogger('posthog-todo-api');

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}

export async function emitTodoApiLog(operation: 'created' | 'completion_changed' | 'deleted') {
  todoLogger?.emit({
    body: 'Todo API operation completed',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: 'todo_api_operation_completed',
      operation,
      status: 'success',
    },
  });

  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Log delivery must not affect the API response.
  }
}
