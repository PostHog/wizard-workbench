import PostHog from "posthog-react-native";

const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST;

const isPostHogConfigured =
  typeof posthogApiKey === "string" &&
  posthogApiKey.length > 0 &&
  typeof posthogHost === "string" &&
  posthogHost.length > 0;

export const posthog = new PostHog(posthogApiKey || "missing-posthog-key", {
  host: posthogHost,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
  featureFlagsRequestTimeoutMs: 10000,
});
