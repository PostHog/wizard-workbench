import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const requiredConfiguration = {
  POSTHOG_PROJECT_TOKEN: Config.POSTHOG_PROJECT_TOKEN,
  POSTHOG_HOST: Config.POSTHOG_HOST,
};

const missingConfiguration = Object.entries(requiredConfiguration)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (__DEV__) {
  missingConfiguration.forEach(name => {
    console.error(
      new Error(
        `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`,
      ),
    );
  });
}

export const posthog =
  missingConfiguration.length === 0
    ? new PostHog(Config.POSTHOG_PROJECT_TOKEN, {
        host: Config.POSTHOG_HOST,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: 'react_native_saas',
          environment: __DEV__ ? 'development' : 'production',
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
          },
        },
      })
    : null;
