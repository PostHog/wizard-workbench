import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isDevelopment = process.env.NODE_ENV === 'development' || Boolean(process.env.DEBUG);

function missingConfigurationError(variableName) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

if (isDevelopment && !projectToken) {
  throw missingConfigurationError('POSTHOG_PROJECT_TOKEN');
}

if (isDevelopment && !host) {
  throw missingConfigurationError('POSTHOG_HOST');
}

let posthogLogger = logs.getLogger('hono-links.posthog');

if (projectToken && host) {
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'hono-links-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        })
      ),
    ],
  });

  posthogLogger = loggerProvider.getLogger('hono-links.posthog');
}

export { posthogLogger };
