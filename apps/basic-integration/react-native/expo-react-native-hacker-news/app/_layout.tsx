import { useEffect } from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { posthog, posthogLogger } from "@/lib/posthog";

const queryClient = new QueryClient();

function ScreenTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const screenName =
      pathname === "/"
        ? "home"
        : pathname.startsWith("/users/")
          ? "user_details"
          : "item_details";

    posthog?.screen(screenName);
    posthogLogger?.info("app_screen_viewed", { screen_name: screenName });
  }, [pathname]);

  return null;
}

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  const app = (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
        <ScreenTracker />
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
      </SafeAreaProvider>
    </QueryClientProvider>
  );

  return posthog ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app;
}
