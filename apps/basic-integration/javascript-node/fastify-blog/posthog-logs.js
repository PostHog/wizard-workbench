import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider = apiKey && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          timeoutMillis: 2000,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }),
      ),
    ],
  })
  : null;

const posthogLogger = loggerProvider?.getLogger('fastify-blog-posthog');

export function emitPostHogLog(severityText, body, attributes = {}) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  await loggerProvider.shutdown().catch(() => {});
}
