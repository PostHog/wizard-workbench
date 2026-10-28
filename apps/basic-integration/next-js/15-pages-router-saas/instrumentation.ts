import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let loggerProvider: LoggerProvider | undefined;

if (!posthogKey) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
    );
  }
} else if (!posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }
} else {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-saas' }),
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
}

export async function emitPostHogLog(
  body: string,
  attributes: Record<string, string>
) {
  if (!loggerProvider) {
    return;
  }

  loggerProvider.getLogger('posthog-integration').emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });

  try {
    await loggerProvider.forceFlush();
  } catch {}
}
