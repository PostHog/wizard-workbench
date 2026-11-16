import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let loggerProvider: LoggerProvider | undefined;

if (posthogKey && posthogHost) {
  try {
    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'nextjs-todo-api',
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', posthogHost).toString(),
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    });
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('PostHog log export is disabled because its configuration is invalid.');
    }
  }
} else if (process.env.NODE_ENV !== 'production') {
  if (!posthogKey) {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured',
    );
  } else {
    console.warn(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
    );
  }
}

const posthogLogger = loggerProvider?.getLogger('posthog-todo-api');

export { SeverityNumber };

export function getPostHogLogger() {
  return posthogLogger;
}

export function register() {
  // The provider is created at module load so Pages Router API routes can use it directly.
}
