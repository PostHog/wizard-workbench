import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import type { Logger } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let posthogLogger: Logger | undefined;
let isConfigured = false;

export function getPostHogLogger(): Logger | undefined {
  if (isConfigured) {
    return posthogLogger;
  }

  isConfigured = true;

  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !projectToken
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
    return undefined;
  }

  try {
    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing-api',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          }),
        ),
      ],
    });

    posthogLogger = loggerProvider.getLogger('posthog-contact-api');

    process.once('beforeExit', () => {
      void loggerProvider.shutdown().catch(() => {});
    });
  } catch {
    if (import.meta.env.DEV) {
      console.warn('PostHog log exporter could not be initialized.');
    }
  }

  return posthogLogger;
}
