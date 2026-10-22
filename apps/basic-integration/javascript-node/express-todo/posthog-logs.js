const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

let posthogLogger = null;

if (posthogProjectToken && posthogHost) {
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogProjectToken}`,
          },
        }),
      ),
    ],
  });

  posthogLogger = loggerProvider.getLogger('express-todo-posthog');
}

module.exports = posthogLogger;
