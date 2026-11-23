import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider =
  apiKey && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: { Authorization: `Bearer ${apiKey}` },
            })
          ),
        ],
      })
    : null;

export const posthogLogger = loggerProvider?.getLogger('posthog-contacts-api') ?? null;

export async function shutdownPosthogLogs() {
  if (loggerProvider) await loggerProvider.shutdown().catch(() => {});
}
