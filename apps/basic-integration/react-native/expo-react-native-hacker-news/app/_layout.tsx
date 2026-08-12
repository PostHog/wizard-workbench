import { View } from "react-native";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { posthog } from "@/lib/posthog";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  const navigator = (
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
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
        {posthog ? (
          <PostHogProvider
            client={posthog}
            autocapture={{ captureScreens: false, captureTouches: true }}
          >
            <PostHogErrorBoundary fallback={navigator}>
              {navigator}
            </PostHogErrorBoundary>
          </PostHogProvider>
        ) : (
          navigator
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
