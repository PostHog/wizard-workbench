import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken =
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  Constants.expoConfig?.extra?.posthogProjectToken;
const host =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ||
  Constants.expoConfig?.extra?.posthogHost ||
  "https://us.i.posthog.com";

const isPostHogConfigured =
  typeof projectToken === "string" &&
  projectToken.length > 0 &&
  projectToken !== "phc_your_project_token_here";

export const posthog = new PostHog(projectToken || "placeholder_key", {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});

export const isPostHogEnabled = isPostHogConfigured;
