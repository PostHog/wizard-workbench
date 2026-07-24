import posthog from 'posthog-js';

const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (key && host) {
  posthog.init(key, {
    api_host: host,
    defaults: '2026-05-30',
    capture_pageview: false,
  });
} else {
  const missing = !key ? 'VITE_PUBLIC_POSTHOG_KEY' : 'VITE_PUBLIC_POSTHOG_HOST';
  if (import.meta.env.DEV) {
    console.error(
      `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
    );
  }
}

export { posthog };
