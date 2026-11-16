let posthogLogger = null;
let posthogLogProvider = null;

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (projectToken && host) {
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: { Authorization: `Bearer ${projectToken}` },
  });

  posthogLogProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });

  posthogLogger = posthogLogProvider.getLogger('posthog.todo-api');
}

async function shutdownPostHogLogs() {
  if (!posthogLogProvider) return;

  let timeout;
  await Promise.race([
    posthogLogProvider.shutdown().catch(() => {}),
    new Promise((resolve) => {
      timeout = setTimeout(resolve, 3000);
    }),
  ]);
  clearTimeout(timeout);
}

module.exports = { posthogLogger, shutdownPostHogLogs };
