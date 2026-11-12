import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const posthogLogProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'koa-notes-api',
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
              },
            })
          ),
        ],
      })
    : null;

const posthogLogger = posthogLogProvider?.getLogger('koa-notes-posthog');

export function capturePosthogLog(severityText, body, attributes) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPosthogLogs() {
  if (!posthogLogProvider) {
    return;
  }

  let timeout;
  const timeoutPromise = new Promise((resolve) => {
    timeout = setTimeout(resolve, 3000);
  });

  await Promise.race([posthogLogProvider.shutdown().catch(() => {}), timeoutPromise]);
  clearTimeout(timeout);
}
