import posthog, { isPostHogConfigured } from "./posthog.client";

type LogAttributes = Record<string, boolean | number | string>;

export const posthogLogger = {
  info(message: string, attributes?: LogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.info(message, attributes);
    }
  },
  warn(message: string, attributes?: LogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.warn(message, attributes);
    }
  },
};
