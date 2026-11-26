import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let provider = null;
export let posthogLogLogger = null;

if (token && host) {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${token}` },
  });

  provider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'hono-links-api' }),
    processors: [
      new BatchLogRecordProcessor(exporter, { exportTimeoutMillis: 3000 }),
    ],
  });
  posthogLogLogger = provider.getLogger('hono-links-posthog');
}

export function shutdownPostHogLogs() {
  return provider?.shutdown().catch(() => {});
}
