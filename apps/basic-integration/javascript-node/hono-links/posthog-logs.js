import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider = apiKey && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'hono-links',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${apiKey}` },
            timeoutMillis: 3000,
          })
        ),
      ],
    })
  : undefined;

export const posthogLogger = loggerProvider?.getLogger('posthog-integration');

export async function shutdownPosthogLogs() {
  await loggerProvider?.shutdown().catch(() => {});
}
