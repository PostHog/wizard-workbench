const { logs } = require('@opentelemetry/api-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let posthogLogger = null;
let posthogLogsSdk = null;

if (token && host) {
  posthogLogsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${token}` },
        })
      ),
    ],
  });

  posthogLogsSdk.start();
  posthogLogger = logs.getLogger('express-todo-posthog-logs');
}

function posthogLog(severityText, body, attributes) {
  if (posthogLogger) {
    posthogLogger.emit({ severityText, body, attributes });
  }
}

async function shutdownPostHogLogs() {
  if (posthogLogsSdk) {
    await posthogLogsSdk.shutdown();
  }
}

module.exports = { posthogLog, shutdownPostHogLogs };
