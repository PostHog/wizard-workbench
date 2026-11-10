import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

const loggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'koa-notes-api',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
              headers: { Authorization: `Bearer ${posthogKey}` },
            }),
            { exportTimeoutMillis: 3000 }
          ),
        ],
      })
    : null;

export const posthogLogger = loggerProvider?.getLogger('koa-notes-posthog-logs') ?? null;

export async function shutdownPostHogLogs() {
  await loggerProvider?.shutdown();
}
