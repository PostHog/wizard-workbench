import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken =
  typeof extra?.posthogKey === "string" ? extra.posthogKey : undefined;
const host =
  typeof extra?.posthogHost === "string" ? extra.posthogHost : undefined;

if (__DEV__ && !projectToken) {
  throw new Error(
    "EXPO_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_KEY is configured",
  );
}

if (__DEV__ && !host) {
  throw new Error(
    "EXPO_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_HOST is configured",
  );
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: "hacker-native",
          environment: __DEV__ ? "development" : "production",
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined;

export const posthogLogger = {
  info: (
    message: string,
    attributes: Record<string, string | number | boolean>,
  ) => posthog?.logger.info(message, attributes),
};
