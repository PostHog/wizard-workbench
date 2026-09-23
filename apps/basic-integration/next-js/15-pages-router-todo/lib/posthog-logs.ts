import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | undefined;

export function initializePostHogLogs() {
  if (loggerProvider) {
    return;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  loggerProvider = new LoggerProvider({
    processors: [
      new SimpleLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      }),
    ],
  });
  logs.setGlobalLoggerProvider(loggerProvider);
}

const todoLogger = logs.getLogger('posthog.todo_operations');

export function logTodoOperation(operation: 'created' | 'completion_changed' | 'deleted') {
  todoLogger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: `Todo ${operation}`,
    attributes: {
      'todo.operation': operation,
    },
  });
}

export async function flushPostHogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Log export is best-effort and must not affect the todo API response.
  }
}
