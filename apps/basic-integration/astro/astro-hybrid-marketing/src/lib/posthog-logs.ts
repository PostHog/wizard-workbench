import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let contactLogger: ReturnType<LoggerProvider['getLogger']> | null = null;
let logProvider: LoggerProvider | null = null;
let initialized = false;

function getContactLogger() {
  if (initialized) return contactLogger;
  initialized = true;

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (import.meta.env.DEV) {
      const variableName = token
        ? 'PUBLIC_POSTHOG_HOST'
        : 'PUBLIC_POSTHOG_PROJECT_TOKEN';
      console.warn(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
    return null;
  }

  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'astro-hybrid-marketing',
      'deployment.environment': import.meta.env.MODE,
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${token}` },
          timeoutMillis: 2000,
        }),
      ),
    ],
  });

  contactLogger = logProvider.getLogger('posthog-contact-api');
  return contactLogger;
}

export function logContactApiOutcome(
  severityText: 'INFO' | 'WARN' | 'ERROR',
  body: string,
  attributes: Record<string, string>,
): void {
  getContactLogger()?.emit({ severityText, body, attributes });
}

process.once('SIGTERM', () => {
  void logProvider?.shutdown().catch(() => {});
});
