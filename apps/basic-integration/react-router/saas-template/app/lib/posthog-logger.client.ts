type LogAttributes = Record<string, boolean | number | string>;

type PostHogLogClient = {
  logger?: {
    info: (message: string, attributes: LogAttributes) => void;
  };
};

export function createPostHogLogger(client: PostHogLogClient | undefined) {
  return {
    info(message: string, attributes: LogAttributes) {
      client?.logger?.info(message, attributes);
    },
  };
}
