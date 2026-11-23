import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const logExporter = apiKey && host
  ? new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  : null;

const logProvider = logExporter
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'fastify-blog',
      }),
      processors: [new BatchLogRecordProcessor(logExporter)],
    })
  : null;

export const posthogLog = logProvider?.getLogger('fastify-blog-posthog') ?? null;

export function shutdownPostHogLogs() {
  if (!logProvider) {
    return Promise.resolve();
  }

  const timeout = new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    timer.unref();
  });

  return Promise.race([logProvider.shutdown(), timeout]);
}
