import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

export const posthog = new PostHog(Config.POSTHOG_PROJECT_TOKEN, {
  host: Config.POSTHOG_HOST,
  captureAppLifecycleEvents: true,
  preloadFeatureFlags: true,
});
