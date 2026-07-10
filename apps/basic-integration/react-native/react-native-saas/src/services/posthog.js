import PostHog from 'posthog-react-native';
import Config from 'react-native-config';

const projectToken = Config.POSTHOG_PROJECT_TOKEN;
const host = Config.POSTHOG_HOST || 'https://us.i.posthog.com';
const isConfigured =
  typeof projectToken === 'string' &&
  projectToken.length > 0 &&
  projectToken !== 'phc_your_project_token_here';

export const posthog = new PostHog(projectToken || 'disabled_posthog_token', {
  host,
  disabled: !isConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 20,
  flushInterval: 10000,
  preloadFeatureFlags: true,
});

export const posthogEnabled = isConfigured;

export function sanitizeEmailDomain(email) {
  if (typeof email !== 'string' || !email.includes('@')) {
    return undefined;
  }

  return email.split('@')[1]?.toLowerCase();
}

export function getDistinctIdFromEmail(email) {
  if (typeof email !== 'string') {
    return undefined;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return undefined;
  }

  return normalizedEmail;
}

export function captureError(error, properties = {}) {
  if (error instanceof Error) {
    posthog.captureException(error, properties);
    return;
  }

  posthog.captureException(new Error(String(error)), properties);
}
