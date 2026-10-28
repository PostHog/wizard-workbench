import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider = apiKey && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'koa-notes',
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${apiKey}` },
          }),
        }),
      ],
    })
  : null;

export const posthogLogger = loggerProvider?.getLogger('koa-notes-posthog');
