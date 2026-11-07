const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

const loggerProvider = token && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    ],
  })
  : null;

const posthogLogger = loggerProvider?.getLogger('express-todo-posthog');
let shutdownPromise;

function emitTodoMutationLog(operation, attributes = {}) {
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'Todo mutation completed',
    attributes: {
      event: 'todo_mutation_completed',
      todo_operation: operation,
      ...attributes,
    },
  });
}

function shutdownPostHogLogs() {
  if (!loggerProvider) return Promise.resolve();
  if (shutdownPromise) return shutdownPromise;

  shutdownPromise = new Promise((resolve) => {
    const timeout = setTimeout(resolve, 3000);
    Promise.resolve()
      .then(() => loggerProvider.shutdown())
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        resolve();
      });
  });

  return shutdownPromise;
}

module.exports = { emitTodoMutationLog, shutdownPostHogLogs };
