import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let postHogLogProvider: LoggerProvider | null = null;
let postHogLogger: ReturnType<LoggerProvider['getLogger']> | null = null;

export function getPostHogLogger() {
  if (postHogLogger) {
    return postHogLogger;
  }

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !token
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return null;
  }

  postHogLogProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing-contact-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    ],
  });
  postHogLogger = postHogLogProvider.getLogger('posthog-contact-api');

  return postHogLogger;
}

export async function flushPostHogLogs() {
  await postHogLogProvider?.forceFlush();
}
