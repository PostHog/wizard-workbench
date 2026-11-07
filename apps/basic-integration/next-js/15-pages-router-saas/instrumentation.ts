import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function createPostHogLoggerProvider() {
  if (!apiKey || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = apiKey
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_KEY';

      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-saas' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeoutMillis: 2000
        })
      })
    ]
  });
}

export const posthogLoggerProvider = createPostHogLoggerProvider();
export const posthogLogExporterLogger = posthogLoggerProvider?.getLogger(
  'posthog-log-exporter'
);

export async function logPostHogInfo(
  body: string,
  attributes: Record<string, string | number | boolean>
) {
  if (!posthogLogExporterLogger || !posthogLoggerProvider) {
    return;
  }

  posthogLogExporterLogger.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
  await posthogLoggerProvider.forceFlush().catch(() => {});
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && posthogLoggerProvider) {
    process.once('beforeExit', () => {
      void posthogLoggerProvider.shutdown().catch(() => {});
    });
  }
}
