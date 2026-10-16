import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfigurationError(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

function createLoggerProvider() {
  if (!projectToken) {
    if (process.env.NODE_ENV === 'development') {
      throw missingConfigurationError('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
    }

    return undefined;
  }

  if (!posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      throw missingConfigurationError('NEXT_PUBLIC_POSTHOG_HOST');
    }

    return undefined;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nextjs-saas',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
}

export const posthogLoggerProvider = createLoggerProvider();
const posthogIntegrationLogger = posthogLoggerProvider?.getLogger(
  'posthog-integration'
);

export function emitPostHogIntegrationLog(
  body: string,
  attributes: Record<string, string | number | boolean>
) {
  posthogIntegrationLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes,
  });
}

export async function flushPostHogIntegrationLogs() {
  await posthogLoggerProvider?.forceFlush();
}

export function register() {}
