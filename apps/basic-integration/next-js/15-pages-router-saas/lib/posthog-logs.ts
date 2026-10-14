import 'server-only';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogIntegrationLogger = loggerProvider.getLogger('posthog-integration');

type LogAttributes = Record<string, string | number | boolean>;

export async function emitPostHogIntegrationLog(
  body: string,
  attributes: LogAttributes
) {
  try {
    posthogIntegrationLogger.emit({
      body,
      severityNumber: SeverityNumber.INFO,
      attributes
    });
    await loggerProvider.forceFlush();
  } catch (error) {
    console.error('PostHog log export error:', error);
  }
}
