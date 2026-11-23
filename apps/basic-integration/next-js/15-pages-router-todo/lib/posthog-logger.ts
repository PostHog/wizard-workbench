import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLoggerProvider } from '@/instrumentation';

type TodoOperation = 'created' | 'completion_changed' | 'deleted';

const todoApiLogger = posthogLoggerProvider?.getLogger('posthog-todo-api');

export async function logTodoOperation(
  operation: TodoOperation,
  completed?: boolean,
) {
  todoApiLogger?.emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      'todo.operation': operation,
      ...(completed === undefined ? {} : { 'todo.completed': completed }),
    },
  });

  if (posthogLoggerProvider) {
    await posthogLoggerProvider.forceFlush().catch(() => {});
  }
}
