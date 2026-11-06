import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'native-http-contacts',
        }),
        logRecordProcessors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
              },
            }),
          }),
        ],
      })
    : null;

export const posthogLogger = loggerProvider?.getLogger('posthog-contact-api');

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 3000);

    loggerProvider
      .shutdown()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        resolve();
      });
  });
}
