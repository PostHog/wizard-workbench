import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLoggerProvider } from '@/instrumentation';

type PostHogLogAttributes = Record<string, boolean | number | string>;

const posthogLogger = posthogLoggerProvider?.getLogger('posthog-integration');

export function logPostHogInfo(
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
  await posthogLoggerProvider?.forceFlush();
}
