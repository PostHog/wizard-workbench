const { logs } = require('@opentelemetry/api-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let sdk;
let posthogLogger;

if (projectToken && host) {
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        })
      ),
    ],
  });

  sdk.start();
  posthogLogger = logs.getLogger('express-todo-posthog');
}

module.exports = {
  posthogLogger,
  shutdownPosthogLogs: () => sdk ? sdk.shutdown() : Promise.resolve(),
};
