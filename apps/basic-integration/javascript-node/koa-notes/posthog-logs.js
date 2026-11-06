import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let posthogLogger;
let loggerProvider;

if (apiKey && host) {
  const logsEndpoint = new URL('/i/v1/logs', host).toString();

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsEndpoint,
          headers: { Authorization: `Bearer ${apiKey}` },
        })
      ),
    ],
  });
  posthogLogger = loggerProvider.getLogger('posthog-integration');
} else if (process.env.NODE_ENV !== 'production') {
  const missingVariable = apiKey ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY';
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const logPostHog = (severityText, body, attributes = {}) => {
  try {
    posthogLogger?.emit({ severityText, body, attributes });
  } catch {
    // Log-export failures must not interfere with API requests.
  }
};

const shutdownPostHogLogs = async () => {
  if (!loggerProvider) return;

  let timeout;
  const timeoutPromise = new Promise((resolve) => {
    timeout = setTimeout(resolve, 3000);
    timeout.unref();
  });

  try {
    await Promise.race([loggerProvider.shutdown(), timeoutPromise]);
  } catch {
    // The server must still finish its normal shutdown when log delivery fails.
  } finally {
    clearTimeout(timeout);
  }
};

export { logPostHog, shutdownPostHogLogs };
