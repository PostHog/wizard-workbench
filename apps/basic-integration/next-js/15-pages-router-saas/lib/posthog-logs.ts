import 'server-only';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

type LogAttributes = Record<string, boolean | number | string>;

let loggerProvider: LoggerProvider | undefined;

function getPostHogLogger() {
  if (loggerProvider) {
    return loggerProvider.getLogger('posthog-integration');
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      console.error(
        new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        )
      );
    }
    return undefined;
  }

  const exporter = new OTLPLogExporter({
    url: `${host}/i/v1/logs`,
    headers: { Authorization: `Bearer ${projectToken}` }
  });
  loggerProvider = new LoggerProvider({
    processors: [new SimpleLogRecordProcessor({ exporter })]
  });

  return loggerProvider.getLogger('posthog-integration');
}

export async function logPostHogIntegration(
  message: string,
  attributes: LogAttributes
) {
  const logger = getPostHogLogger();
  if (!logger || !loggerProvider) return;

  try {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: message,
      attributes
    });
    await loggerProvider.forceFlush();
  } catch (error) {
    console.error('PostHog log export failed:', error);
  }
}
