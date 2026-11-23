const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const {
  BatchLogRecordProcessor,
  LoggerProvider,
} = require('@opentelemetry/sdk-logs');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let posthogLogger = null;
let loggerProvider = null;

if (token && host) {
  const logsEndpoint = new URL('/i/v1/logs', host).toString();
  const exporter = new OTLPLogExporter({
    url: logsEndpoint,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLogger = loggerProvider.getLogger('posthog-exporter');
}

function shutdownPostHogLogs() {
  if (!loggerProvider) {
    return Promise.resolve();
  }

  return Promise.race([
    loggerProvider.shutdown(),
    new Promise((resolve) => {
      const timeout = setTimeout(resolve, 3000);
      timeout.unref();
    }),
  ]).catch(() => {});
}

module.exports = { posthogLogger, shutdownPostHogLogs };
