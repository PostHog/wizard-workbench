import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogLoggerProvider =
  process.env.NEXT_RUNTIME === 'nodejs' && projectToken && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'nextjs-saas'
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json'
            }
          })
        })
      ]
    })
  : undefined;

export const posthogLogger = posthogLoggerProvider?.getLogger(
  'posthog-integration'
);
export { SeverityNumber };

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!projectToken && process.env.NODE_ENV !== 'production') {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    );
  }

  if (!host && process.env.NODE_ENV !== 'production') {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }
}
