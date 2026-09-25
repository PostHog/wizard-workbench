import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let loggerProvider: LoggerProvider | null = null;
let todoLogger: ReturnType<LoggerProvider['getLogger']> | null = null;

if (!projectToken) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    );
  }
} else if (!host) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
    );
  }
} else {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  });

  loggerProvider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })],
  });
  todoLogger = loggerProvider.getLogger('posthog.todo-api');
}

export async function logTodoApiOperation(
  operation: 'created' | 'completion_changed' | 'deleted',
  attributes: Record<string, boolean | number>,
) {
  if (!todoLogger || !loggerProvider) {
    return;
  }

  try {
    todoLogger.emit({
      severityText: 'INFO',
      body: `todo_${operation}`,
      attributes,
    });
    await loggerProvider.forceFlush();
  } catch (error) {
    console.error('Failed to export todo API log:', error);
  }
}
