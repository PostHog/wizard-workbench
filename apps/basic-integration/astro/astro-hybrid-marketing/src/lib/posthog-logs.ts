import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let posthogLogger: Logger | null | undefined;
let posthogLoggerProvider: LoggerProvider | null = null;

/**
 * Returns the dedicated logger for records intentionally exported to PostHog.
 * Existing application loggers are not connected to this exporter.
 */
export function getPostHogLogger(): Logger | null {
  if (posthogLogger !== undefined) {
    return posthogLogger;
  }

  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !projectToken
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    posthogLogger = null;
    return posthogLogger;
  }

  posthogLoggerProvider = new LoggerProvider({
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

  posthogLogger = posthogLoggerProvider.getLogger('posthog-contact-api');
  return posthogLogger;
}

/** Flushes records before an API route returns in a short-lived runtime. */
export async function flushPostHogLogs(): Promise<void> {
  try {
    await posthogLoggerProvider?.forceFlush();
  } catch {
    // Log delivery must not change the API response.
  }
}
