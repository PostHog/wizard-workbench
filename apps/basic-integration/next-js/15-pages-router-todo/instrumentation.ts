import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const logEndpoint = host ? `${host.replace(/\/$/, '')}/i/v1/logs` : undefined;

const loggerProvider = token && logEndpoint
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'nextjs-todo-api',
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: logEndpoint,
            timeoutMillis: 2000,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : undefined;

export const todoLogger = loggerProvider?.getLogger('posthog.todo-api');

export async function flushTodoLogs() {
  await loggerProvider?.forceFlush().catch(() => {});
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (!loggerProvider) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  process.once('beforeExit', () => {
    void loggerProvider.shutdown().catch(() => {});
  });
}
