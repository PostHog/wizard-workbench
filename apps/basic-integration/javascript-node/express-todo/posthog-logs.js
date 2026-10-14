const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

let posthogLogger = null;

if (!posthogProjectToken || !posthogHost) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = posthogProjectToken
      ? 'POSTHOG_HOST'
      : 'POSTHOG_PROJECT_TOKEN';
    console.error(
      new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      ),
    );
  }
} else {
  const { logs } = require('@opentelemetry/api-logs');
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
  const { NodeSDK } = require('@opentelemetry/sdk-node');

  const logsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${posthogProjectToken}` },
        }),
      ),
    ],
  });

  logsSdk.start();
  posthogLogger = logs.getLogger('posthog-express-todo');
}

module.exports = { posthogLogger };
