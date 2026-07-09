import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken =
  Constants.expoConfig?.extra?.posthogProjectToken ??
  process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host =
  Constants.expoConfig?.extra?.posthogHost ??
  process.env.EXPO_PUBLIC_POSTHOG_HOST;

const isConfigured =
  typeof projectToken === "string" &&
  projectToken.length > 0 &&
  typeof host === "string" &&
  host.length > 0;

if (!isConfigured) {
  console.warn(
    "PostHog environment variables are missing. Set EXPO_PUBLIC_POSTHOG_KEY and EXPO_PUBLIC_POSTHOG_HOST to enable analytics."
  );
}

export const posthog = new PostHog(projectToken ?? "missing-posthog-key", {
  host,
  disabled: !isConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  captureNativeAppLifecycleEvents: true,
});
