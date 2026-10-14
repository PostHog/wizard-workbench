import type { Logger } from '@opentelemetry/api-logs';
import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let contactLogger: Logger | null = null;
let logProvider: LoggerProvider | null = null;
let reportedMissingConfiguration = false;

function reportMissingConfiguration(): void {
  if (reportedMissingConfiguration || !import.meta.env.DEV) return;

  if (!import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN) {
    console.error(
      'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    );
  }

  if (!import.meta.env.PUBLIC_POSTHOG_HOST) {
    console.error(
      'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured',
    );
  }

  reportedMissingConfiguration = true;
}

export function getPostHogContactLogger(): Logger {
  if (contactLogger) return contactLogger;

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    reportMissingConfiguration();
    contactLogger = logs.getLogger('posthog-contact-form');
    return contactLogger;
  }

  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
    }),
  });
  logProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${host.replace(/\/$/, '')}/i/v1/logs`,
        headers: { Authorization: `Bearer ${token}` },
      }),
    ),
  );

  contactLogger = logProvider.getLogger('posthog-contact-form');
  return contactLogger;
}

export async function flushPostHogContactLogs(): Promise<void> {
  await logProvider?.forceFlush();
}
