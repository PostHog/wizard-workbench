import posthog from 'posthog-js';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (key && host) {
  posthog.init(key, {
    api_host: host,
    defaults: '2026-08-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development'
  });
} else if (process.env.NODE_ENV === 'development') {
  const missingVariable = key
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_KEY';

  console.error(
    new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    )
  );
}
