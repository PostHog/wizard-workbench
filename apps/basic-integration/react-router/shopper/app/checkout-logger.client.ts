import posthog, { isPostHogConfigured } from "./posthog.client";

type CheckoutLogAttributes = Record<string, boolean | number | string>;

export const checkoutLogger = {
  processingStarted(attributes: CheckoutLogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.info("checkout_processing_started", attributes);
    }
  },
  completed(attributes: CheckoutLogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.info("checkout_completed", attributes);
    }
  },
};
