import posthog from "posthog-js";

type LogAttributes = Record<string, boolean | number | string>;

const posthogLoggingEnabled = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
);

export const posthogLogger = {
  info(message: string, attributes: LogAttributes) {
    if (!posthogLoggingEnabled) {
      return;
    }

    posthog.logger.info(message, attributes);
  },
};
