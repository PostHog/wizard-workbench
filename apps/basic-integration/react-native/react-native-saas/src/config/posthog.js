import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

function requireConfiguration(variableName, value) {
  if (!value && __DEV__) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }

  return Boolean(value);
}

const isPostHogConfigured =
  requireConfiguration('POSTHOG_PROJECT_TOKEN', projectToken) &&
  requireConfiguration('POSTHOG_HOST', host);

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      logs: {
        serviceName: 'react-native-saas',
        environment: __DEV__ ? 'development' : 'production',
      },
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
        },
      },
      debug: __DEV__,
    })
  : null;

export const posthogLogger = posthog ? posthog.logger : null;
