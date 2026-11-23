const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');

const apiKey = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function createPostHogLogs() {
  if (!apiKey || !host) {
    return { logger: null, shutdown: () => Promise.resolve() };
  }

  try {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'express-todo' }),
      processors: [new BatchLogRecordProcessor(exporter)],
    });

    return {
      logger: loggerProvider.getLogger('express-todo-posthog'),
      shutdown: () => loggerProvider.shutdown().catch(() => {}),
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`PostHog log capture could not be configured: ${error.message}`);
    }

    return { logger: null, shutdown: () => Promise.resolve() };
  }
}

module.exports = createPostHogLogs();
