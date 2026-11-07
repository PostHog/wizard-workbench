import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const missingVariable = !posthogKey
  ? 'NEXT_PUBLIC_POSTHOG_KEY'
  : !posthogHost
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : null;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const loggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'nextjs-saas' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
              timeoutMillis: 2000,
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : null;

const posthogLogger = loggerProvider?.getLogger('posthog-log-capture');

type LogSeverity = 'INFO' | 'ERROR';

export function emitPostHogLog(
  body: string,
  severity: LogSeverity = 'INFO'
) {
  posthogLogger?.emit({
    body,
    severityNumber:
      severity === 'ERROR' ? SeverityNumber.ERROR : SeverityNumber.INFO,
    severityText: severity,
  });
}

export async function flushPostHogLogs() {
  if (loggerProvider) {
    await loggerProvider.forceFlush().catch(() => {});
  }
}
