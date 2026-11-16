import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const logsConfigured = Boolean(posthogKey && posthogHost);

if (!logsConfigured && process.env.NODE_ENV !== 'production') {
  const missingVariable = posthogKey
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_KEY';

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthogLogsProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'basic-integration-nextjs',
    'deployment.environment': process.env.NODE_ENV || 'development'
  }),
  processors: logsConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', posthogHost).toString(),
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json'
            }
          })
        })
      ]
    : []
});

// Keep this provider dedicated to log lines added by this integration.
export const posthogLogsLogger = posthogLogsProvider.getLogger('posthog-integration');

export function register() {
  // Next.js evaluates this module before calling register(), initializing the server-only provider.
}
