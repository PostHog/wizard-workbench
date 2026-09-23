import { posthog } from "@/lib/posthog";

type LogAttributes = Record<string, string | number | boolean>;

/**
 * Dedicated PostHog logger. Only call this adapter for purpose-written,
 * structured logs that are intended for export.
 */
export const posthogLogger = {
  info: (message: string, attributes: LogAttributes) => {
    posthog?.logger.info(message, attributes);
  },
  warn: (message: string, attributes: LogAttributes) => {
    posthog?.logger.warn(message, attributes);
  },
};
