import {
  logHackerNewsRequestCompleted,
  logHackerNewsRequestFailed,
} from "@/lib/logger";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

type HackerNewsResource = "feed" | "item" | "profile";

const fetchHackerNews = async <T>(
  resource: HackerNewsResource,
  url: string,
): Promise<TypedResponse<T>> => {
  try {
    const response = (await fetch(url, { method: "GET" })) as TypedResponse<T>;
    logHackerNewsRequestCompleted(resource, response.status);
    return response;
  } catch (error) {
    logHackerNewsRequestFailed(
      resource,
      error instanceof Error ? error.name : "unknown_error",
    );
    throw error;
  }
};

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

export const getTopStories = () =>
  fetchHackerNews<number[]>(
    "feed",
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  );

export const getBestStories = () =>
  fetchHackerNews<number[]>(
    "feed",
    "https://hacker-news.firebaseio.com/v0/beststories.json",
  );

export const getAskStories = () =>
  fetchHackerNews<number[]>(
    "feed",
    "https://hacker-news.firebaseio.com/v0/askstories.json",
  );

export const getShowStories = () =>
  fetchHackerNews<number[]>(
    "feed",
    "https://hacker-news.firebaseio.com/v0/showstories.json",
  );

export const getItemDetails = (id: number | string) =>
  fetchHackerNews<Item>(
    "item",
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
  );

export const getUserDetails = (id: number | string) =>
  fetchHackerNews<User>(
    "profile",
    `https://hacker-news.firebaseio.com/v0/user/${id}.json`,
  );
