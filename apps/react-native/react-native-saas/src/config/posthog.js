import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

// Environment variables are embedded at build time via react-native-config.
// Ensure .env file exists with POSTHOG_API_KEY and POSTHOG_HOST.
const apiKey = Config.POSTHOG_API_KEY;
const host = Config.POSTHOG_HOST || 'https://us.i.posthog.com';
const isPostHogConfigured = apiKey && apiKey !== 'phc_your_api_key_here';

if (!isPostHogConfigured) {
  console.warn(
    'PostHog API key not configured. Analytics will be disabled. ' +
    'Set POSTHOG_API_KEY in your .env file to enable analytics.'
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
