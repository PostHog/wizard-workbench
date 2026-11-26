import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let loggerProvider = null;

export let posthogLogger = null;

if (token && host) {
  try {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: { Authorization: `Bearer ${token}` },
    });
    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'fastify-blog' }),
      processors: [new BatchLogRecordProcessor(exporter)],
    });
    posthogLogger = loggerProvider.getLogger('posthog-blog-lifecycle');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('PostHog log export could not be initialized', error);
    }
  }
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, 3000);
  });

  await Promise.race([loggerProvider.shutdown(), timeout]).catch(() => {});
  clearTimeout(timeoutId);
}
