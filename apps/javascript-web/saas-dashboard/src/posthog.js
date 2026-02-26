/**
 * PostHog analytics helper.
 *
 * Initialises the posthog-node client using environment variables
 * and exposes thin wrappers so that callers never have to null-check
 * the client directly.
 */
import { PostHog } from 'posthog-node';

function initializePosthog() {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;

  if (!apiKey) {
    console.warn('PostHog: VITE_POSTHOG_KEY is not set – analytics will not be tracked.');
    return null;
  }

  return new PostHog(apiKey, {
    host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    enableExceptionAutocapture: true,
  });
}

export const posthog = initializePosthog();

/**
 * Capture a named event for a specific user.
 *
 * @param {string} distinctId  – the user's unique ID (email, user ID, etc.)
 * @param {string} event       – snake_case event name
 * @param {object} [properties] – additional event properties
 */
export function trackEvent(distinctId, event, properties = {}) {
  if (!posthog) return;
  posthog.capture({ distinctId, event, properties });
}

/**
 * Associate a distinct ID with user traits.
 *
 * @param {string} distinctId  – the user's unique ID
 * @param {object} [properties] – traits to store on the person record
 */
export function identifyUser(distinctId, properties = {}) {
  if (!posthog) return;
  posthog.identify({ distinctId, properties });
}

/**
 * Capture an exception / error event.
 *
 * @param {Error}  err        – the error object
 * @param {string} [distinctId] – optional user ID to associate with the error
 */
export function captureException(err, distinctId) {
  if (!posthog) return;
  posthog.captureException(err, distinctId);
}
