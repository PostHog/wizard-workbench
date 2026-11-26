const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const apiKey = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider = null;
let todoLogger = null;
let shutdownPromise = null;

if (apiKey && host) {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
      ),
    ],
  });

  // Do not register globally: only this logger's purpose-written records are exported.
  todoLogger = loggerProvider.getLogger('posthog.todo-api');
}

function shutdownPosthogLogs() {
  if (!loggerProvider) {
    return Promise.resolve();
  }

  if (!shutdownPromise) {
    let timeout;
    const timeoutPromise = new Promise((resolve) => {
      timeout = setTimeout(resolve, 3000);
    });

    shutdownPromise = Promise.race([
      loggerProvider.shutdown().catch(() => {}),
      timeoutPromise,
    ]).finally(() => clearTimeout(timeout));
  }

  return shutdownPromise;
}

process.once('beforeExit', () => {
  void shutdownPosthogLogs();
});

module.exports = { todoLogger, shutdownPosthogLogs };
