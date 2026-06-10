import { useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Colors } from "@/constants/Colors";
import { initPostHog } from "@/lib/posthog";

const queryClient = new QueryClient();

export default function Layout() {
  const safeArea = useSafeAreaInsets();

  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
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
    </>
  );
}
