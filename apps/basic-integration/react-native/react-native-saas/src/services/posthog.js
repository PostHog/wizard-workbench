import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST;
const isConfigured = Boolean(projectToken && host);

const posthog = new PostHog(projectToken || 'placeholder_key', {
  host,
  disabled: !isConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  addTracingHeaders: ['10.0.2.2'],
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  requestTimeout: 10000,
  featureFlagsRequestTimeoutMs: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});

export function captureException(error, properties = {}) {
  if (error instanceof Error) {
    posthog.captureException(error, properties);
    return;
  }

  posthog.captureException(new Error(typeof error === 'string' ? error : 'Unknown error'), properties);
}

export default posthog;
