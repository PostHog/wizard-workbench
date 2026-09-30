import { SeverityNumber, type Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

let logger: Logger | null | undefined;
let loggerProvider: LoggerProvider | null = null;

export function getPostHogLogger(): Logger | null {
  if (logger !== undefined) return logger;

  const apiKey = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    if (import.meta.env.DEV) {
      const missingVariable = !apiKey
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
    }

    logger = null;
    return logger;
  }

  const exporter = new OTLPLogExporter({
    url: `${apiHost}/i/v1/logs`,
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'astro-hybrid-marketing-api' }),
    processors: [new SimpleLogRecordProcessor(exporter)],
  });
  logger = loggerProvider.getLogger('posthog-contact-api');

  return logger;
}

export async function flushPostHogLogs(): Promise<void> {
  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Log delivery must not change the contact endpoint response.
  }
}

export function logPostHogInfo(body: string, attributes?: Record<string, string | boolean>): void {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body,
    attributes,
  });
}

export function logPostHogError(body: string): void {
  getPostHogLogger()?.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: 'ERROR',
    body,
  });
}
