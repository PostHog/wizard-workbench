import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function createPostHogLogProvider() {
  if (!projectToken) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
      );
    }
    return null;
  }

  if (!posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-api' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
}

export const posthogLogProvider = createPostHogLogProvider();
export const posthogTodoLogger = posthogLogProvider?.getLogger('posthog.todo-api');

export async function flushPostHogLogs() {
  await posthogLogProvider?.forceFlush();
}

export { SeverityNumber };

export function register() {
  // This provider is intentionally not registered globally: only logs emitted
  // through posthogTodoLogger are exported to PostHog.
}
