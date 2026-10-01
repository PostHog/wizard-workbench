import 'server-only';

import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-integration');

type LogAttributes = Record<string, string | number | boolean>;

export function emitPostHogLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes: LogAttributes
) {
  logger?.emit({ body, severityNumber, attributes });
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
