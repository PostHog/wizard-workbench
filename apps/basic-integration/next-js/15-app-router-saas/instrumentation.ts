import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const missingConfiguration = !projectToken
  ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
  : !posthogHost
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : undefined;

export const loggerProvider =
  projectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-saas',
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json',
              },
              timeoutMillis: 2000,
            }),
          }),
        ],
      })
    : undefined;

if (missingConfiguration && process.env.NODE_ENV !== 'production') {
  console.warn(
    `${missingConfiguration} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfiguration} is configured`
  );
}

export const posthogLogger = loggerProvider?.getLogger('posthog-integration');

export function register() {}
