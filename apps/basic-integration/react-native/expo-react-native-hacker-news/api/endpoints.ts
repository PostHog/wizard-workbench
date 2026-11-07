import { posthogLogger } from "@/lib/posthog";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

const fetchHackerNews = <T>(resource: string, url: string) => {
  return fetch(url, { method: "GET" })
    .then((response) => {
      posthogLogger?.info("hacker_news_request_completed", {
        resource,
        status_code: response.status,
        success: response.ok,
      });

      return response as TypedResponse<T>;
    })
    .catch((error: unknown) => {
      posthogLogger?.warn("hacker_news_request_failed", {
        resource,
        error_type: error instanceof Error ? error.name : "unknown",
      });
      throw error;
    });
};

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

export const getTopStories = () =>
  fetchHackerNews<number[]>("top_stories", "https://hacker-news.firebaseio.com/v0/topstories.json");

export const getBestStories = () =>
  fetchHackerNews<number[]>("best_stories", "https://hacker-news.firebaseio.com/v0/beststories.json");

export const getAskStories = () =>
  fetchHackerNews<number[]>("ask_stories", "https://hacker-news.firebaseio.com/v0/askstories.json");

export const getShowStories = () =>
  fetchHackerNews<number[]>("show_stories", "https://hacker-news.firebaseio.com/v0/showstories.json");

export const getItemDetails = (id: number | string) =>
  fetchHackerNews<Item>("item_details", `https://hacker-news.firebaseio.com/v0/item/${id}.json`);

export const getUserDetails = (id: number | string) =>
  fetchHackerNews<User>("user_details", `https://hacker-news.firebaseio.com/v0/user/${id}.json`);
