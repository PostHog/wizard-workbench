import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

if ((!apiKey || !host) && process.env.NODE_ENV !== 'production') {
  const missingVariable = apiKey ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const logProvider = apiKey && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'koa-notes' }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${apiKey}` },
        })
      ),
    ],
  })
  : null;

// This provider is deliberately not registered globally: only this run's logger exports to PostHog.
export const posthogLog = logProvider ? logProvider.getLogger('posthog-exporter') : null;

export async function shutdownPostHogLogs() {
  await logProvider?.shutdown();
}
