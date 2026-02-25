/**
 * PostHog Analytics
 *
 * Initializes the PostHog Node.js client and exports helper functions
 * for event capture, user identification, and error tracking.
 */

import { PostHog } from 'posthog-node';

function initializePosthog() {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;

  if (!apiKey) {
    console.warn('PostHog not configured (VITE_POSTHOG_KEY not set). Analytics will be disabled.');
    return null;
  }

  const client = new PostHog(apiKey, {
    host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    enableExceptionAutocapture: true,
    // Browser/SPA: flush immediately so events aren't lost on page unload
    flushAt: 1,
    flushInterval: 0,
  });

  return client;
}

export const posthog = initializePosthog();

/**
 * Capture a named event for a given user.
 * @param {string} distinctId - The user's unique ID
 * @param {string} event - The event name
 * @param {Record<string, any>} [properties] - Optional event properties
 */
export function trackEvent(distinctId, event, properties = {}) {
  if (!posthog) return;
  posthog.capture({ distinctId, event, properties });
}

/**
 * Identify a user and set their person properties.
 * @param {string} distinctId - The user's unique ID
 * @param {Record<string, any>} [properties] - Optional person properties
 */
export function identifyUser(distinctId, properties = {}) {
  if (!posthog) return;
  posthog.identify({ distinctId, properties });
}

/**
 * Capture an exception / error event.
 * @param {unknown} error - The error to capture
 * @param {string} [distinctId] - Optional user distinct ID
 * @param {Record<string, any>} [additionalProperties] - Optional extra properties
 */
export function captureException(error, distinctId, additionalProperties = {}) {
  if (!posthog) return;
  posthog.captureException(error, distinctId, additionalProperties);
}
