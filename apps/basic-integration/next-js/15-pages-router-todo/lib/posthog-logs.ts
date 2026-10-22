import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider, posthogTodoLogger } from '@/instrumentation';

type TodoMutation = 'created' | 'updated' | 'deleted';

export async function logTodoMutation(operation: TodoMutation) {
  if (!loggerProvider || !posthogTodoLogger) {
    return;
  }

  posthogTodoLogger.emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      'todo.operation': operation,
    },
  });

  try {
    await loggerProvider.forceFlush();
  } catch {
    // Log delivery must not affect the API response.
  }
}
