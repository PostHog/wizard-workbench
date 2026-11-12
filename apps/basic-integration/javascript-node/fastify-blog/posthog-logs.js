import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const posthogLoggerProvider = projectToken && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  })
  : null;

export const posthogLogger = posthogLoggerProvider?.getLogger('posthog-blog-logs') ?? null;

export async function shutdownPosthogLogger() {
  if (!posthogLoggerProvider) return;

  let timeout;
  await Promise.race([
    posthogLoggerProvider.shutdown().catch(() => {}),
    new Promise((resolve) => {
      timeout = setTimeout(resolve, 3000);
      timeout.unref?.();
    }),
  ]).finally(() => clearTimeout(timeout));
}
