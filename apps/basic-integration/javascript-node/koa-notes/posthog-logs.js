import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider =
  projectToken && host
    ? new LoggerProvider({
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
            })
          ),
        ],
      })
    : null;

export const posthogLog = loggerProvider?.getLogger('koa-notes-posthog');
