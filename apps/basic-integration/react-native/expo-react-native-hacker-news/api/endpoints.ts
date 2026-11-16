import { posthogLog } from "@/lib/posthog";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

const getStories = (feed: "top" | "best" | "ask" | "show") => {
  posthogLog.info("hacker_news_feed_requested", { feed });

  return fetch(`https://hacker-news.firebaseio.com/v0/${feed}stories.json`, {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getTopStories = () => getStories("top");

export const getBestStories = () => getStories("best");

export const getAskStories = () => getStories("ask");

export const getShowStories = () => getStories("show");

export const getItemDetails = (id: number | string) => {
  posthogLog.info("hacker_news_item_requested", { resource_type: "item" });

  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<Item>>;
};

export const getUserDetails = (id: number | string) => {
  posthogLog.info("hacker_news_profile_requested", { resource_type: "user" });

  return fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<User>>;
};
