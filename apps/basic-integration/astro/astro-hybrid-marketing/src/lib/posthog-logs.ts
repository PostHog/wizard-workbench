import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | null = null;
let contactLogger: ReturnType<LoggerProvider['getLogger']> | null = null;
let configurationWarningEmitted = false;

function getContactLogger(): ReturnType<LoggerProvider['getLogger']> | null {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.DEV && !configurationWarningEmitted) {
      const missingVariable = !projectToken
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
      configurationWarningEmitted = true;
    }
    return null;
  }

  if (!contactLogger) {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: { Authorization: `Bearer ${projectToken}` },
    });

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      processors: [new BatchLogRecordProcessor(exporter)],
    });
    contactLogger = loggerProvider.getLogger('posthog-contact-api');

    process.once('SIGTERM', () => {
      void loggerProvider?.shutdown().catch(() => {});
    });
  }

  return contactLogger;
}

export function emitContactLog(
  severityText: 'info' | 'warn' | 'error',
  body: string,
  attributes?: Record<string, string>,
): void {
  try {
    getContactLogger()?.emit({ severityText, body, attributes });
  } catch {
    // Log delivery must not affect the contact request.
  }
}
