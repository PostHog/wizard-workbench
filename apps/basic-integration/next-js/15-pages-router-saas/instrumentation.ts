import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | null | undefined;

function getLoggerProvider() {
  if (loggerProvider !== undefined) {
    return loggerProvider;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      if (!projectToken) {
        console.error(
          'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
        );
      }

      if (!posthogHost) {
        console.error(
          'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
        );
      }
    }

    loggerProvider = null;
    return loggerProvider;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-saas' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json'
          }
        })
      })
    ]
  });

  return loggerProvider;
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    getLoggerProvider();
  }
}

export async function logPostHogIntegrationEvent(
  body: string,
  severityNumber: SeverityNumber,
  attributes: Record<string, string>
) {
  try {
    const provider = getLoggerProvider();

    if (!provider) {
      return;
    }

    provider.getLogger('posthog-integration').emit({
      body,
      severityNumber,
      attributes
    });

    await provider.forceFlush();
  } catch {
    // Log delivery must not alter the API response.
  }
}

export { SeverityNumber };
