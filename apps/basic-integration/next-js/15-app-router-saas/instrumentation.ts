import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken && process.env.NODE_ENV === 'development') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
  );
}

if (!host && process.env.NODE_ENV === 'development') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
  );
}

export const posthogLogProvider =
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
    : undefined;

const posthogLogLogger = posthogLogProvider?.getLogger('posthog-log-capture');

export function register() {}

export function logCheckoutCompleted() {
  posthogLogLogger?.emit({
    body: 'checkout_completed',
    severityNumber: SeverityNumber.INFO,
    attributes: { source: 'posthog_integration' }
  });
}

export function logSubscriptionChangeProcessed() {
  posthogLogLogger?.emit({
    body: 'subscription_change_processed',
    severityNumber: SeverityNumber.INFO,
    attributes: { source: 'posthog_integration' }
  });
}

export async function flushPostHogLogs() {
  await posthogLogProvider?.forceFlush();
}
