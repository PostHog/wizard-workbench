type LogAttributes = Record<string, boolean | number | string>;

type PostHogLogClient = {
  logger: {
    info: (message: string, attributes: LogAttributes) => void;
  };
};

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST
);

export const storefrontLogger = {
  info(
    client: PostHogLogClient,
    message: string,
    attributes: LogAttributes
  ) {
    if (isPostHogConfigured) {
      client.logger.info(message, attributes);
    }
  },
};
