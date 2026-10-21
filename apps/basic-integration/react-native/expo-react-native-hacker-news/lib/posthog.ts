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
      logs: {
        serviceName: "hacker-native",
        serviceVersion: "1.0.0",
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

export const posthogLogs = {
  info: (message: string, attributes: Record<string, string>) =>
    posthog?.logger.info(message, attributes),
};
