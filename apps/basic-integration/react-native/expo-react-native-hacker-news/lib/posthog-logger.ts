import { posthog } from "@/lib/posthog";

type LogAttributes = Record<string, string | number | boolean>;

const loggerAttributes = {
  logger_name: "hacker_news_app",
};

export const posthogLogger = {
  info: (body: string, attributes: LogAttributes = {}) => {
    posthog?.logger.info(body, { ...loggerAttributes, ...attributes });
  },
};
