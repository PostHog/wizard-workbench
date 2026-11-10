import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let loggerProvider;
let posthogLogger;

if (projectToken && host) {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'fastify-blog',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      ),
    ],
  });
  posthogLogger = loggerProvider.getLogger('fastify-blog.posthog');
} else if (process.env.NODE_ENV !== 'production') {
  const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

async function shutdownPostHogLogs() {
  if (!loggerProvider) return;

  let timeout;
  try {
    await Promise.race([
      loggerProvider.shutdown(),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, 3000);
      }),
    ]);
  } catch (error) {
    console.warn('PostHog log exporter shutdown failed', error);
  } finally {
    clearTimeout(timeout);
  }
}

export { posthogLogger, shutdownPostHogLogs };
