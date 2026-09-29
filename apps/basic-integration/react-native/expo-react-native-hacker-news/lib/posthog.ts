import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogProjectToken as string | undefined;
const host = extra?.posthogHost as string | undefined;

function getPostHogConfig(
  value: string | undefined,
  variableName: "POSTHOG_PROJECT_TOKEN" | "POSTHOG_HOST",
) {
  if (!value && __DEV__) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }

  return value;
}

const configuredProjectToken = getPostHogConfig(
  projectToken,
  "POSTHOG_PROJECT_TOKEN",
);
const configuredHost = getPostHogConfig(host, "POSTHOG_HOST");

export const posthog =
  configuredProjectToken && configuredHost
    ? new PostHog(configuredProjectToken, {
        host: configuredHost,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined;
