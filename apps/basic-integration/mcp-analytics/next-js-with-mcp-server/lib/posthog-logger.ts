import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogLogger = loggerProvider.getLogger('posthog-todo-operations');

export function logTodoOperation(
  operation: 'created' | 'updated' | 'deleted',
  attributes: Record<string, boolean>
) {
  posthogLogger.emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation,
      ...attributes,
    },
  });
}

export async function flushPostHogLogs() {
  await loggerProvider.forceFlush().catch(() => {});
}
