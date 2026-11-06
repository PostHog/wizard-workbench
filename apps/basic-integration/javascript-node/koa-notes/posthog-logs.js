import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { posthog } from './posthog.js';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let loggerProvider;
export let posthogLogger = null;

if (apiKey && host) {
  try {
    const logsUrl = new URL('/i/v1/logs', host).toString();

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'koa-notes-api',
        'deployment.environment': process.env.NODE_ENV || 'development',
      }),
      processors: [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: logsUrl,
            headers: { Authorization: `Bearer ${apiKey}` },
          })
        ),
      ],
    });
    posthogLogger = loggerProvider.getLogger('posthog-exporter');
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('PostHog log export could not be configured.');
    }
  }
}

function flushAnalyticsOnShutdown(signal) {
  const shutdowns = [];
  if (loggerProvider) shutdowns.push(loggerProvider.shutdown());
  if (posthog) shutdowns.push(posthog.shutdown(3000));

  const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
  void Promise.race([Promise.allSettled(shutdowns), timeout]).finally(() =>
    process.kill(process.pid, signal)
  );
}

if (loggerProvider || posthog) {
  process.once('SIGINT', () => flushAnalyticsOnShutdown('SIGINT'));
  process.once('SIGTERM', () => flushAnalyticsOnShutdown('SIGTERM'));
}
