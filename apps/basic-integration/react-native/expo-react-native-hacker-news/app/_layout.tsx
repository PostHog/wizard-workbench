import type { ReactNode } from "react";
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

function PostHogRoot({ children }: { children: ReactNode }) {
  if (!posthog) {
    return children;
  }

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
      }}
    >
      {children}
    </PostHogProvider>
  );
}

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PostHogRoot>
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
        </PostHogRoot>
      </QueryClientProvider>
    </>
  );
}
