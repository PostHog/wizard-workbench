import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

if (__DEV__ && (!projectToken || !host)) {
  throw new Error(
    `${!projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} is configured`,
  );
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
      host,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
        },
      },
    })
  : null;
