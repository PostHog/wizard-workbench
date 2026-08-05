import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const missingConfiguration = !projectToken || !host;

if (__DEV__ && missingConfiguration) {
  const missingVariable = !projectToken
    ? 'POSTHOG_PROJECT_TOKEN'
    : 'POSTHOG_HOST';

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = missingConfiguration
  ? null
  : new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      debug: __DEV__,
    });
