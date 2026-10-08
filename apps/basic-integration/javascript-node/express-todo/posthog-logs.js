const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfiguration(variableName) {
  if (!isProduction) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }

  return null;
}

if (!projectToken) {
  module.exports = missingConfiguration('POSTHOG_PROJECT_TOKEN');
} else if (!host) {
  module.exports = missingConfiguration('POSTHOG_HOST');
} else {
  const { logs } = require('@opentelemetry/api-logs');
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
  const { NodeSDK } = require('@opentelemetry/sdk-node');

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
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

  module.exports = logs.getLogger('posthog-exporter');
}
