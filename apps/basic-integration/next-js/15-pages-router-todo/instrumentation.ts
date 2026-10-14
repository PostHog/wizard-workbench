import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | null = null;

function reportMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || loggerProvider) {
    return;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
    return;
  }

  if (!host) {
    reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_HOST');
    return;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'todo-api',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });

  logs.setGlobalLoggerProvider(loggerProvider);
}

export function logTodoOperation(operation: 'created' | 'completion_updated' | 'deleted') {
  loggerProvider?.getLogger('posthog-todo-api').emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: 'todo.operation_completed',
      todo_operation: operation,
      outcome: 'success',
    },
  });
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
