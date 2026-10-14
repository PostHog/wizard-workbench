import type { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | null = null;
let contactLogger: Logger | null = null;

function getContactLogger(): Logger | null {
  if (contactLogger) return contactLogger;

  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (import.meta.env.DEV) {
      throw new Error(
        'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return null;
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error(
        'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
      'service.namespace': 'contact-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });

  // This provider is intentionally not registered globally: only this dedicated
  // logger's purpose-written lines are exported to PostHog.
  contactLogger = loggerProvider.getLogger('posthog.contact_api');
  return contactLogger;
}

export function logContactApi(
  severityText: 'INFO' | 'WARN' | 'ERROR',
  body: string
): void {
  getContactLogger()?.emit({ severityText, body });
}

export async function flushPostHogContactLogs(): Promise<void> {
  await loggerProvider?.forceFlush().catch(() => undefined);
}
