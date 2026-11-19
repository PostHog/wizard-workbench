import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const processors = token && host
  ? [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ]
  : [];

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-app' }),
  processors,
});

export const posthogTodoLogger = loggerProvider.getLogger('posthog-todo-lifecycle');

export function register() {
  if ((!token || !host) && process.env.NODE_ENV !== 'production') {
    const missingVariable = token
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}
