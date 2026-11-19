import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const posthogLogsEndpoint = host ? `${host.replace(/\/$/, '')}/i/v1/logs` : undefined;

export const posthogLoggerProvider =
  token && posthogLogsEndpoint
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'todo-app' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: posthogLogsEndpoint,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              timeoutMillis: 2000,
            }),
          }),
        ],
      })
    : undefined;

export const posthogLogger = posthogLoggerProvider?.getLogger(
  'posthog-todo-integration',
);

export function emitTodoOperationLog(
  operation: 'created' | 'completion_changed' | 'deleted',
  attributes: Record<string, boolean> = {},
) {
  posthogLogger?.emit({
    body: `Todo ${operation}`,
    severityNumber: SeverityNumber.INFO,
    attributes: {
      route: '/api/todos',
      operation,
      ...attributes,
    },
  });
}

export async function flushTodoOperationLogs() {
  await posthogLoggerProvider?.forceFlush().catch(() => {});
}

export function register() {
  if ((!token || !host) && process.env.NODE_ENV !== 'production') {
    const missingVariable = token
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}
