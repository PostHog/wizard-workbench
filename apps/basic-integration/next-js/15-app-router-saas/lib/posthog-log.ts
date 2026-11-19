import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLog, posthogLoggerProvider } from '@/instrumentation';

type LogAttributes = Record<string, string | number | boolean>;

export async function logPostHogInfo(
  body: string,
  attributes: LogAttributes
) {
  posthogLog?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    attributes
  });
  await posthogLoggerProvider?.forceFlush().catch(() => {});
}
