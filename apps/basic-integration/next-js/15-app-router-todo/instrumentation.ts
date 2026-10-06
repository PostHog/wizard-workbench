import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (process.env.NODE_ENV === 'development') {
  if (!projectToken) {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    );
  }

  if (!posthogHost) {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }
}

export const loggerProvider = projectToken && posthogHost
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'todo-app' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : null;

export const posthogLogsLogger = loggerProvider?.getLogger('posthog-todo-mutations');

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
