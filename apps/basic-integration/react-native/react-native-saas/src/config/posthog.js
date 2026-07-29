import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

if (__DEV__ && (!projectToken || !host)) {
  throw new Error(
    'POSTHOG_PROJECT_TOKEN and POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN and POSTHOG_HOST are configured',
  );
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        debug: __DEV__,
      })
    : null;
