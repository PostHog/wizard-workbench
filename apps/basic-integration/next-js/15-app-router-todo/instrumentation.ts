import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isConfigured = Boolean(projectToken && host);

if (!isConfigured && process.env.NODE_ENV !== 'production') {
  const missingVariable = !projectToken
    ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'NEXT_PUBLIC_POSTHOG_HOST';

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nextjs-todo-app',
    'deployment.environment': process.env.NODE_ENV ?? 'development',
  }),
  processors: isConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ]
    : [],
});

// This logger is intentionally separate from the app's existing console logs.
export const posthogLogger = loggerProvider.getLogger('posthog-todo-api');

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }
}
