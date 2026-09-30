import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

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
}

const loggerProvider =
  projectToken && host
    ? new LoggerProvider({
        processors: [
          new SimpleLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: { Authorization: `Bearer ${projectToken}` },
            }),
          }),
        ],
      })
    : null;

const todoLogger = loggerProvider
  ? loggerProvider.getLogger('posthog.todo-api')
  : null;

export async function logTodoMutation(
  operation: 'created' | 'updated' | 'deleted'
) {
  if (!todoLogger || !loggerProvider) return;

  try {
    todoLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: `Todo ${operation}`,
      attributes: { 'todo.operation': operation },
    });
    await loggerProvider.forceFlush();
  } catch {
    // Log delivery must not change the outcome of a todo mutation.
  }
}
