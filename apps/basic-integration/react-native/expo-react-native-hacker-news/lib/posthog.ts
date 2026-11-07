import Constants from 'expo-constants';
import PostHog from 'posthog-react-native';

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

function reportMissingConfiguration(variableName: string) {
  if (__DEV__) {
    console.error(
      new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      ),
    );
  }
}

if (!projectToken) {
  reportMissingConfiguration('POSTHOG_PROJECT_TOKEN');
}

if (!host) {
  reportMissingConfiguration('POSTHOG_HOST');
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: 'hacker-native',
          environment: __DEV__ ? 'development' : 'production',
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
    : undefined;

export const posthogLogger = posthog?.logger;
