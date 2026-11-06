import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function warnAboutMissingConfiguration() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const missingVariable = !posthogProjectToken
    ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'NEXT_PUBLIC_POSTHOG_HOST';

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

const loggerProvider =
  posthogProjectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'todo-nextjs' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogProjectToken}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : undefined;

if (!loggerProvider) {
  warnAboutMissingConfiguration();
}

export const posthogTodoLogger = loggerProvider?.getLogger('todo-api');

export function register() {}
