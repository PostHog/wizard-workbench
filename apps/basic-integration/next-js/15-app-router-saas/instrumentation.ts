import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!projectToken || !host) && process.env.NODE_ENV === 'development') {
  const missingVariable = !projectToken
    ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'NEXT_PUBLIC_POSTHOG_HOST';

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthogLogsProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'nextjs-saas' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json'
              }
            })
          })
        ]
      })
    : null;

export const posthogIntegrationLogger = posthogLogsProvider?.getLogger(
  'posthog-integration'
);

export function register() {}
