import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
  if (__DEV__) {
    const variableName = !projectToken
      ? "EXPO_PUBLIC_POSTHOG_KEY"
      : "EXPO_PUBLIC_POSTHOG_HOST";

    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

export const posthog = projectToken && host
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
        },
      },
    })
  : undefined;
