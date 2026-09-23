import type { PostHog } from "posthog-js";

type PostHogLogAttributes = Record<string, boolean | number | string>;

export const posthogLog = {
  info(
    posthog: PostHog | undefined,
    message: string,
    attributes: PostHogLogAttributes,
  ) {
    posthog?.logger.info(message, attributes);
  },
};
