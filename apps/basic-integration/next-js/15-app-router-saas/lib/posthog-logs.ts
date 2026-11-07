import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLoggerProvider } from '@/instrumentation';

const logger = posthogLoggerProvider.getLogger('next-js-saas.posthog');

type CheckoutLogName =
  | 'checkout_processing_completed'
  | 'checkout_processing_failed';

export function logCheckoutProcessing(name: CheckoutLogName) {
  logger.emit({
    body: name,
    severityNumber:
      name === 'checkout_processing_failed'
        ? SeverityNumber.ERROR
        : SeverityNumber.INFO,
    attributes: {
      log_source: 'posthog_integration',
    },
  });
}

export function flushPostHogLogs() {
  return posthogLoggerProvider.forceFlush().catch(() => {});
}
