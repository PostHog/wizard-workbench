import Constants from "expo-constants";
import PostHog from "posthog-react-native";

type PostHogExtra = {
  posthogProjectToken?: string;
  posthogHost?: string;
};

const extra = Constants.expoConfig?.extra as PostHogExtra | undefined;
const projectToken = extra?.posthogProjectToken;
const host = extra?.posthogHost;

if (__DEV__ && !projectToken) {
  console.error(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (__DEV__ && !host) {
  console.error(
    "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured",
  );
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined;
