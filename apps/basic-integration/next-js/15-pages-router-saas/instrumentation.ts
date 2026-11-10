import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const logProcessor = token && host
  ? new BatchLogRecordProcessor({
      exporter: new OTLPLogExporter({
        url: `${host}/i/v1/logs`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    })
  : undefined;

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nextjs-pages-router-saas'
  }),
  processors: logProcessor ? [logProcessor] : []
});

export const posthogLogger = loggerProvider.getLogger('posthog-exporter');
export { SeverityNumber };

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  const shutdownLoggerProvider = () => {
    void loggerProvider.shutdown().catch(() => {});
  };

  process.once('SIGINT', shutdownLoggerProvider);
  process.once('SIGTERM', shutdownLoggerProvider);
}
