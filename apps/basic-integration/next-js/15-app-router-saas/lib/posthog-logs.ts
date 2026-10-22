import 'server-only';

import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-integration');

type LogAttributes = Record<string, string | number | boolean>;

export async function logPostHogIntegration(
  body: string,
  attributes: LogAttributes
) {
  if (!loggerProvider || !logger) {
    return;
  }

  logger.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });

  await loggerProvider.forceFlush();
}
