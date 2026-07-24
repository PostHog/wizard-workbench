import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (__DEV__ && !projectToken) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (__DEV__ && !host) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_HOST is configured",
  );
}

export const posthog = projectToken
  ? new PostHog(projectToken, {
      host: host || undefined,
    })
  : null;

// Route uncaught JavaScript exceptions through React Native's global handler.
// This keeps error tracking centralized without wrapping individual screens.
if (posthog) {
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    posthog.captureException(error, {
      properties: {
        fatal: isFatal,
      },
    });
    defaultHandler(error, isFatal);
  });
}
