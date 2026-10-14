import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLoggerProvider } from '@/instrumentation';

const posthogLogger = posthogLoggerProvider?.getLogger('posthog-wizard-logs');

type PostHogLogAttributes = Record<string, string | number | boolean>;

export function emitPostHogLog(
  body: string,
  attributes: PostHogLogAttributes
) {
  posthogLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}

export async function flushPostHogLogs() {
  try {
    await posthogLoggerProvider?.forceFlush();
  } catch {
    // Logging delivery must not alter the API response.
  }
}
