import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfigurationError(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

if (!posthogProjectToken && process.env.NODE_ENV === 'development') {
  throw missingConfigurationError('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
}

if (!posthogHost && process.env.NODE_ENV === 'development') {
  throw missingConfigurationError('NEXT_PUBLIC_POSTHOG_HOST');
}

export const loggerProvider =
  posthogProjectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-todo-app',
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogProjectToken}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : null;

export const posthogTodoLogger = loggerProvider?.getLogger('posthog-todo-mutations');

export function register() {
  // The dedicated logger is exported directly so existing loggers are not exported.
}
