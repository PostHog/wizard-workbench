const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { logs } = require('@opentelemetry/api-logs');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let logger = null;
let logSdk = null;

if (projectToken && host) {
  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      ),
    ],
  });

  logSdk.start();
  logger = logs.getLogger('express-todo-posthog-logs');
}

function logTodoCreated(todoCount) {
  if (logger) {
    logger.emit({
      severityText: 'INFO',
      body: 'todo created',
      attributes: { event: 'todo_created', todo_count: todoCount },
    });
  }
}

function logTodoUpdated({ titleUpdated, completionUpdated, isCompleted }) {
  if (logger) {
    logger.emit({
      severityText: 'INFO',
      body: 'todo updated',
      attributes: {
        event: 'todo_updated',
        title_updated: titleUpdated,
        completion_updated: completionUpdated,
        is_completed: isCompleted,
      },
    });
  }
}

function logTodoDeleted(remainingTodoCount) {
  if (logger) {
    logger.emit({
      severityText: 'INFO',
      body: 'todo deleted',
      attributes: { event: 'todo_deleted', remaining_todo_count: remainingTodoCount },
    });
  }
}

async function shutdownPostHogLogs() {
  if (logSdk) {
    await logSdk.shutdown();
  }
}

module.exports = {
  logTodoCreated,
  logTodoUpdated,
  logTodoDeleted,
  shutdownPostHogLogs,
};
