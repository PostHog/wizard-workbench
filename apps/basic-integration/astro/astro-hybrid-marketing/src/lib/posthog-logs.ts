import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.PUBLIC_POSTHOG_HOST;

let posthogLogProvider: LoggerProvider | null = null;
let posthogLogger: Logger | null = null;

if (!token || !host) {
  if (import.meta.env.DEV) {
    const missingVariable = !token
      ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'PUBLIC_POSTHOG_HOST';
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  posthogLogProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLogger = posthogLogProvider.getLogger('posthog-contact-form');

  const shutdownLogs = () => {
    void posthogLogProvider?.shutdown().catch(() => {});
  };

  process.once('SIGINT', shutdownLogs);
  process.once('SIGTERM', shutdownLogs);
}

export function getPostHogLogger(): Logger | null {
  return posthogLogger;
}
