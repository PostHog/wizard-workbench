import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    const missingVariable = !projectToken
      ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      : 'NEXT_PUBLIC_POSTHOG_HOST';

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
}

export const posthogLogProvider =
  projectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-saas'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json'
              }
            })
          })
        ]
      })
    : undefined;

export const posthogLogger = posthogLogProvider?.getLogger('posthog-checkout');

export function logCheckoutLifecycle(
  body: string,
  attributes: Record<string, string>
) {
  posthogLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && posthogLogProvider) {
    logs.setGlobalLoggerProvider(posthogLogProvider);
  }
}
