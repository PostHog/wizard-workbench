import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

export const isPostHogEnabled = Boolean(projectToken && host);

if (!isPostHogEnabled && __DEV__) {
  const missingVariable = projectToken
    ? 'POSTHOG_HOST'
    : 'POSTHOG_PROJECT_TOKEN';

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = isPostHogEnabled
  ? new PostHog(projectToken, {
      host,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          console: [],
        },
      },
    })
  : null;
