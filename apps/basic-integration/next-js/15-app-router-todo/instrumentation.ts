import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProvider: LoggerProvider | undefined;

function requirePostHogLogConfiguration(
  value: string | undefined,
  variableName: string
): string | undefined {
  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }

  return undefined;
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || loggerProvider) {
    return;
  }

  const projectToken = requirePostHogLogConfiguration(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
  );
  const host = requirePostHogLogConfiguration(
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
    'NEXT_PUBLIC_POSTHOG_HOST'
  );

  if (!projectToken || !host) {
    return;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-api' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });

  logs.setGlobalLoggerProvider(loggerProvider);
}

export function getPostHogLogger() {
  return loggerProvider?.getLogger('posthog-todo-api');
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
