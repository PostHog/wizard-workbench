import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | undefined;

type LogAttributes = Record<string, string | number | boolean>;

function getLoggerProvider() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== 'nodejs') {
    return undefined;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return undefined;
  }

  if (!loggerProvider) {
    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'nextjs-saas'
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json'
            }
          })
        })
      ]
    });
  }

  return loggerProvider;
}

export function register() {
  getLoggerProvider();
}

export function logPostHogInfo(body: string, attributes: LogAttributes) {
  const provider = getLoggerProvider();

  provider?.getLogger('posthog-integration').emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes
  });
}

export async function flushPostHogLogs() {
  await getLoggerProvider()?.forceFlush();
}
