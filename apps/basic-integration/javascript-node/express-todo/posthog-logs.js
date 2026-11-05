const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }

  module.exports = { emitPostHogLog: () => {} };
} else {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${projectToken}` },
  });
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'express-todo' }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  const logger = loggerProvider.getLogger('posthog-express-todo');

  module.exports = {
    emitPostHogLog: (severityText, body, attributes) => {
      logger.emit({ severityText, body, attributes });
    },
  };
}
