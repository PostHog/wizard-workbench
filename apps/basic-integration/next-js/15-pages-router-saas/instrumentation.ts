import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingPostHogConfiguration(variableName: string): void {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

export const loggerProvider = (() => {
  if (!posthogKey) {
    missingPostHogConfiguration('NEXT_PUBLIC_POSTHOG_KEY');
    return null;
  }

  if (!posthogHost) {
    missingPostHogConfiguration('NEXT_PUBLIC_POSTHOG_HOST');
    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nextjs-saas'
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogKey}`,
            'Content-Type': 'application/json'
          }
        })
      })
    ]
  });
})();

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
