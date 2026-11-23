import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let logger: Logger | undefined;

function getPostHogLogger(): Logger | undefined {
  if (logger) return logger;

  const token = import.meta.env.POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.POSTHOG_HOST;

  if (!token || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = token ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
    return undefined;
  }

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-ssr-docs',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ),
    ],
  });
  logger = loggerProvider.getLogger('posthog-astro-ssr-docs');
  return logger;
}

export function logDocumentationServed(pathname: string, statusCode: number): void {
  getPostHogLogger()?.emit({
    severityText: 'info',
    body: 'Documentation page served',
    attributes: {
      route: pathname,
      status_code: statusCode,
    },
  });
}
