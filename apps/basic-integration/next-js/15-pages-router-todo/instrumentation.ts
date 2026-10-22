import { SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!projectToken || !host) && process.env.NODE_ENV === 'development') {
  const missingVariable = !projectToken
    ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'NEXT_PUBLIC_POSTHOG_HOST';

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthogLogProvider = projectToken && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-api' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : null;

const posthogTodoLogger = posthogLogProvider?.getLogger('posthog-todo-api');

export function logTodoApiAction(
  body: string,
  attributes: Record<string, boolean | number | string>,
) {
  posthogTodoLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes,
  });
}

export async function flushPosthogTodoLogs() {
  try {
    await posthogLogProvider?.forceFlush();
  } catch {
    // Log delivery must not change the outcome of a todo API request.
  }
}

export function register() {
  // This provider is intentionally not global: only logs emitted above are exported.
}
