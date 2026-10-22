import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLoggerProvider } from '@/instrumentation';

const posthogLogger = posthogLoggerProvider?.getLogger('posthog-exporter');

export async function logPostHogServerOperation(
  body: string,
  operation: string
) {
  if (!posthogLogger || !posthogLoggerProvider) {
    return;
  }

  posthogLogger.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes: { operation }
  });

  // API routes can be frozen after the response; flushing preserves this run's log line.
  try {
    await posthogLoggerProvider.forceFlush();
  } catch {
    // Log delivery must not change the API operation's result.
  }
}
