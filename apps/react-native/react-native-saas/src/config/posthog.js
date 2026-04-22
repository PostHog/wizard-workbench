import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

// Environment variables are embedded at build time via react-native-config
// Ensure .env file exists with POSTHOG_PROJECT_TOKEN and POSTHOG_HOST
const apiKey = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST || 'https://us.i.posthog.com';
const isPostHogConfigured = apiKey && apiKey !== 'phc_your_project_token_here';

if (!isPostHogConfigured) {
  console.warn(
    'PostHog project token not configured. Analytics will be disabled. ' +
    'Set POSTHOG_PROJECT_TOKEN in your .env file to enable analytics.'
  );
}

/**
 * PostHog client instance for bare React Native.
 * Configuration loaded from .env via react-native-config (embedded at build time).
 * Required peer dependencies: @react-native-async-storage/async-storage,
 * react-native-device-info, react-native-localize
 */
export const posthog = new PostHog(apiKey || 'placeholder_key', {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
});
