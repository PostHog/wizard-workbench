import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const apiKey = Config.POSTHOG_API_KEY;
const isPostHogConfigured = apiKey && apiKey !== 'phc_your_api_key_here';

export const posthog = new PostHog(apiKey || 'placeholder_key', {
  host: Config.POSTHOG_HOST || 'https://us.i.posthog.com',
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  preloadFeatureFlags: true,
});
