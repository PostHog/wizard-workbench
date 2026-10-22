import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let posthogLogProvider: LoggerProvider | null | undefined;

function getPostHogLogProvider(): LoggerProvider | null {
  if (posthogLogProvider !== undefined) {
    return posthogLogProvider;
  }

  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !projectToken
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    posthogLogProvider = null;
    return posthogLogProvider;
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${projectToken}` },
  });

  posthogLogProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing-contact-api',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });

  return posthogLogProvider;
}

// This provider is intentionally not registered globally: only log lines added
// for this integration and emitted through this logger are exported.
export function getPostHogContactLogger() {
  return getPostHogLogProvider()?.getLogger('posthog-contact-api');
}

export async function flushPostHogLogs(): Promise<void> {
  await getPostHogLogProvider()?.forceFlush();
}
