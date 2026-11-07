import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;

export const posthogLogger = projectToken && host
  ? (() => {
      const provider = new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'koa-notes-api',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
              },
              timeoutMillis: 3000,
            }),
            { exportTimeoutMillis: 3000 }
          ),
        ],
      });

      loggerProvider = provider;
      return provider.getLogger('koa-notes-posthog');
    })()
  : null;

export async function shutdownPosthogLogs() {
  await loggerProvider?.shutdown().catch(() => {});
}
