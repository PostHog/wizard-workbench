import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  throw new Error("PostHog environment variables are required.");
}

export const posthog = new PostHog(projectToken, {
  host,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
});
