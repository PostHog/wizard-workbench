import { SeverityNumber } from '@opentelemetry/api-logs';
import { getPostHogLogProvider } from '@/instrumentation';

type TodoOperation =
  | 'todo_created'
  | 'todo_updated'
  | 'todo_completed'
  | 'todo_reopened'
  | 'todo_deleted';

export function logTodoOperation(
  operation: TodoOperation,
  attributes: Record<string, boolean | string>
) {
  const provider = getPostHogLogProvider();
  if (!provider) {
    return;
  }

  provider.getLogger('posthog-todo-operations').emit({
    body: `Todo operation completed: ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation,
      ...attributes,
    },
  });
}

export async function flushPostHogTodoLogs() {
  await getPostHogLogProvider()?.forceFlush();
}
