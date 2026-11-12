import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;

if (projectToken && host) {
  try {
    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'native-http-contacts-api',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${projectToken}` },
            timeoutMillis: 3000,
          })
        ),
      ],
    });
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('PostHog log exporter could not be configured; log capture is disabled.');
    }
  }
}

const logger = loggerProvider?.getLogger('posthog-logs') ?? null;

export function logPostHog(level, message, attributes = {}) {
  if (!logger) return;

  try {
    logger.emit({ severityText: level, body: message, attributes });
  } catch {}
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;
  await loggerProvider.shutdown().catch(() => {});
}
