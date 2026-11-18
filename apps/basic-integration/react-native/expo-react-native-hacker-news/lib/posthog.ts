import Constants from "expo-constants";
import PostHog from "posthog-react-native";

type PostHogConfig = {
  posthogProjectToken?: string;
  posthogHost?: string;
};

const config = Constants.expoConfig?.extra as PostHogConfig | undefined;
const projectToken = config?.posthogProjectToken;
const host = config?.posthogHost;

if (!projectToken || !host) {
  const missingVariable = projectToken ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN";

  if (__DEV__) {
    console.error(
      new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      ),
    );
  }
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
          },
        },
      })
    : null;

type LogAttributes = Record<string, string | number | boolean>;

export const posthogLogger = {
  info: (message: string, attributes?: LogAttributes) => {
    posthog?.logger.info(message, attributes);
  },
  warn: (message: string, attributes?: LogAttributes) => {
    posthog?.logger.warn(message, attributes);
  },
};
