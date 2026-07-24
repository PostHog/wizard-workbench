import { View } from "react-native";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { posthog } from "@/lib/posthog";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
          {posthog ? (
            <PostHogProvider client={posthog}>
              <Stack
                screenOptions={{
                  headerBackground: () => (
                    <View
                      style={{
                        backgroundColor: Colors.accent,
                        height: safeArea.top,
                      }}
                    />
                  ),
                  headerTintColor: "#f1f1f1",
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: Colors.accent,
                  },
                }}
              />
            </PostHogProvider>
          ) : (
            <Stack
              screenOptions={{
                headerBackground: () => (
                  <View
                    style={{
                      backgroundColor: Colors.accent,
                      height: safeArea.top,
                    }}
                  />
                ),
                headerTintColor: "#f1f1f1",
                headerBackButtonDisplayMode: "minimal",
                headerStyle: {
                  backgroundColor: Colors.accent,
                },
              }}
            />
          )}
        </SafeAreaProvider>
      </QueryClientProvider>
    </>
  );
}
