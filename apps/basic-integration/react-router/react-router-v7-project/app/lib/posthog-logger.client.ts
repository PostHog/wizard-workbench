import posthog, { isPostHogEnabled } from "~/lib/posthog.client";

type LogAttributes = Record<string, string | number | boolean>;

export const posthogLogger = {
  info(message: string, attributes: LogAttributes) {
    if (isPostHogEnabled) {
      posthog.logger.info(message, attributes);
    }
  },
  warn(message: string, attributes: LogAttributes) {
    if (isPostHogEnabled) {
      posthog.logger.warn(message, attributes);
    }
  },
  error(message: string, attributes: LogAttributes) {
    if (isPostHogEnabled) {
      posthog.logger.error(message, attributes);
    }
  },
};
