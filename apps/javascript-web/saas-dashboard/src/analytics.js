import posthog from 'posthog-js';

export function initPostHog() {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    capture_pageview: false,
  });

  // Capture pageview on initial load and on hash-based navigation
  posthog.capture('$pageview');
  window.addEventListener('hashchange', () => {
    posthog.capture('$pageview');
  });
}

export { posthog };
