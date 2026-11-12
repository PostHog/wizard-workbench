import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-integration');

type LogAttributes = Record<string, string | number | boolean>;

export function logPostHogInfo(
  body: string,
  attributes: LogAttributes
): void {
  logger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}
