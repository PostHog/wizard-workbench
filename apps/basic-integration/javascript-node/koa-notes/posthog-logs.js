import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function requirePostHogConfiguration(variable, value) {
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

requirePostHogConfiguration('POSTHOG_API_KEY', apiKey);
requirePostHogConfiguration('POSTHOG_HOST', host);

let loggerProvider = null;
let posthogLogger = null;

if (apiKey && host) {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'koa-notes',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
      ),
    ],
  });

  posthogLogger = loggerProvider.getLogger('koa-notes-posthog');
}

export function emitPostHogLog(severityText, body, attributes) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export async function shutdownPostHogLogs() {
  await loggerProvider?.shutdown();
}
