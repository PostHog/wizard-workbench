const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let posthogLogger;
let loggerProvider;

if (token && host) {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${token}` },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'express-todo-api' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter,
        exportTimeoutMillis: 3000,
      }),
    ],
  });

  posthogLogger = loggerProvider.getLogger('express-todo-posthog');
} else if (process.env.NODE_ENV !== 'production') {
  if (!token) {
    console.warn(
      'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
    );
  }

  if (!host) {
    console.warn(
      'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    );
  }
}

function logTodoMutation(operation, attributes = {}) {
  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo mutation completed',
      attributes: { operation, ...attributes },
    });
  }
}

function shutdownPostHogLogs() {
  return loggerProvider ? loggerProvider.shutdown().catch(() => {}) : Promise.resolve();
}

module.exports = { logTodoMutation, shutdownPostHogLogs };
