import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider;
let posthogLogger;

if (projectToken && host) {
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
  posthogLogger = loggerProvider.getLogger('posthog-integration');
}

export function logPostHogOperation(body, attributes) {
  try {
    posthogLogger?.emit({ severityText: 'INFO', body, attributes });
  } catch {
    // Log export must never affect the API response.
  }
}

export async function shutdownPostHogLogs(timeout = 3000) {
  let timeoutId;

  try {
    await Promise.race([
      loggerProvider?.shutdown(),
      new Promise((resolve) => {
        timeoutId = setTimeout(resolve, timeout);
      }),
    ]);
  } catch {
    // Log export shutdown must never affect process shutdown.
  } finally {
    clearTimeout(timeoutId);
  }
}
