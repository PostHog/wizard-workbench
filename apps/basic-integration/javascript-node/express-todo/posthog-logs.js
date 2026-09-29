const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let logger = null;

if (projectToken && host) {
  const { logs } = require('@opentelemetry/api-logs');
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

  const logExporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  });

  const logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
  });

  logSdk.start();
  logger = logs.getLogger('posthog-express-todo');
}

function log(severityText, body, attributes) {
  if (logger) {
    logger.emit({ severityText, body, attributes });
  }
}

module.exports = { log };
