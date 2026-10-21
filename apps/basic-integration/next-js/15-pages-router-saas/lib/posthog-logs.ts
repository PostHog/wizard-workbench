import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

const logger = loggerProvider?.getLogger('posthog-integration');

async function emitCheckoutLog(
  body: string,
  severityNumber: SeverityNumber,
  checkoutStatus: 'completed' | 'failed'
) {
  if (!logger || !loggerProvider) {
    return;
  }

  try {
    logger.emit({
      body,
      severityNumber,
      attributes: {
        endpoint: '/api/stripe/checkout',
        checkout_status: checkoutStatus
      }
    });
    await loggerProvider.forceFlush();
  } catch {
    // Log delivery must not affect the checkout response.
  }
}

export async function logCheckoutCompleted() {
  await emitCheckoutLog(
    'stripe checkout completed',
    SeverityNumber.INFO,
    'completed'
  );
}

export async function logCheckoutFailed() {
  await emitCheckoutLog(
    'stripe checkout completion failed',
    SeverityNumber.ERROR,
    'failed'
  );
}
