import { SeverityNumber } from '@opentelemetry/api-logs';
import { after } from 'next/server';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-integration');

type LogAttributes = Record<string, string | number | boolean>;

export function logPostHogInfo(message: string, attributes: LogAttributes) {
  logger?.emit({
    body: message,
    severityNumber: SeverityNumber.INFO,
    attributes
  });

  const provider = loggerProvider;
  if (provider) {
    after(async () => {
      await provider.forceFlush().catch(() => {});
    });
  }
}
