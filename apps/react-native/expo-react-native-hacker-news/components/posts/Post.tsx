import {
  Text,
  View,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { useMemo } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useQueryClient } from "@tanstack/react-query";
import { usePostHog } from "posthog-react-native";
import { Link2, MessageSquareText } from "lucide-react-native";

import type { Item } from "@/shared/types";
import { getItemDetailsQueryKey, getItemQueryFn } from "@/constants/item";

export const Post = ({ id, title, url, score, text, kids }: Item) => {
  const QC = useQueryClient();
  const posthog = usePostHog();

  const isExternal = useMemo(() => {
    return text === undefined;
  }, [text]);

  const navigateToDetails = async () => {
    await QC.prefetchQuery({
      queryKey: getItemDetailsQueryKey(id),
      queryFn: getItemQueryFn,
    });
    router.push({ pathname: `../${id.toString()}` });
  };

  return (
    <View style={{ gap: 12 }}>
      <Pressable
        testID="post-title"
        onPress={async () => {
          if (isExternal) {
            // Track external link click from post title
            posthog.capture("post_clicked", {
              post_id: id,
              post_title: title,
              is_external: true,
              url_host: url ? new URL(url).host : null,
            });
            Linking.openURL(url);
          } else {
            // Track internal navigation to post details
            posthog.capture("post_clicked", {
              post_id: id,
              post_title: title,
              is_external: false,
            });
            await navigateToDetails();
          }
        }}
      >
        <Text style={{ color: "black", fontSize: 20, fontWeight: 500 }}>
          {title}
        </Text>
      </Pressable>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable
          testID="post-upvote"
          style={[styles.baseButton, styles.button]}
          onPress={async () => {
            // Track post upvote action
            posthog.capture("post_upvoted", {
              post_id: id,
              post_title: title,
              current_score: score,
            });
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
          }}
        >
          <Text
            style={{
              fontFamily: Platform.select({
                ios: "Menlo",
                android: "monospace",
                default: "monospace",
              }),
            }}
          >
            <Text style={{ fontSize: 18, lineHeight: 18 }}>▲</Text> {score}
          </Text>
        </Pressable>
        <Pressable
          testID="post-comments"
          style={[styles.baseButton, styles.button]}
          onPress={async () => {
            // Track opening comments for a post
            posthog.capture("post_comments_opened", {
              post_id: id,
              post_title: title,
              comment_count: kids?.length || 0,
            });
            await navigateToDetails();
          }}
        >
          <MessageSquareText color="black" width={16} />
          <Text
            style={{
              fontFamily: Platform.select({
                ios: "Menlo",
                android: "monospace",
                default: "monospace",
              }),
            }}
          >
            {kids?.length || 0}
          </Text>
        </Pressable>
        {url && (
          <Pressable
            testID="post-external-link"
            style={[styles.baseButton, styles.link]}
            onPress={() => {
              // Track external link click
              posthog.capture("external_link_clicked", {
                post_id: id,
                post_title: title,
                url: url,
                url_host: new URL(url).host,
              });
              Linking.openURL(url);
            }}
          >
            <Link2 color="black" width={16} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: Platform.select({
                  ios: "Menlo",
                  android: "monospace",
                  default: "monospace",
                }),
              }}
            >
              {new URL(url).host}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  link: { paddingHorizontal: 0, paddingVertical: 0 },
  button: {
    backgroundColor: "#e2e8f0",
    maxHeight: 32,
    minHeight: 32,
  },
});
