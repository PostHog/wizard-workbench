import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const apiKey = Config.POSTHOG_PROJECT_TOKEN;
const isPostHogConfigured = !!apiKey;

export const posthog = new PostHog(apiKey || 'placeholder_key', {
  host: Config.POSTHOG_HOST,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  preloadFeatureFlags: true,
});
