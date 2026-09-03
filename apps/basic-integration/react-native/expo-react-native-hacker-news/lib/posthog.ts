import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra as
  | {
      posthogProjectToken?: string;
      posthogHost?: string;
    }
  | undefined;

const projectToken = extra?.posthogProjectToken;
const host = extra?.posthogHost;

if (!projectToken && __DEV__) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (!host && __DEV__) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_HOST is configured",
  );
}

export const posthog = projectToken
  ? new PostHog(projectToken, {
      ...(host ? { host } : {}),
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          console: false,
        },
      },
    })
  : undefined;
