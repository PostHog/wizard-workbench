import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

function createLoggerProvider() {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return null;
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'next-js-saas' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json'
          }
        })
      })
    ]
  });
}

export const posthogLoggerProvider = createLoggerProvider();

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && posthogLoggerProvider) {
    logs.setGlobalLoggerProvider(posthogLoggerProvider);
  }
}
