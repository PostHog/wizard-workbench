import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

export const posthog = new PostHog(Config.POSTHOG_PROJECT_TOKEN || 'unconfigured', {
  host: Config.POSTHOG_HOST,
  disabled: !Config.POSTHOG_PROJECT_TOKEN,
});
