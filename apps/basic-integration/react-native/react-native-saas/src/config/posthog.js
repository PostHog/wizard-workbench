import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST || 'https://us.i.posthog.com';
const isPostHogConfigured = Boolean(projectToken);

if (__DEV__ && !isPostHogConfigured) {
  throw new Error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, ' +
    'this causes events to be silently missed. This error stops appearing once ' +
    'POSTHOG_PROJECT_TOKEN is configured',
  );
}

export const posthog = new PostHog(projectToken || 'placeholder_key', {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  preloadFeatureFlags: true,
});
