import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken = Constants.expoConfig?.extra?.posthogKey as string | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

if (!projectToken && __DEV__) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_KEY is configured",
  );
}

if (!host && __DEV__) {
  console.error(
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
          serviceVersion: Constants.expoConfig?.version,
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
    : null;

export const posthogLogger = {
  info: (
    message: string,
    attributes: Record<string, string | number | boolean>,
  ) => posthog?.logger.info(message, attributes),
};
