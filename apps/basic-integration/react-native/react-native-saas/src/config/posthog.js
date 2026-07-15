import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

export const posthog = new PostHog(projectToken || 'posthog-not-configured', {
  host,
  disabled: !projectToken,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  preloadFeatureFlags: true,
});
