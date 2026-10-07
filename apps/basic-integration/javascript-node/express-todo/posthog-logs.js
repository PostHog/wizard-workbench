const { logs } = require('@opentelemetry/api-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const missingVariable = !projectToken
  ? 'POSTHOG_PROJECT_TOKEN'
  : !host
    ? 'POSTHOG_HOST'
    : null;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

if (missingVariable) {
  module.exports = null;
} else {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });

  sdk.start();
  module.exports = logs.getLogger('posthog-todo-lifecycle');
}
