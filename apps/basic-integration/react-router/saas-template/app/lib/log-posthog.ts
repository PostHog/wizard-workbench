type LogAttributes = Record<string, boolean | number | string>;

export function logPosthogInfo(message: string, attributes?: LogAttributes) {
  if (typeof window === "undefined") return;

  void import("./posthog.client").then(
    ({ default: posthog, isPosthogConfigured }) => {
      if (isPosthogConfigured) {
        posthog.logger.info(message, attributes);
      }
    },
  );
}
