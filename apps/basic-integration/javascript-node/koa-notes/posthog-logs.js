import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;
export let posthogLogger = null;

if (token && host) {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${token}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLogger = loggerProvider.getLogger('posthog-integration');
}

export function shutdownPostHogLogs() {
  if (!loggerProvider) return Promise.resolve();

  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, 3000);
    loggerProvider
      .shutdown()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        resolve();
      });
  });
}
