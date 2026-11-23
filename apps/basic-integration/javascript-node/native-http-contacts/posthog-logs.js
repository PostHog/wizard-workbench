import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider =
  token && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: { Authorization: `Bearer ${token}` },
            })
          ),
        ],
      })
    : null;

const posthogLogger = loggerProvider?.getLogger('native-http-contacts.posthog');

export function capturePostHogLog(severityText, body, attributes) {
  try {
    posthogLogger?.emit({ severityText, body, attributes });
  } catch {
    // Keep log capture failures from affecting the API response.
  }
}

export function shutdownPostHogLogs() {
  if (!loggerProvider) return Promise.resolve();

  return Promise.race([
    loggerProvider.shutdown(),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]).catch(() => {});
}
