import { View } from "react-native";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { posthog } from "@/lib/posthog";
import { Colors } from "@/constants/Colors";

const queryClient = new QueryClient();

function RootNavigator() {
  const safeArea = useSafeAreaInsets();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    posthog.screen(pathname, {
      previous_screen: previousPathname.current ?? null,
      ...params,
    });
    previousPathname.current = pathname;
  }, [params, pathname]);

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
    </PostHogProvider>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
