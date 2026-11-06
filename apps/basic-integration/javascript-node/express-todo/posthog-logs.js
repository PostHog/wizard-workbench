const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const hasConfiguration = Boolean(
  process.env.POSTHOG_PROJECT_TOKEN && process.env.POSTHOG_HOST
);

let posthogLogger = null;
let loggerProvider = null;

if (hasConfiguration) {
  const exporter = new OTLPLogExporter({
    url: `${process.env.POSTHOG_HOST.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${process.env.POSTHOG_PROJECT_TOKEN}`,
    },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
      'deployment.environment.name': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLogger = loggerProvider.getLogger('express-todo-api.posthog');

  const shutdownLogs = (signal) => {
    const exitOnSignal = () => process.kill(process.pid, signal);
    const timeout = setTimeout(exitOnSignal, 3000);
    timeout.unref();

    void loggerProvider.shutdown()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        exitOnSignal();
      });
  };

  process.once('SIGINT', () => shutdownLogs('SIGINT'));
  process.once('SIGTERM', () => shutdownLogs('SIGTERM'));
}

module.exports = posthogLogger;
