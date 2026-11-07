import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const loggerProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-saas'
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL('/i/v1/logs', host).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json'
              },
              timeoutMillis: 2000
            })
          })
        ]
      })
    : undefined;

if (!projectToken && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
  );
} else if (!host && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
  );
}

export const posthogLogLogger = loggerProvider?.getLogger('posthog-checkout-logs');

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush().catch(() => {});
}

process.once('beforeExit', () => {
  void loggerProvider?.shutdown().catch(() => {});
});

export function register() {}
