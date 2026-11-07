import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let logger: Logger | null = null;
let configurationWarningShown = false;

export function getPostHogLogger(): Logger | null {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (!import.meta.env.PROD && !configurationWarningShown) {
      const missingVariable = !projectToken
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
      configurationWarningShown = true;
    }
    return null;
  }

  if (!logger) {
    const provider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'astro-hybrid-marketing',
        'deployment.environment': import.meta.env.MODE,
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: { Authorization: `Bearer ${projectToken}` },
          }),
        ),
      ],
    });

    logger = provider.getLogger('posthog-contact-outcomes');
  }

  return logger;
}
