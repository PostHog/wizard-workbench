import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let logger: Logger | null = null;
let provider: LoggerProvider | null = null;
let shutdownRegistered = false;

function warnAboutMissingConfiguration(variableName: string): void {
  if (import.meta.env.DEV) {
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

/**
 * Returns the dedicated logger whose records are exported to PostHog.
 * Existing application console logs intentionally remain outside this exporter.
 */
export function getPostHogLogLogger(): Logger | null {
  if (logger) {
    return logger;
  }

  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    warnAboutMissingConfiguration('PUBLIC_POSTHOG_PROJECT_TOKEN');
    return null;
  }

  if (!host) {
    warnAboutMissingConfiguration('PUBLIC_POSTHOG_HOST');
    return null;
  }

  provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
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
  logger = provider.getLogger('posthog-contact-route');

  if (!shutdownRegistered && typeof process !== 'undefined') {
    shutdownRegistered = true;
    process.once('beforeExit', () => {
      void provider?.shutdown().catch(() => {});
    });
  }

  return logger;
}
