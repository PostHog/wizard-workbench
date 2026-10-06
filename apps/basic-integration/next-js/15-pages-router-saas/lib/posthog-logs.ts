import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

type PostHogLogAttributes = Record<string, boolean | number | string>;

const logger = loggerProvider?.getLogger('posthog-integration');

export async function emitPostHogLog(
  body: string,
  attributes: PostHogLogAttributes,
  severityNumber = SeverityNumber.INFO
) {
  if (!logger || !loggerProvider) {
    return;
  }

  try {
    logger.emit({
      body,
      severityNumber,
      attributes
    });

    await loggerProvider.forceFlush();
  } catch {}
}
