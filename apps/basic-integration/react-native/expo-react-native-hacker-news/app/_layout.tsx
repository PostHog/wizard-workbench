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
import { posthog } from "@/lib/posthog";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();
  const pathname = usePathname();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (posthog && previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
      });
      previousPathname.current = pathname;
    }
  }, [pathname]);

  const content = (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );

  return posthog ? <PostHogProvider client={posthog}>{content}</PostHogProvider> : content;
}
