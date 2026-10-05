import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

let posthogLogProvider: LoggerProvider | undefined;

export function getPostHogLogProvider(): LoggerProvider | undefined {
  if (posthogLogProvider) {
    return posthogLogProvider;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return undefined;
  }

  posthogLogProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nextjs-todo-api',
    }),
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

  return posthogLogProvider;
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    getPostHogLogProvider();
  }
}
