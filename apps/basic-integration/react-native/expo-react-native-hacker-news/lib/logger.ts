import { posthog } from "@/lib/posthog";

type HackerNewsResource = "feed" | "item" | "profile";

export const logHackerNewsRequestCompleted = (
  resource: HackerNewsResource,
  statusCode: number,
) => {
  posthog?.logger.info("hacker_news_request_completed", {
    resource,
    status_code: statusCode,
  });
};

export const logHackerNewsRequestFailed = (
  resource: HackerNewsResource,
  errorType: string,
) => {
  posthog?.logger.error("hacker_news_request_failed", {
    resource,
    error_type: errorType,
  });
};
