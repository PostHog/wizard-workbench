import { View } from "react-native";
import { Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Colors } from "@/constants/Colors";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ backgroundColor: "#fff5ee" }}>
          <PostHogProvider
            apiKey={process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN!}
            options={{
              host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
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
        </SafeAreaProvider>
      </QueryClientProvider>
    </>
  );
}
