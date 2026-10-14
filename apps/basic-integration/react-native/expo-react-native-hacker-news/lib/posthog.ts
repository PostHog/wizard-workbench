import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogProjectToken as string | undefined;
const host = extra?.posthogHost as string | undefined;

if (!projectToken && __DEV__) {
  throw new Error(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (!host && __DEV__) {
  throw new Error(
    "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured",
  );
}

export const isPostHogConfigured = Boolean(projectToken && host);

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
        },
      },
      logs: {
        serviceName: "hacker-native",
        environment: __DEV__ ? "development" : "production",
      },
    })
  : null;
