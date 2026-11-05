import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
let loggerProvider;

if (apiKey && host) {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'native-http-contacts' }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });

  logs.setGlobalLoggerProvider(loggerProvider);
}

export const posthogLogger = logs.getLogger('posthog-exporter');
export const shutdownLogs = () => loggerProvider?.shutdown();
