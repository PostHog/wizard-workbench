import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { posthog } from './posthog.js';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider = posthog && projectToken && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'native-http-contacts',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${projectToken}` },
          })
        ),
      ],
    })
  : undefined;

// This dedicated logger keeps existing console and application loggers out of PostHog.
const posthogLogger = loggerProvider?.getLogger('native-http-contacts.posthog');

export function logApiOutcome(severityText, body, attributes) {
  posthogLogger?.emit({ severityText, body, attributes });
}

export function shutdownPostHogLogs() {
  return loggerProvider?.shutdown().catch(() => {});
}
