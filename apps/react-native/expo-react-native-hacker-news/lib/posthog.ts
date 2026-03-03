import PostHog from "posthog-react-native";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig?.extra?.posthogApiKey as string | undefined;
const host =
  (Constants.expoConfig?.extra?.posthogHost as string) ||
  "https://us.i.posthog.com";
const isPostHogConfigured = !!apiKey;

if (!isPostHogConfigured) {
  console.warn(
    "PostHog API key not configured. Analytics will be disabled. " +
      "Set POSTHOG_API_KEY in your .env file to enable analytics."
  );
}

export const posthog = new PostHog(apiKey || "placeholder_key", {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
});

if (__DEV__) {
  posthog.debug();
}
