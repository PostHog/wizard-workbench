import { posthogLogger } from "@/lib/posthog";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

const logStoryFeedRequest = (storyType: string) => {
  posthogLogger.info("hacker_news_story_feed_requested", { story_type: storyType });
};

export const getTopStories = () => {
  logStoryFeedRequest("topstories");
  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getBestStories = () => {
  logStoryFeedRequest("beststories");
  return fetch("https://hacker-news.firebaseio.com/v0/beststories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getAskStories = () => {
  logStoryFeedRequest("askstories");
  return fetch("https://hacker-news.firebaseio.com/v0/askstories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getShowStories = () => {
  logStoryFeedRequest("showstories");
  return fetch("https://hacker-news.firebaseio.com/v0/showstories.json", {
    method: "GET",
  }) as Promise<TypedResponse<number[]>>;
};

export const getItemDetails = (id: number | string) => {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<Item>>;
};

export const getUserDetails = (id: number | string) => {
  posthogLogger.info("hacker_news_profile_requested", {});
  return fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<User>>;
};
