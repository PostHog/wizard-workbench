import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

export const isPostHogConfigured = Boolean(projectToken && host);

if (!isPostHogConfigured && __DEV__) {
  const missingVariable = projectToken
    ? "POSTHOG_HOST"
    : "POSTHOG_PROJECT_TOKEN";

  console.error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
      captureAppLifecycleEvents: true,
      logs: {
        serviceName: "hacker-native",
        serviceVersion: "1.0.0",
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
