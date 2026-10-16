import { posthogLog } from "@/lib/posthog-log";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

export const getTopStories = () => {
  posthogLog.info("story feed request started", { feed: "top" });

  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getBestStories = () => {
  posthogLog.info("story feed request started", { feed: "best" });

  return fetch("https://hacker-news.firebaseio.com/v0/beststories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getAskStories = () => {
  posthogLog.info("story feed request started", { feed: "ask" });

  return fetch("https://hacker-news.firebaseio.com/v0/askstories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getShowStories = () => {
  posthogLog.info("story feed request started", { feed: "show" });

  return fetch("https://hacker-news.firebaseio.com/v0/showstories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getItemDetails = (id: number | string) => {
  posthogLog.info("item details request started");

  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<Item>>;
};

export const getUserDetails = (id: number | string) => {
  posthogLog.info("user profile request started");

  return fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<User>>;
};
