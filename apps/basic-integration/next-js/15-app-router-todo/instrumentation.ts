import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-todo-app',
        }),
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
      })
    : null;

const posthogLogger = loggerProvider?.getLogger('posthog-todo-mutations');

type TodoMutation = 'todo_created' | 'todo_updated' | 'todo_deleted';

export function emitTodoMutationLog(mutation: TodoMutation) {
  posthogLogger?.emit({
    body: 'Todo mutation completed',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: mutation,
    },
  });
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}

export function register() {
  if (!posthogKey || !posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !posthogKey
        ? 'NEXT_PUBLIC_POSTHOG_KEY'
        : 'NEXT_PUBLIC_POSTHOG_HOST';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs' && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
