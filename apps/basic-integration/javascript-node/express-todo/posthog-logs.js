const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');
const { posthog } = require('./posthog');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let logProvider;
let posthogLog;
let shutdownPromise;

if (token && host) {
  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor(exporter)],
  });
  posthogLog = logProvider.getLogger('express-todo-posthog');
}

function shutdownAnalytics() {
  if (!logProvider && !posthog) {
    return Promise.resolve();
  }

  if (!shutdownPromise) {
    const shutdowns = [];

    if (logProvider) {
      shutdowns.push(logProvider.shutdown());
    }

    if (posthog) {
      shutdowns.push(posthog.shutdown(3000));
    }

    shutdownPromise = new Promise((resolve) => {
      const timeout = setTimeout(resolve, 3000);
      timeout.unref();

      Promise.allSettled(shutdowns).finally(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  return shutdownPromise;
}

function handleShutdown(signal) {
  shutdownAnalytics().finally(() => {
    process.kill(process.pid, signal);
  });
}

process.once('SIGINT', () => handleShutdown('SIGINT'));
process.once('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = { posthogLog };
