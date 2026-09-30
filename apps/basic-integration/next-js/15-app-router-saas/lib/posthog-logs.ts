import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogLogger = loggerProvider.getLogger('posthog-integration');

type LogAttributes = Record<string, boolean | number | string>;

export async function emitPostHogLog(
  message: string,
  attributes?: LogAttributes
) {
  posthogLogger.emit({
    body: message,
    severityNumber: SeverityNumber.INFO,
    attributes
  });

  await loggerProvider.forceFlush();
}
