import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const posthogLogger = loggerProvider?.getLogger('posthog-exported-app-logs');

export function logStripeCheckoutCompleted() {
  posthogLogger?.emit({
    body: 'stripe_checkout_completed',
    severityNumber: SeverityNumber.INFO,
    attributes: { payment_provider: 'stripe' },
  });
}

export function logStripeCheckoutProcessingFailed() {
  posthogLogger?.emit({
    body: 'stripe_checkout_processing_failed',
    severityNumber: SeverityNumber.WARN,
    attributes: { payment_provider: 'stripe' },
  });
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
