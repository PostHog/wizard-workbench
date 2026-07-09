import PostHog from "posthog-react-native";
import Constants from "expo-constants";

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host =
  (Constants.expoConfig?.extra?.posthogHost as string) ||
  "https://us.i.posthog.com";
const isPostHogConfigured =
  projectToken && projectToken !== "phc_your_project_token_here";

if (!isPostHogConfigured) {
  console.warn(
    "PostHog project token not configured. Analytics will be disabled."
  );
}

export const posthog = new PostHog(projectToken || "placeholder_key", {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
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
