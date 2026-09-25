import PostHog from "posthog-react-native";
import Config from "react-native-config";

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

function reportMissingConfiguration(variableName: string) {
  if (__DEV__) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

if (!projectToken) {
  reportMissingConfiguration("POSTHOG_PROJECT_TOKEN");
}

if (!host) {
  reportMissingConfiguration("POSTHOG_HOST");
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        logs: {
          serviceName: "hacker-native",
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
