import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';

function getPostHogLogConfig() {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return null;
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  return { token, host };
}

const posthogLogConfig = getPostHogLogConfig();

export const posthogLoggerProvider = posthogLogConfig
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'next-js-saas' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', posthogLogConfig.host).toString(),
            headers: {
              Authorization: `Bearer ${posthogLogConfig.token}`,
              'Content-Type': 'application/json'
            }
          })
        })
      ]
    })
  : null;

// This provider is intentionally not registered globally: only the dedicated
// logger in lib/posthog-logs.ts exports lines added by this integration.
export function register() {}
