import { SeverityNumber } from '@opentelemetry/api-logs';
import { after } from 'next/server';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider.getLogger('posthog-todo-api');

type TodoOperation = 'created' | 'updated' | 'deleted';

export function logTodoOperation(operation: TodoOperation) {
  logger.emit({
    body: `todo_${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      endpoint: '/api/todos',
      operation,
    },
  });

  after(() => loggerProvider.forceFlush().catch(() => {}));
}
