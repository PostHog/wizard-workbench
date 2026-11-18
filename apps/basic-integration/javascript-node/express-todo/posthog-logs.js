const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let posthogLogger;
let shutdownPosthogLogs = async () => {};

if (token && host) {
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: { Authorization: `Bearer ${token}` },
        })
      ),
    ],
  });

  posthogLogger = loggerProvider.getLogger('posthog.todo-lifecycle');
  shutdownPosthogLogs = () => loggerProvider.shutdown();
}

module.exports = { posthogLogger, shutdownPosthogLogs };
