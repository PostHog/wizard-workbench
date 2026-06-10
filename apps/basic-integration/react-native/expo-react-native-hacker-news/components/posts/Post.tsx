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
import { Link2, MessageSquareText } from "lucide-react-native";

import type { Item } from "@/shared/types";
import { getItemDetailsQueryKey, getItemQueryFn } from "@/constants/item";
import { capture } from "@/lib/posthog";

export const Post = ({ id, title, url, score, text, kids }: Item) => {
  const QC = useQueryClient();

  const isExternal = useMemo(() => {
    return text === undefined;
  }, [text]);

  const navigateToDetails = async () => {
    await QC.prefetchQuery({
      queryKey: getItemDetailsQueryKey(id),
      queryFn: getItemQueryFn,
    });
    capture('post_opened', { item_id: id, title, score, comment_count: kids?.length ?? 0 });
    router.push({ pathname: `../${id.toString()}` });
  };

  return (
    <View style={{ gap: 12 }}>
      <Pressable
        onPress={async () => {
          if (isExternal) {
            capture('external_link_opened', { item_id: id, url, host: new URL(url).host });
            Linking.openURL(url);
          } else await navigateToDetails();
        }}
      >
        <Text style={{ color: "black", fontSize: 20, fontWeight: 500 }}>
          {title}
        </Text>
      </Pressable>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable
          style={[styles.baseButton, styles.button]}
          onPress={async () => {
            capture('post_upvoted', { item_id: id, score });
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
          style={[styles.baseButton, styles.button]}
          onPress={async () => {
            capture('comments_opened', { item_id: id, comment_count: kids?.length ?? 0 });
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
            style={[styles.baseButton, styles.link]}
            onPress={() => {
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
