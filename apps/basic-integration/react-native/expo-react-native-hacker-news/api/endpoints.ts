import { posthogLogger } from "@/lib/posthog";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

type HackerNewsResource =
  | "top_stories"
  | "best_stories"
  | "ask_stories"
  | "show_stories"
  | "item_details"
  | "user_details";

const fetchHackerNews = <T>(url: string, resource: HackerNewsResource) => {
  const startedAt = Date.now();

  return fetch(url, { method: "GET" })
    .then((response) => {
      const attributes = {
        resource,
        status_code: response.status,
        duration_ms: Date.now() - startedAt,
      };

      if (response.ok) {
        posthogLogger.info("hacker_news_request_completed", attributes);
      } else {
        posthogLogger.warn("hacker_news_request_completed", attributes);
      }

      return response as TypedResponse<T>;
    })
    .catch((error) => {
      posthogLogger.error("hacker_news_request_failed", {
        resource,
        duration_ms: Date.now() - startedAt,
      });
      throw error;
    });
};

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

export const getTopStories = () =>
  fetchHackerNews<number[]>(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    "top_stories",
  );

export const getBestStories = () =>
  fetchHackerNews<number[]>(
    "https://hacker-news.firebaseio.com/v0/beststories.json",
    "best_stories",
  );

export const getAskStories = () =>
  fetchHackerNews<number[]>(
    "https://hacker-news.firebaseio.com/v0/askstories.json",
    "ask_stories",
  );

export const getShowStories = () =>
  fetchHackerNews<number[]>(
    "https://hacker-news.firebaseio.com/v0/showstories.json",
    "show_stories",
  );

export const getItemDetails = (id: number | string) =>
  fetchHackerNews<Item>(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    "item_details",
  );

export const getUserDetails = (id: number | string) =>
  fetchHackerNews<User>(
    `https://hacker-news.firebaseio.com/v0/user/${id}.json`,
    "user_details",
  );
