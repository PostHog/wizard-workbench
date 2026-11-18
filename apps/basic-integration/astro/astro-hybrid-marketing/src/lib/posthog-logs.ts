import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let logger: Logger | null | undefined;

export function getPostHogLogger(): Logger | undefined {
  if (logger !== undefined) {
    return logger ?? undefined;
  }

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token) {
    if (import.meta.env.DEV) {
      console.warn(
        'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    logger = null;
    return undefined;
  }

  if (!host) {
    if (import.meta.env.DEV) {
      console.warn(
        'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
      );
    }
    logger = null;
    return undefined;
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  logger = loggerProvider.getLogger('posthog-contact-api');

  return logger;
}
