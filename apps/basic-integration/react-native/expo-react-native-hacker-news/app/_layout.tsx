import { View } from "react-native";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { posthog } from "@/lib/posthog";

const queryClient = new QueryClient();

function LayoutInner() {
  const safeArea = useSafeAreaInsets();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

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
}

export default function Layout() {
  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
        maxElementsCaptured: 20,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <LayoutInner />
      </QueryClientProvider>
    </PostHogProvider>
  );
}
