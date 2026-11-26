import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let loggerProvider;
let shutdownPromise;

export const posthogLogger =
  projectToken && host
    ? (() => {
        loggerProvider = new LoggerProvider({
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
        });

        return loggerProvider.getLogger('posthog-log-capture');
      })()
    : null;

export function shutdownPostHogLogs() {
  if (!loggerProvider) return Promise.resolve();

  shutdownPromise ??= Promise.race([
    loggerProvider.shutdown(),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);

  return shutdownPromise;
}
