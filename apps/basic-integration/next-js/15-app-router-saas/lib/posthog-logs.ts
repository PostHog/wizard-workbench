import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogExportLogger = loggerProvider?.getLogger('posthog-exporter');

export function emitPostHogInfoLog(message: string) {
  posthogExportLogger?.emit({
    body: message,
    severityNumber: SeverityNumber.INFO,
  });
}
