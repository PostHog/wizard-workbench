import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
export const isPostHogConfigured = Boolean(projectToken && host);

if (__DEV__ && !projectToken) {
  throw new Error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (__DEV__ && !host) {
  throw new Error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
  );
}

const noOp = () => {};

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      debug: __DEV__,
      preloadFeatureFlags: true,
    })
  : {
      capture: noOp,
      captureException: noOp,
      identify: noOp,
      reset: noOp,
    };

if (isPostHogConfigured && global.ErrorUtils) {
  const defaultErrorHandler = global.ErrorUtils.getGlobalHandler();

  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    posthog.captureException(error, {
      is_fatal: Boolean(isFatal),
    });
    defaultErrorHandler(error, isFatal);
  });
}
