import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const isProjectTokenConfigured = /^phc_[A-Za-z0-9]+$/.test(projectToken);
const isHostConfigured = /^https?:\/\/\S+$/.test(host);
const isPostHogConfigured = isProjectTokenConfigured && isHostConfigured;

if (__DEV__ && !isProjectTokenConfigured) {
  console.error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (__DEV__ && !isHostConfigured) {
  console.error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
  );
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken, {
      host,
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
    })
  : null;

export const posthogLogger = {
  info: (message, attributes) => posthog?.logger.info(message, attributes),
};
