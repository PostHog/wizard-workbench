import posthog from "posthog-js";

type LogAttributes = Record<string, string | number | boolean>;

export const posthogAppLogger = {
  info(message: string, attributes: LogAttributes) {
    posthog.logger.info(message, attributes);
  },
};
