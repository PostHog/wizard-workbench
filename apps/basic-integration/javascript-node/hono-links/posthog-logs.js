import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { posthog } from './posthog.js';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let logProvider = null;
export let posthogLog = null;

if (apiKey && host) {
  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'hono-links-api',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
      ),
    ],
  });

  posthogLog = logProvider.getLogger('hono-links-posthog');

  const shutdownTelemetry = (signal) => {
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    Promise.race([
      Promise.allSettled([logProvider.shutdown(), posthog?.shutdown(3000)]),
      timeout,
    ]).finally(() => process.kill(process.pid, signal));
  };

  process.once('SIGTERM', () => shutdownTelemetry('SIGTERM'));
  process.once('SIGINT', () => shutdownTelemetry('SIGINT'));
}
