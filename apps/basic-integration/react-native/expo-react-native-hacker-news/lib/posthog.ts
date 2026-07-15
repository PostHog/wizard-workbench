import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

export const posthog = new PostHog(projectToken ?? "not-configured", {
  host,
  disabled: !projectToken,
});
