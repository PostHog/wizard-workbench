import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;

function reportMissingConfiguration(variableName) {
  if (__DEV__) {
    console.error(
      new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      ),
    );
  }
}

if (!projectToken) {
  reportMissingConfiguration('POSTHOG_PROJECT_TOKEN');
}

if (!host) {
  reportMissingConfiguration('POSTHOG_HOST');
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: 'react_native_saas',
          environment: __DEV__ ? 'development' : 'production',
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : null;

function callWithoutBlocking(target, method, ...args) {
  if (!target) {
    return;
  }

  try {
    const result = target[method](...args);
    result?.catch?.(() => {});
  } catch {}
}

export function callPostHog(method, ...args) {
  callWithoutBlocking(posthog, method, ...args);
}

export const posthogLogger = {
  info(message, attributes) {
    callWithoutBlocking(posthog?.logger, 'info', message, attributes);
  },
};
