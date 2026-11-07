import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

type ContactLogAttributes = {
  interest?: string;
  validation_reason?: 'missing_required_fields' | 'invalid_email';
};

let logger: Logger | null = null;
let loggerProvider: LoggerProvider | null = null;
let missingConfigurationWarned = false;
let shutdownHandlerRegistered = false;

function warnAboutMissingConfiguration(): void {
  if (missingConfigurationWarned || import.meta.env.MODE === 'production') return;

  for (const variableName of ['PUBLIC_POSTHOG_PROJECT_TOKEN', 'PUBLIC_POSTHOG_HOST']) {
    if (!import.meta.env[variableName]) {
      console.warn(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }

  missingConfigurationWarned = true;
}

function getContactLogger(): Logger | null {
  if (logger) return logger;

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;
  if (!token || !host) {
    warnAboutMissingConfiguration();
    return null;
  }

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${token}` },
    timeoutMillis: 2000,
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  logger = loggerProvider.getLogger('posthog-contact-api');

  if (!shutdownHandlerRegistered) {
    process.once('beforeExit', () => {
      void shutdownPostHogLogs();
    });
    shutdownHandlerRegistered = true;
  }

  return logger;
}

export function logContactApi(
  severityText: 'INFO' | 'WARN' | 'ERROR',
  body: string,
  attributes?: ContactLogAttributes,
): void {
  getContactLogger()?.emit({ severityText, body, attributes });
}

export async function shutdownPostHogLogs(): Promise<void> {
  await loggerProvider?.shutdown().catch(() => {});
  loggerProvider = null;
  logger = null;
}
