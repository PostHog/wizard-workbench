import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList, ListRenderItem, View } from "react-native";
import { usePostHog } from "posthog-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Post } from "@/components/posts/Post";
import { Spinner } from "@/components/Spinner";
import { Comment } from "@/components/comments/comment";

import { getItemDetails } from "@/api/endpoints";
import type { Item, User } from "@/shared/types";
import { ITEMS_PER_PAGE } from "@/constants/pagination";

type Props = Pick<User, "id" | "submitted"> & {
  children: ReactNode;
};

export const Activities = ({ id, submitted, children }: Props) => {
  const posthog = usePostHog();
  const trackedPageCount = useRef(0);
  const { bottom } = useSafeAreaInsets();
  const { data, hasNextPage, isLoading, fetchNextPage } = useInfiniteQuery({
      queryKey: [id, "activities"],
      queryFn: async ({ pageParam = 0 }) => {
        if (!submitted) return [];

        const pageIds = submitted.slice(pageParam, pageParam + ITEMS_PER_PAGE);
        const detailsResponses = await Promise.all(
          pageIds.map((id) => getItemDetails(id))
        );
        const activities = await Promise.all(
          detailsResponses.map((res) => res.json())
        );

        return activities;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!submitted) return undefined;

        const nextPage = allPages.length * ITEMS_PER_PAGE;
        return nextPage < submitted.length ? nextPage : undefined;
      },
      enabled: !!submitted,
      initialPageParam: 0,
    });

  const activities = useMemo(() => {
    return data?.pages
      .flat()
      .filter(({ dead, deleted }) => dead !== true && deleted !== true);
  }, [data]);

  useEffect(() => {
    if (!activities) {
      return;
    }

    posthog.capture("user_activities_loaded", {
      profile_id: id,
      total_activity_ids: submitted?.length || 0,
      loaded_activity_count: activities.length,
    });
  }, [activities, id, posthog, submitted?.length]);

  useEffect(() => {
    const pageCount = data?.pages.length ?? 0;

    if (pageCount <= 1 || pageCount <= trackedPageCount.current) {
      trackedPageCount.current = pageCount;
      return;
    }

    posthog.capture("user_activities_paginated", {
      profile_id: id,
      page_count: pageCount,
      loaded_activity_count: activities?.length ?? 0,
    });
    trackedPageCount.current = pageCount;
  }, [activities?.length, data?.pages.length, id, posthog]);

  return (
    <FlatList
      indicatorStyle="black"
      ListHeaderComponent={() => children}
      style={{ paddingHorizontal: 22 }}
      keyExtractor={(item) => item.id.toString()}
      data={activities}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={renderItem}
      ListFooterComponent={() => {
        if (!isLoading) return <View style={{ height: bottom }} />;

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

const renderItem: ListRenderItem<Item> = ({ item }) => {
  return item.type === "comment" ? <Comment {...item} /> : <Post {...item} />;
};

const ItemSeparatorComponent = () => (
  <View style={{ height: 1, backgroundColor: "#e2e8f0", marginVertical: 16 }} />
);
