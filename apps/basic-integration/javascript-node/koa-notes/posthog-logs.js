import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider =
  apiKey && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'koa-notes-api',
        }),
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

export const posthogLogger = loggerProvider?.getLogger('koa-notes.posthog');

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  const timeout = new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    timer.unref();
  });

  await Promise.race([loggerProvider.shutdown(), timeout]).catch(() => {});
}
