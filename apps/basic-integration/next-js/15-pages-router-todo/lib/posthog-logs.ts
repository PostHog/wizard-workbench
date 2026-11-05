import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const todoApiLogger = loggerProvider?.getLogger('posthog-todo-api');

type TodoApiOperation = 'todo_created' | 'todo_updated' | 'todo_deleted';

export async function logTodoApiOperation(operation: TodoApiOperation) {
  if (!todoApiLogger || !loggerProvider) {
    return;
  }

  try {
    todoApiLogger.emit({
      body: 'Todo API operation completed',
      severityNumber: SeverityNumber.INFO,
      attributes: {
        operation,
        route: '/api/todos',
      },
    });
    await loggerProvider.forceFlush();
  } catch (error) {
    console.error('PostHog todo API log export failed:', error);
  }
}
