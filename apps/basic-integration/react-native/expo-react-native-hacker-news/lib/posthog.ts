import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken =
  typeof extra?.posthogProjectToken === "string"
    ? extra.posthogProjectToken
    : undefined;
const host =
  typeof extra?.posthogHost === "string" ? extra.posthogHost : undefined;

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
        logs: {
          serviceName: "hacker-native",
          serviceVersion: Constants.expoConfig?.version,
          environment: __DEV__ ? "development" : "production",
        },
      })
    : undefined;

posthog?.debug(__DEV__);
