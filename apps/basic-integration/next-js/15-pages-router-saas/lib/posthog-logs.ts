import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogExportLogger = loggerProvider?.getLogger('posthog-exporter');

type LogAttributes = Record<string, boolean | number | string>;

export function emitPostHogLog(body: string, attributes: LogAttributes) {
  posthogExportLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}

export async function flushPostHogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Log delivery must not alter the request outcome.
  }
}
