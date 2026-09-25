import posthog, { initPostHog } from "./posthog.client";

type StorefrontLogAttributes = Record<string, string | number | boolean>;

export const storefrontLogger = {
  info(message: string, attributes: StorefrontLogAttributes) {
    if (initPostHog()) {
      posthog.logger.info(message, attributes);
    }
  },
};
