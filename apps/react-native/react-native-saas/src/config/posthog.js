import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

// Environment variables are embedded at build time via react-native-config.
// Ensure .env file exists with POSTHOG_API_KEY and POSTHOG_HOST set.
const apiKey = Config.POSTHOG_API_KEY;
const host = Config.POSTHOG_HOST || 'https://us.i.posthog.com';
const isPostHogConfigured = !!apiKey && apiKey !== 'phc_your_api_key_here';

if (!isPostHogConfigured) {
  console.warn(
    'PostHog API key not configured. Analytics will be disabled. ' +
      'Set POSTHOG_API_KEY in your .env file to enable analytics.'
  );
}

/**
 * PostHog client instance for React Native.
 *
 * Configuration loaded from .env via react-native-config (embedded at build time).
 * Required peer dependencies: @react-native-async-storage/async-storage,
 * react-native-device-info, react-native-localize
 *
 * @see https://posthog.com/docs/libraries/react-native
 */
export const posthog = new PostHog(apiKey || 'placeholder_key', {
  // PostHog API host
  host,

  // Disable PostHog if API key is not configured
  disabled: !isPostHogConfigured,

  // Capture app lifecycle events:
  // Application Installed, Updated, Opened, Became Active, Backgrounded
  captureAppLifecycleEvents: true,

  // Enable debug logging in development
  debug: __DEV__,

  // Batching settings
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,

  // Feature flags
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,

  // Network
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});
