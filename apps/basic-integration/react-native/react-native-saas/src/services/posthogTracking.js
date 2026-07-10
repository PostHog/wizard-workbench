import {
  posthog,
  captureError,
  getDistinctIdFromEmail,
  sanitizeEmailDomain,
} from './posthog';

export function identifySignedInUser({ email, isDemoMode }) {
  const distinctId = getDistinctIdFromEmail(email);

  if (!distinctId) {
    return;
  }

  posthog.identify(distinctId, {
    $set: {
      email,
      email_domain: sanitizeEmailDomain(email),
      is_demo_user: Boolean(isDemoMode),
    },
    $set_once: {
      first_seen_platform: 'react-native',
    },
  });
}

export function trackScreen(screenName, properties = {}) {
  posthog.screen(screenName, properties);
}

export function trackEvent(event, properties = {}) {
  posthog.capture(event, properties);
}

export function trackException(error, properties = {}) {
  captureError(error, properties);
}

export function resetPostHogUser() {
  posthog.reset();
}
