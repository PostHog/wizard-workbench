import posthog from "./posthog.client";

const posthogLogs = {
  info(message: string, attributes: Record<string, string>) {
    posthog?.logger.info(message, attributes);
  },
};

export default posthogLogs;
