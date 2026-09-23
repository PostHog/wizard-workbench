import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogKey as string | undefined;
const host = extra?.posthogHost as string | undefined;
const isPostHogConfigured = Boolean(projectToken && host);

if (__DEV__ && !isPostHogConfigured) {
  const missingVariable = projectToken
    ? "EXPO_PUBLIC_POSTHOG_HOST"
    : "EXPO_PUBLIC_POSTHOG_KEY";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host,
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
        },
      },
    })
  : undefined;
