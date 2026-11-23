import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogLogsConfigured = Boolean(token && host);

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'next-js-saas'
  }),
  processors: posthogLogsConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host?.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeoutMillis: 2000
          })
        })
      ]
    : []
});

const posthogLogger = loggerProvider.getLogger('posthog-instrumented-api');

export async function posthogLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes: Record<string, string> = {}
) {
  if (!posthogLogsConfigured) {
    return;
  }

  posthogLogger.emit({ body, severityNumber, attributes });
  await loggerProvider.forceFlush().catch(() => {});
}

export function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    !posthogLogsConfigured &&
    process.env.NODE_ENV !== 'production'
  ) {
    if (!token) {
      console.warn(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }

    if (!host) {
      console.warn(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
  }
}
