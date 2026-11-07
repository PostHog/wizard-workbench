import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

export let posthogLogsLogger = null;
let loggerProvider = null;

if (token && host) {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${token}` },
  });
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'hono-links' }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });

  posthogLogsLogger = loggerProvider.getLogger('hono-links-posthog');
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) {
    return;
  }

  await Promise.race([
    loggerProvider.shutdown(),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
}
