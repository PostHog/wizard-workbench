import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

type TodoMutation = 'created' | 'updated' | 'deleted';

export async function logTodoMutation(mutation: TodoMutation) {
  if (!loggerProvider) {
    return;
  }

  const logger = loggerProvider.getLogger('posthog-todo-api');
  logger.emit({
    body: `todo_${mutation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      mutation,
      route: '/api/todos',
    },
  });

  await loggerProvider.forceFlush();
}
