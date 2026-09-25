import posthog from "posthog-js";

type PostHogProperties = Record<string, boolean | number | string>;

export const posthogClient = {
  capture(event: string, properties?: PostHogProperties) {
    if (posthog.__loaded) {
      posthog.capture(event, properties);
    }
  },
  info(message: string, attributes?: PostHogProperties) {
    if (posthog.__loaded) {
      posthog.logger.info(message, attributes);
    }
  },
  reset() {
    if (posthog.__loaded) {
      posthog.reset();
    }
  },
};
