import { useEffect } from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider, usePostHog } from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { posthog } from "@/lib/posthog";

const queryClient = new QueryClient();

function ScreenTracker() {
  const posthog = usePostHog();
  const pathname = usePathname();
  const screenName =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/users/")
        ? "user_profile"
        : "item_details";

  useEffect(() => {
    posthog.screen(screenName);
  }, [posthog, screenName]);

  return null;
}

function AppStack() {
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
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
        {posthog ? (
          <PostHogProvider
            client={posthog}
            autocapture={{ captureScreens: false }}
          >
            <ScreenTracker />
            <AppStack />
          </PostHogProvider>
        ) : (
          <AppStack />
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
