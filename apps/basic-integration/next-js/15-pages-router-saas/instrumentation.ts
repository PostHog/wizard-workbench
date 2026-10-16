import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogLogsConfigured = Boolean(posthogKey && posthogHost);

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nextjs-pages-router-saas'
  }),
  processors: posthogLogsConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost!.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogKey!}`,
              'Content-Type': 'application/json'
            }
          })
        })
      ]
    : []
});

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!posthogKey || !posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = posthogKey
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_KEY';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  logs.setGlobalLoggerProvider(loggerProvider);
}
