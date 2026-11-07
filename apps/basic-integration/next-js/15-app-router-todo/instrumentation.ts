import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!posthogKey || !posthogHost) && process.env.NODE_ENV !== 'production') {
  console.warn(
    `${!posthogKey ? 'NEXT_PUBLIC_POSTHOG_KEY' : 'NEXT_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!posthogKey ? 'NEXT_PUBLIC_POSTHOG_KEY' : 'NEXT_PUBLIC_POSTHOG_HOST'} is configured`,
  );
}

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-app' }),
  ...(posthogKey && posthogHost
    ? {
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                'Content-Type': 'application/json',
              },
              timeoutMillis: 2000,
            }),
          }),
        ],
      }
    : {}),
});

export const posthogTodoLogger = loggerProvider.getLogger('posthog-todo-api');

export function register() {}
