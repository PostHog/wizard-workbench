import { posthog } from "@/lib/posthog";

type LogAttributes = Record<string, string | number | boolean>;

export const posthogLogs = {
  info: (message: string, attributes?: LogAttributes) =>
    posthog?.logger.info(message, attributes),
  error: (message: string, attributes?: LogAttributes) =>
    posthog?.logger.error(message, attributes),
};
