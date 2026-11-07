import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider = apiKey && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    processors: [
      new BatchLogRecordProcessor(new OTLPLogExporter({
        url: `${host}/i/v1/logs`,
        headers: { Authorization: `Bearer ${apiKey}` },
      })),
    ],
  })
  : null;

const posthogLogger = loggerProvider?.getLogger('fastify-blog.posthog');

export function emitPostHogLog(severityText, body, attributes) {
  if (!posthogLogger) return;

  try {
    posthogLogger.emit({ severityText, body, attributes });
  } catch {
    // Log delivery must not interrupt API requests.
  }
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, 3000);
  });

  try {
    await Promise.race([loggerProvider.shutdown(), timeout]);
  } catch {
    // Keep shutdown resilient when log delivery is unavailable.
  } finally {
    clearTimeout(timeoutId);
  }
}
