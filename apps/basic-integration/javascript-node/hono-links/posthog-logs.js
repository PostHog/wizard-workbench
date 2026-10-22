import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.POSTHOG_KEY;
const posthogHost = process.env.POSTHOG_HOST;

const posthogLogProvider = posthogKey && posthogHost
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'hono-links-api',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogKey}`,
            },
          })
        ),
      ],
    })
  : null;

const posthogLogger = posthogLogProvider?.getLogger('posthog-hono-links');

export function logPosthog(severityText, body, attributes = {}) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPosthogLogs() {
  await posthogLogProvider?.shutdown();
}
