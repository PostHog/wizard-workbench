const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

const loggerProvider = apiKey && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: { Authorization: `Bearer ${apiKey}` },
        })
      ),
    ],
  })
  : null;

const posthogLogger = loggerProvider
  ? loggerProvider.getLogger('express-todo-posthog')
  : null;

function shutdownPostHogLogs() {
  return loggerProvider ? loggerProvider.shutdown() : Promise.resolve();
}

module.exports = { posthogLogger, shutdownPostHogLogs };
