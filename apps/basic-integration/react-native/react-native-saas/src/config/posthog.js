import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const apiKey = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const isPostHogConfigured = !!(apiKey && host);

export const posthog = new PostHog(apiKey || 'placeholder_key', {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
});

export const isPostHogEnabled = isPostHogConfigured;
