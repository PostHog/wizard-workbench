import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function reportMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

export const posthogLoggerProvider =
  !projectToken
    ? (reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'), undefined)
    : !apiHost
      ? (reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_HOST'), undefined)
      : new LoggerProvider({
          resource: resourceFromAttributes({
            'service.name': 'next-js-saas'
          }),
          processors: [
            new BatchLogRecordProcessor({
              exporter: new OTLPLogExporter({
                url: new URL('/i/v1/logs', apiHost).toString(),
                headers: {
                  Authorization: `Bearer ${projectToken}`,
                  'Content-Type': 'application/json'
                }
              })
            })
          ]
        });

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && posthogLoggerProvider) {
    logs.setGlobalLoggerProvider(posthogLoggerProvider);
  }
}
