import { posthogLogs } from "@/lib/posthog-logs";
import type { Item, User } from "@/shared/types";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

type StoryFeed = "top" | "best" | "ask" | "show";

export type GetStoriesEndpoint = () => Promise<TypedResponse<number[]>>;

const getStoryFeed = async (feed: StoryFeed, path: string) => {
  const startedAt = Date.now();

  try {
    const response = (await fetch(
      `https://hacker-news.firebaseio.com/v0/${path}.json`,
      { method: "GET" }
    )) as TypedResponse<number[]>;

    posthogLogs.storyFeedRequestCompleted(
      feed,
      response.status,
      Date.now() - startedAt
    );

    return response;
  } catch (error) {
    posthogLogs.storyFeedRequestFailed(feed, Date.now() - startedAt);
    throw error;
  }
};

export const getTopStories = () => getStoryFeed("top", "topstories");

export const getBestStories = () => getStoryFeed("best", "beststories");

export const getAskStories = () => getStoryFeed("ask", "askstories");

export const getShowStories = () => getStoryFeed("show", "showstories");

export const getItemDetails = (id: number | string) => {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<Item>>;
};

export const getUserDetails = (id: number | string) => {
  return fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`, {
    method: "GET",
  }) as Promise<TypedResponse<User>>;
};
