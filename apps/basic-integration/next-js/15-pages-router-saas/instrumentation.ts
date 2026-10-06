import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfiguration(variableName: string) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

if (!projectToken) {
  missingConfiguration('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
}

if (!posthogHost) {
  missingConfiguration('NEXT_PUBLIC_POSTHOG_HOST');
}

export const loggerProvider =
  projectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'next-js-saas',
          'deployment.environment': process.env.NODE_ENV || 'development'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', posthogHost).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json'
              }
            })
          })
        ]
      })
    : null;

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
