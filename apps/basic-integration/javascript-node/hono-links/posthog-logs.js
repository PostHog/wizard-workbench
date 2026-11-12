import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const posthogLogProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'hono-links-api',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: { Authorization: `Bearer ${projectToken}` },
            })
          ),
        ],
      })
    : null;

export const posthogLogger = posthogLogProvider?.getLogger('posthog-exporter');

export async function shutdownPostHogLogs() {
  if (!posthogLogProvider) return;

  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 3000);
    posthogLogProvider.shutdown().catch(() => {}).finally(() => {
      clearTimeout(timeout);
      resolve();
    });
  });
}
