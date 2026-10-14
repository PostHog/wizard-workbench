import 'server-only';

import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLoggerProvider } from '@/instrumentation';

type PostHogLog = {
  body: string;
  attributes: Record<string, string | number | boolean>;
};

const logger = posthogLoggerProvider?.getLogger('posthog-log-capture');

export async function capturePostHogLog({ body, attributes }: PostHogLog) {
  if (!logger || !posthogLoggerProvider) {
    return;
  }

  logger.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });

  try {
    await posthogLoggerProvider.forceFlush();
  } catch {
    // Logging delivery must not change the outcome of the completed action.
  }
}
