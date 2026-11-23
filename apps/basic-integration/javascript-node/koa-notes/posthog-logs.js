import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let loggerProvider;
export let posthogLogger;

if (apiKey && host) {
  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLogger = loggerProvider.getLogger('koa-notes.posthog');
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, 3000);
    timeoutId.unref();
  });

  try {
    await Promise.race([loggerProvider.shutdown().catch(() => {}), timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}
