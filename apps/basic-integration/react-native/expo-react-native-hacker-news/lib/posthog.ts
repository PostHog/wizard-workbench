import Constants from "expo-constants";
import { Platform } from "react-native";
import PostHog from "posthog-react-native";

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken;
const host = Constants.expoConfig?.extra?.posthogHost;
const isClientRuntime = Platform.OS !== "web" || typeof window !== "undefined";

const isPostHogConfigured =
  isClientRuntime &&
  typeof projectToken === "string" &&
  projectToken.length > 0 &&
  typeof host === "string" &&
  host.length > 0;

if (isClientRuntime && !isPostHogConfigured && __DEV__) {
  if (!projectToken) {
    console.error(
      new Error(
        "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
      ),
    );
  }

  if (!host) {
    console.error(
      new Error(
        "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured",
      ),
    );
  }
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      logs: {
        serviceName: "hacker-native",
        serviceVersion: Constants.expoConfig?.version,
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

export const posthogLog = {
  info: (message: string, attributes: Record<string, string>) => {
    posthog?.logger.info(message, attributes);
  },
};
