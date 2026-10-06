const { logs, SeverityNumber } = require('@opentelemetry/api-logs');
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

let logger = null;
let sdk = null;

if (!missingVariable) {
  const logsUrl = new URL('/i/v1/logs', host).toString();
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsUrl,
          headers: { Authorization: `Bearer ${projectToken}` },
        })
      ),
    ],
  });

  sdk.start();
  logger = logs.getLogger('express-todo-posthog-logs');
}

function logTodoMutation(message, attributes) {
  if (!logger) return;

  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: message,
    attributes,
  });
}

async function shutdownPosthogLogs() {
  if (sdk) await sdk.shutdown();
}

module.exports = { logTodoMutation, shutdownPosthogLogs };
