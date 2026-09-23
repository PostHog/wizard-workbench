let posthogLogger;
let provider;

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
    const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: { Authorization: `Bearer ${projectToken}` },
  });
  provider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'express-todo' }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });

  posthogLogger = provider.getLogger('express-todo-posthog');
}

async function shutdownPostHogLogs() {
  if (provider) {
    await provider.shutdown();
  }
}

module.exports = { posthogLogger, shutdownPostHogLogs };
