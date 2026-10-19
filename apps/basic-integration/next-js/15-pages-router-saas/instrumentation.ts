import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function reportMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

if (!projectToken) {
  reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
}

if (!posthogHost) {
  reportMissingConfiguration('NEXT_PUBLIC_POSTHOG_HOST');
}

const loggerProvider =
  projectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'nextjs-saas' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${projectToken}`,
                'Content-Type': 'application/json'
              }
            })
          })
        ]
      })
    : undefined;

const posthogLogger = loggerProvider?.getLogger('posthog-integration');

export function emitPostHogLog(body: string, attributes: Record<string, string>) {
  posthogLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}

export async function flushPostHogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch (error) {
    console.error('PostHog log flush failed:', error);
  }
}

export function register() {
  // The dedicated provider is intentionally not global: only logs added by this integration are exported.
}
