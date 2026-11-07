import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-todo-api');

export async function logTodoCreated() {
  logger?.emit({
    body: 'Todo created through API',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation: 'todo_created',
      http_status_code: 201,
    },
  });
  await loggerProvider?.forceFlush().catch(() => {});
}

export async function logTodoCompletionChanged(completed: boolean) {
  logger?.emit({
    body: 'Todo completion changed through API',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation: 'todo_completion_changed',
      completed,
      http_status_code: 200,
    },
  });
  await loggerProvider?.forceFlush().catch(() => {});
}

export async function logTodoDeleted() {
  logger?.emit({
    body: 'Todo deleted through API',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation: 'todo_deleted',
      http_status_code: 200,
    },
  });
  await loggerProvider?.forceFlush().catch(() => {});
}
