import { useMemo } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { Post } from "@/components/posts/Post";
import { Spinner } from "@/components/Spinner";

import type { Item } from "@/shared/types";
import { getItemDetails } from "@/api/endpoints";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { posthogLogs } from "@/lib/posthog-logs";
import {
  type StoryType,
  MAP_STORY_TYPE_TO_STORY_ENDPOINTS,
} from "@/constants/stories";

const renderItem: ListRenderItem<Item> = ({ item }) => {
  return (
    <View style={{ padding: 22 }}>
      <Post {...item} />
    </View>
  );
};

const ItemSeparatorComponent = () => (
  <View style={{ height: 1, backgroundColor: "#e2e8f0" }}></View>
);

export const Posts = ({ storyType }: { storyType: StoryType }) => {
  const storyListQuery = useQuery({
    queryKey: ["storyIds", storyType],
    queryFn: async () => {
      const startedAt = Date.now();

      try {
        const getItemIds = MAP_STORY_TYPE_TO_STORY_ENDPOINTS[storyType];
        const res = await getItemIds();
        const topStories = await res.json();

        posthogLogs.info("story feed loaded", {
          story_type: storyType,
          story_count: topStories.length,
          duration_ms: Date.now() - startedAt,
        });

        return topStories;
      } catch (error) {
        posthogLogs.error("story feed load failed", {
          story_type: storyType,
          duration_ms: Date.now() - startedAt,
        });
        throw error;
      }
    },
  });

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["storyDetails", storyType],
    queryFn: async ({ pageParam = 0 }) => {
      if (!storyListQuery.data) return [];

      const startedAt = Date.now();
      const pageIds = storyListQuery.data.slice(
        pageParam,
        pageParam + ITEMS_PER_PAGE
      );

      try {
        const detailsResponses = await Promise.all(
          pageIds.map((id) => getItemDetails(id))
        );
        const posts = await Promise.all(
          detailsResponses.map((res) => res.json())
        );

        posthogLogs.info("story page loaded", {
          story_type: storyType,
          page_offset: pageParam,
          story_count: posts.length,
          duration_ms: Date.now() - startedAt,
        });

        return posts;
      } catch (error) {
        posthogLogs.error("story page load failed", {
          story_type: storyType,
          page_offset: pageParam,
          duration_ms: Date.now() - startedAt,
        });
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!storyListQuery.data) return undefined;

      const nextPage = allPages.length * ITEMS_PER_PAGE;
      return nextPage < storyListQuery.data.length ? nextPage : undefined;
    },
    enabled: !!storyListQuery.data,
    initialPageParam: 0,
  });

  const posts = useMemo(() => {
    return data?.pages
      .flat()
      .filter(({ dead, deleted }) => dead !== true && deleted !== true);
  }, [data]);

  return (
    <FlatList
      indicatorStyle="black"
      keyExtractor={(item) => item.id.toString()}
      data={posts}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={renderItem}
      ListFooterComponent={() => {
        if (!isLoading) return null;

        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 15,
            }}
          >
            <Spinner variant="dark" />
          </View>
        );
      }}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};
