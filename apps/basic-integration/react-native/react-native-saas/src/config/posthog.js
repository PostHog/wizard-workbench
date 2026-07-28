import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const missingConfiguration = !projectToken
  ? 'POSTHOG_PROJECT_TOKEN'
  : !host
    ? 'POSTHOG_HOST'
    : null;
const isConfigured = !missingConfiguration;

if (__DEV__ && missingConfiguration) {
  throw new Error(
    `${missingConfiguration} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfiguration} is configured`,
  );
}

export const posthog = isConfigured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          console: true,
        },
      },
      debug: __DEV__,
    })
  : null;

export const isPostHogConfigured = isConfigured;
