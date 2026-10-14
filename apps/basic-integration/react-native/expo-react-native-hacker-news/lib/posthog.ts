import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!projectToken && __DEV__) {
  throw new Error(
    "EXPO_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_KEY is configured",
  );
}

export const posthog = projectToken
  ? new PostHog(projectToken, {
      ...(host ? { host } : {}),
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
      debug: __DEV__,
    })
  : undefined;
