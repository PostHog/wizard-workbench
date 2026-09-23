import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variableName) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }

  return null;
}

const logProvider =
  apiKey && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'hono-links',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: { Authorization: `Bearer ${apiKey}` },
            })
          ),
        ],
      })
    : missingConfiguration(apiKey ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY');

export const posthogLogger = logProvider?.getLogger('hono-links.posthog');

export async function shutdownPostHogLogs() {
  await logProvider?.shutdown();
}
