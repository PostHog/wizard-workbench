import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const isPostHogConfigured = Boolean(projectToken && host);

if (!isPostHogConfigured && __DEV__) {
  throw new Error(
    `${
      projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN'
    } variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${
      projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN'
    } is configured`,
  );
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      debug: __DEV__,
    })
  : undefined;
