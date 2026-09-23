import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function reportMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

if (!projectToken) {
  reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
} else if (!apiHost) {
  reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_HOST');
}

export const loggerProvider =
  projectToken && apiHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'todo-nextjs-api' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', apiHost).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : null;

const todoLogger = loggerProvider?.getLogger('posthog.todo-api');

type TodoMutation = 'created' | 'updated' | 'deleted';

export function logTodoMutation(mutation: TodoMutation) {
  todoLogger?.emit({
    body: 'Todo API mutation completed',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation: mutation,
      route: '/api/todos',
      outcome: 'success',
    },
  });
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
