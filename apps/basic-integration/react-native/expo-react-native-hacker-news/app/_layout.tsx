import { View } from "react-native";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  PostHogErrorBoundary,
  PostHogProvider,
} from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { posthog } from "@/lib/posthog";

const queryClient = new QueryClient();

function AppContent() {
  const safeArea = useSafeAreaInsets();

  return (
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
}

export default function Layout() {
  const content = <AppContent />;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
        {posthog ? (
          <PostHogProvider client={posthog}>
            <PostHogErrorBoundary
              fallback={() => null}
              additionalProperties={{ source: "expo-router-root" }}
            >
              {content}
            </PostHogErrorBoundary>
          </PostHogProvider>
        ) : (
          content
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
