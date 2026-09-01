import { Text, View } from "react-native";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  PostHogErrorBoundary,
  PostHogProvider,
  usePostHog,
} from "posthog-react-native";

import { Colors } from "@/constants/Colors";
import { isPostHogConfigured, posthogHost, posthogKey } from "@/lib/posthog";

const queryClient = new QueryClient();

function ScreenTracker() {
  const posthog = usePostHog();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    posthog.screen(pathname, {
      has_item_id: typeof params.itemId === "string",
      has_user_id: typeof params.userId === "string",
    });
  }, [params.itemId, params.userId, pathname, posthog]);

  return null;
}

function ErrorFallback() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text>Something went wrong. Please restart the app.</Text>
    </View>
  );
}

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  const app = (
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

  if (!isPostHogConfigured) {
    return app;
  }

  return (
    <PostHogProvider
      apiKey={posthogKey!}
      options={{
        host: posthogHost,
        errorTracking: { autocapture: { console: [] } },
      }}
    >
      <PostHogErrorBoundary fallback={ErrorFallback}>
        <ScreenTracker />
        {app}
      </PostHogErrorBoundary>
    </PostHogProvider>
  );
}
