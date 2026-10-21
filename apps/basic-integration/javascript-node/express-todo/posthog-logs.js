const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

let posthogLogger = null;

if (posthogApiKey && posthogHost) {
  const { logs } = require('@opentelemetry/api-logs');
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
  const { NodeSDK } = require('@opentelemetry/sdk-node');

  const logsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${posthogHost}/i/v1/logs`,
          headers: { Authorization: `Bearer ${posthogApiKey}` },
        })
      ),
    ],
  });

  logsSdk.start();
  posthogLogger = logs.getLogger('express-todo-posthog');
}

module.exports = { posthogLogger };
