let shutdownPostHogLogs = async () => {};
let logTodoMutation = () => {};

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (token && host) {
  const { logs } = require('@opentelemetry/api-logs');
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
      'deployment.environment.name': process.env.NODE_ENV || 'development',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    ],
  });

  sdk.start();

  const logger = logs.getLogger('express-todo-posthog');

  logTodoMutation = (action, todoId) => {
    logger.emit({
      severityText: 'INFO',
      body: 'Todo mutation completed',
      attributes: {
        event: 'todo_mutation_completed',
        todo_action: action,
        todo_id: todoId,
      },
    });
  };

  shutdownPostHogLogs = () => sdk.shutdown();
}

module.exports = { logTodoMutation, shutdownPostHogLogs };
