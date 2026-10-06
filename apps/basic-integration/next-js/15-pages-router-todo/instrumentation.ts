import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!posthogKey || !posthogHost) && process.env.NODE_ENV === 'development') {
  const missingVariable = !posthogKey
    ? 'NEXT_PUBLIC_POSTHOG_KEY'
    : 'NEXT_PUBLIC_POSTHOG_HOST';

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

const loggerProvider = posthogKey && posthogHost
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-api' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : undefined;

export const todoApiLogger = loggerProvider?.getLogger('posthog-todo-api');

export async function flushPosthogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch (error) {
    console.error('Failed to flush PostHog logs:', error);
  }
}

export { SeverityNumber };

export function register() {}
