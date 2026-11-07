import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;
let loggerProvider;
let posthogLogger;

if (posthogProjectToken && posthogHost) {
  try {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', posthogHost).toString(),
      headers: { Authorization: `Bearer ${posthogProjectToken}` },
    });

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'native-http-contacts',
      }),
      processors: [new BatchLogRecordProcessor(exporter)],
    });
    posthogLogger = loggerProvider.getLogger('native-http-contacts-posthog-logs');
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('PostHog log capture could not be initialized');
    }
  }
}

export function logPostHogLog(record) {
  try {
    posthogLogger?.emit(record);
  } catch {}
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 3000);
    loggerProvider.shutdown().catch(() => {}).finally(() => {
      clearTimeout(timeout);
      resolve();
    });
  });
}
