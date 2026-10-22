import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';

let loggerProvider: LoggerProvider | null = null;

function getRequiredPostHogConfig() {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_KEY';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return null;
  }

  return { token, host };
}

export function getPostHogLogProvider() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return null;
  }

  if (loggerProvider) {
    return loggerProvider;
  }

  const config = getRequiredPostHogConfig();
  if (!config) {
    return null;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nextjs-todo-app',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', config.host).toString(),
          headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });

  return loggerProvider;
}

export function register() {}
