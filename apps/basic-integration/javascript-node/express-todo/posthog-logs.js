const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
  }

  module.exports = null;
} else if (!host) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
  }

  module.exports = null;
} else {
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });

  module.exports = {
    logger: loggerProvider.getLogger('express-todo-posthog'),
    shutdown: () => loggerProvider.shutdown(),
  };
}
