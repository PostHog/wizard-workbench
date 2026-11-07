import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const logProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: { Authorization: `Bearer ${projectToken}` },
            })
          ),
        ],
      })
    : null;

// This dedicated logger exports only records deliberately added by this integration.
export const posthogLog = logProvider?.getLogger('posthog-contacts-api');

export async function shutdownPostHogLogs() {
  if (!logProvider) return;

  let timeout;
  try {
    await Promise.race([
      logProvider.shutdown().catch(() => {}),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, 3000);
        timeout.unref();
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
