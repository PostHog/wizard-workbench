import { SeverityNumber } from '@opentelemetry/api-logs';
import { posthogLogProvider } from '@/instrumentation';

const logger = posthogLogProvider?.getLogger('posthog-integration');

export function logSubscriptionCheckoutProcessed(subscriptionStatus: string) {
  logger?.emit({
    body: 'subscription checkout processed',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: 'subscription_checkout_processed',
      outcome: 'succeeded',
      subscription_status: subscriptionStatus
    }
  });
}

export function logSubscriptionCheckoutFailed() {
  logger?.emit({
    body: 'subscription checkout processed',
    severityNumber: SeverityNumber.ERROR,
    attributes: {
      event: 'subscription_checkout_processed',
      outcome: 'failed',
      error_type: 'checkout_processing_failed'
    }
  });
}

export async function flushPostHogLogs() {
  await posthogLogProvider?.forceFlush();
}
