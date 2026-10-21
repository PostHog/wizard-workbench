import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!posthogKey || !posthogHost) && process.env.NODE_ENV === 'development') {
  const missingVariable = posthogKey
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_KEY';

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const posthogLoggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-saas'
        }),
        processors: [
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
      })
    : null;

const posthogLogger = posthogLoggerProvider?.getLogger('posthog-exporter');

type LogAttributes = Record<string, string | number | boolean>;

function emitPostHogLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes: LogAttributes
) {
  posthogLogger?.emit({ body, severityNumber, attributes });
}

export function logPostHogInfo(body: string, attributes: LogAttributes) {
  emitPostHogLog(body, SeverityNumber.INFO, attributes);
}

export function logPostHogWarn(body: string, attributes: LogAttributes) {
  emitPostHogLog(body, SeverityNumber.WARN, attributes);
}

export function logPostHogError(body: string, attributes: LogAttributes) {
  emitPostHogLog(body, SeverityNumber.ERROR, attributes);
}

export async function flushPostHogLogs() {
  await posthogLoggerProvider?.forceFlush();
}

export function register() {}
