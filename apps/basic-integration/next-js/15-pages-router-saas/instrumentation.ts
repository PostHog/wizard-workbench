import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const isPostHogConfigured = Boolean(projectToken && posthogHost);

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'basic-integration-nextjs-saas'
  }),
  processors: isPostHogConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost!.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken!}`,
              'Content-Type': 'application/json'
            },
            timeoutMillis: 2000
          })
        })
      ]
    : []
});

export const posthogLog = loggerProvider.getLogger('posthog-log-exporter');

export async function flushPostHogLogs() {
  await loggerProvider.forceFlush().catch(() => {});
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!projectToken && process.env.NODE_ENV !== 'production') {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    );
  }

  if (!posthogHost && process.env.NODE_ENV !== 'production') {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }

  process.once('SIGTERM', () => {
    void loggerProvider.shutdown().catch(() => {});
  });
}
