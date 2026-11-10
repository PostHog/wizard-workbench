import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let loggerProvider: LoggerProvider | undefined;
let todoApiLogger: ReturnType<LoggerProvider['getLogger']> | undefined;

if (token && host) {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-api' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeoutMillis: 2000,
        }),
      }),
    ],
  });

  todoApiLogger = loggerProvider.getLogger('posthog.todo-api');
} else if (process.env.NODE_ENV !== 'production') {
  if (!token) {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    );
  }

  if (!host) {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }
}

export function register() {
  // Next.js loads this module to initialize server instrumentation.
}

export async function logTodoMutation(operation: 'created' | 'updated' | 'deleted') {
  if (!todoApiLogger || !loggerProvider) return;

  todoApiLogger.emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      endpoint: operation === 'created' ? '/api/todos' : '/api/todos/[id]',
      method: operation === 'created' ? 'POST' : operation === 'updated' ? 'PATCH' : 'DELETE',
      operation: `todo_${operation}`,
    },
  });

  await loggerProvider.forceFlush().catch(() => {});
}
