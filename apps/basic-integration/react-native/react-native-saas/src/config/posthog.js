import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const apiKey = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const isPostHogConfigured = apiKey && apiKey !== 'phc_your_project_token_here';

if (!isPostHogConfigured) {
  console.warn(
    'PostHog project token not configured. Analytics will be disabled. ' +
      'Set POSTHOG_PROJECT_TOKEN in your .env file to enable analytics.',
  );
}

export const posthog = new PostHog(apiKey || 'placeholder_key', {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  preloadFeatureFlags: true,
});
