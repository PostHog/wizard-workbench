import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider = projectToken && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'hono-links-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
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

export const posthogLogger = loggerProvider?.getLogger('hono-links-posthog') ?? null;

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  let timeout;
  try {
    await Promise.race([
      loggerProvider.shutdown(),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, 3000);
      }),
    ]);
  } catch {
    // Logging must not prevent a graceful application shutdown.
  } finally {
    clearTimeout(timeout);
  }
}
