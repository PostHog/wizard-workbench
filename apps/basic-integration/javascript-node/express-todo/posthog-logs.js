const { logs } = require('@opentelemetry/api-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { NodeSDK } = require('@opentelemetry/sdk-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let logsSdk = null;
let todoLogger = null;

if (projectToken && host) {
  logsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        })
      ),
    ],
  });

  logsSdk.start();
  todoLogger = logs.getLogger('posthog-express-todo');
}

function emitTodoLog(body, attributes) {
  if (!todoLogger) {
    return;
  }

  todoLogger.emit({ severityText: 'INFO', body, attributes });
}

async function shutdownTodoLogs() {
  if (logsSdk) {
    await logsSdk.shutdown();
  }
}

module.exports = { emitTodoLog, shutdownTodoLogs };
