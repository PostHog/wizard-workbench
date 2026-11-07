import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isNodeRuntime = process.env.NEXT_RUNTIME === 'nodejs';
const isPostHogLogsConfigured = Boolean(
  isNodeRuntime && posthogProjectToken && posthogHost,
);

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nextjs-saas',
  }),
  processors: isPostHogLogsConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogProjectToken}`,
              'Content-Type': 'application/json',
            },
            timeoutMillis: 2000,
          }),
        }),
      ]
    : [],
});

export const posthogLogCaptureLogger = loggerProvider.getLogger(
  'posthog-log-capture',
);

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || isPostHogLogsConfigured) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    if (!posthogProjectToken) {
      console.warn(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
      );
    }

    if (!posthogHost) {
      console.warn(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
      );
    }
  }
}
