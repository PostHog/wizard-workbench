import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogLogger = loggerProvider?.getLogger('posthog-log-capture');

export function logPostHogOperation(operation: string) {
  posthogLogger?.emit({
    body: `Application operation completed: ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: { operation }
  });
}
