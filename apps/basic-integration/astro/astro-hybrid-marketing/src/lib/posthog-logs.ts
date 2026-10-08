import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

let posthogLogLogger: Logger | null = null;
let posthogLogProvider: LoggerProvider | null = null;

export function getPostHogLogLogger(): Logger | null {
  const apiKey = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!apiKey) {
    if (import.meta.env.DEV) {
      throw new Error('PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured');
    }
    return null;
  }

  if (!apiHost) {
    if (import.meta.env.DEV) {
      throw new Error('PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured');
    }
    return null;
  }

  if (!posthogLogLogger) {
    posthogLogProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
      }),
      processors: [
        new SimpleLogRecordProcessor(
          new OTLPLogExporter({
            url: `${apiHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }),
        ),
      ],
    });
    posthogLogLogger = posthogLogProvider.getLogger('posthog-contact-api');
  }

  return posthogLogLogger;
}

export async function flushPostHogLogs(): Promise<void> {
  if (posthogLogProvider) {
    await posthogLogProvider.forceFlush();
  }
}
