import { useEffect } from "react";
import { Text, View } from "react-native";
import { Stack, useSegments } from "expo-router";
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

function ErrorFallback() {
  return (
    <View>
      <Text>Something went wrong. Please restart the app.</Text>
    </View>
  );
}

export default function Layout() {
  const safeArea = useSafeAreaInsets();
  const segments = useSegments();
  const screenName =
    segments[0] === "users"
      ? "user_profile"
      : segments.length > 0
        ? "item_details"
        : "home";

  useEffect(() => {
    posthog?.screen(screenName);
  }, [screenName]);

  const app = (
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
    <>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
          {posthog ? (
            <PostHogProvider client={posthog}>
              <PostHogErrorBoundary fallback={ErrorFallback}>
                {app}
              </PostHogErrorBoundary>
            </PostHogProvider>
          ) : (
            app
          )}
        </SafeAreaProvider>
      </QueryClientProvider>
    </>
  );
}
