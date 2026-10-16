import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variable) {
  return new Error(
    `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
  );
}

let posthogLog = null;

if (!projectToken) {
  if (process.env.NODE_ENV !== 'production') {
    throw missingConfiguration('POSTHOG_PROJECT_TOKEN');
  }
} else if (!host) {
  if (process.env.NODE_ENV !== 'production') {
    throw missingConfiguration('POSTHOG_HOST');
  }
} else {
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'hono-links',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        })
      ),
    ],
  });

  // This provider is intentionally not registered globally: only log lines added
  // for this integration are exported to PostHog.
  posthogLog = loggerProvider.getLogger('posthog-hono-links');
}

export { posthogLog };
