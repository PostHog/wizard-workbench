import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken;
const host = Constants.expoConfig?.extra?.posthogHost;

export const posthog = new PostHog(projectToken, {
  host,
  captureAppLifecycleEvents: true,
});
