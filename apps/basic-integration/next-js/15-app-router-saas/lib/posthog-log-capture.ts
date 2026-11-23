import 'server-only';

import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-log-capture');

export function capturePostHogLog(
  body: string,
  attributes: Record<string, string | boolean>
) {
  logger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}
