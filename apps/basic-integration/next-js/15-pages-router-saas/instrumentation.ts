import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const posthogLogProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-pages-router-saas'
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
      })
    : null;

const posthogLogger = posthogLogProvider?.getLogger('posthog-integration');

type PostHogLogAttributes = Record<string, string | number | boolean>;

export function emitPostHogLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes: PostHogLogAttributes
) {
  posthogLogger?.emit({ body, severityNumber, attributes });
}

export async function flushPostHogLogs() {
  try {
    await posthogLogProvider?.forceFlush();
  } catch {
    // Log delivery must not change the API response when ingestion is unavailable.
  }
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!posthogKey) {
      console.error(
        'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
      );
    }

    if (!posthogHost) {
      console.error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
  }
}
