import { posthog } from "@/lib/posthog";

type LogAttributes = Record<string, boolean | number | string>;

export const posthogLogger = {
  info(message: string, attributes: LogAttributes) {
    posthog?.logger.info(message, attributes);
  },
};
