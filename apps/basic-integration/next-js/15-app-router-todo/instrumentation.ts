import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function warnForMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

if (!posthogKey) {
  warnForMissingConfiguration('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN');
} else if (!posthogHost) {
  warnForMissingConfiguration('NEXT_PUBLIC_POSTHOG_HOST');
}

const loggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'nextjs-todo-app',
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
      })
    : undefined;

const todoLogger = loggerProvider?.getLogger('posthog-todo-api');

export function logTodoOperation(
  operation: 'created' | 'completion_updated' | 'deleted',
  attributes: Record<string, boolean>
) {
  todoLogger?.emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation,
      ...attributes,
    },
  });
}

export function schedulePostHogLogFlush() {
  void loggerProvider?.forceFlush().catch(() => {});
}

export function register() {}
