import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider =
  token && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'hono-links-api',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: { Authorization: `Bearer ${token}` },
            }),
            { exportTimeoutMillis: 3000 }
          ),
        ],
      })
    : null;

export const posthogLog = loggerProvider?.getLogger('hono-links-posthog-export') ?? null;

export function shutdownPostHogLogs() {
  return loggerProvider?.shutdown().catch(() => {});
}
