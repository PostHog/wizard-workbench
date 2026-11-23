import { useEffect, useRef } from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { isPostHogConfigured, posthog } from "../src/config/posthog";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();
  const pathname = usePathname();
  const previousScreen = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!posthog) return;

    const screenName = pathname.startsWith("/users/")
      ? "/users/[userId]"
      : /^\/[^/]+$/.test(pathname) && pathname !== "/"
        ? "/[itemId]"
        : pathname;

    posthog.screen(screenName, {
      previous_screen: previousScreen.current ?? null,
    });
    previousScreen.current = screenName;
  }, [pathname]);

  const app = (
    <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
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
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isPostHogConfigured ? (
        <PostHogProvider client={posthog!}>{app}</PostHogProvider>
      ) : (
        app
      )}
    </QueryClientProvider>
  );
}
