import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

let loggerProvider = null;

if (posthogApiKey && posthogHost) {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', posthogHost).toString(),
    headers: {
      Authorization: `Bearer ${posthogApiKey}`,
    },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
}

export const posthogLogger = loggerProvider?.getLogger('fastify-blog.posthog');

let shutdownPromise;

export function shutdownPostHogLogs() {
  if (!loggerProvider) return Promise.resolve();

  shutdownPromise ??= Promise.race([
    loggerProvider.shutdown(),
    new Promise((resolve) => {
      const timeout = setTimeout(resolve, 3000);
      timeout.unref();
    }),
  ]).catch(() => {});

  return shutdownPromise;
}
