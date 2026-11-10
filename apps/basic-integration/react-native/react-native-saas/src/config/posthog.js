import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

function reportMissingConfiguration(variableName) {
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
        preloadFeatureFlags: true,
        logs: {
          serviceName: 'react-native-saas',
          environment: __DEV__ ? 'development' : 'production',
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
        debug: __DEV__,
      })
    : null;
