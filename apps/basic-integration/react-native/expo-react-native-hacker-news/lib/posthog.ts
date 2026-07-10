import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken =
  Constants.expoConfig?.extra?.posthogProjectToken ??
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host =
  Constants.expoConfig?.extra?.posthogHost ??
  process.env.EXPO_PUBLIC_POSTHOG_HOST;

export const posthog = new PostHog(projectToken || "", {
  host,
  disabled: !projectToken || !host,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,
  requestTimeout: 10000,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
});
