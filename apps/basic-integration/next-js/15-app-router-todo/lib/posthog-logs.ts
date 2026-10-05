import { SeverityNumber } from '@opentelemetry/api-logs';
import { getPostHogLogProvider } from '@/instrumentation';

type TodoLogOperation =
  | 'todo_created'
  | 'todo_completion_changed'
  | 'todo_deleted';

const loggerName = 'posthog-todo-api';

export function logTodoOperation(
  operation: TodoLogOperation,
  attributes?: Record<string, boolean>,
) {
  const loggerProvider = getPostHogLogProvider();

  if (!loggerProvider) {
    return;
  }

  loggerProvider.getLogger(loggerName).emit({
    body: 'Todo API operation completed',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation,
      outcome: 'success',
      ...attributes,
    },
  });
}

export async function flushPostHogLogs() {
  const loggerProvider = getPostHogLogProvider();

  if (loggerProvider) {
    await loggerProvider.forceFlush();
  }
}
