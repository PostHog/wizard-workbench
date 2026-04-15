import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const posthog = new PostHog(Config.POSTHOG_PROJECT_TOKEN, {
  host: Config.POSTHOG_HOST,
});

export default posthog;
