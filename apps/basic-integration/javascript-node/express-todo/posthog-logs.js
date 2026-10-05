const { logs } = require('@opentelemetry/api-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { NodeSDK } = require('@opentelemetry/sdk-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let logSdk = null;
let posthogLogger = null;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
  const logsUrl = new URL('/i/v1/logs', host).toString();
  logSdk = new NodeSDK({
    resource: resourceFromAttributes({ 'service.name': 'express-todo-api' }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsUrl,
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });
  logSdk.start();
  posthogLogger = logs.getLogger('posthog-todo-lifecycle');
}

function shutdownPostHogLogs() {
  return logSdk ? logSdk.shutdown() : Promise.resolve();
}

module.exports = { posthogLogger, shutdownPostHogLogs };
