import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog.todo-api');

type TodoLogAttributes = Record<string, boolean | number | string>;

export function logTodoApiOperation(
  body: string,
  attributes: TodoLogAttributes
) {
  logger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes,
  });
}

export async function flushPostHogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Log delivery must not change the API response when the exporter is unavailable.
  }
}
