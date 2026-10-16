import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthogLoggerProvider: LoggerProvider | undefined;

if (!posthogKey || !posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    const missingVariable = !posthogKey
      ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'NEXT_PUBLIC_POSTHOG_HOST';

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthogLoggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'todo-nextjs-app' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogKey}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
}

export const posthogTodoLogger = posthogLoggerProvider?.getLogger('posthog-todo-api');

export async function flushPosthogLogs() {
  await posthogLoggerProvider?.forceFlush();
}

export function register() {}
