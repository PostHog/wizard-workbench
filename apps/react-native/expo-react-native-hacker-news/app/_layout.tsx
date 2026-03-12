import { View } from "react-native";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";

import { Colors } from "@/constants/Colors";
import { posthog } from "@/src/config/posthog";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  // Manual screen tracking for Expo Router
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PostHogProvider
          client={posthog}
          autocapture={{
            captureScreens: false,
            captureTouches: true,
            propsToCapture: ["testID"],
          }}
        >
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
        </PostHogProvider>
      </QueryClientProvider>
    </>
  );
}
