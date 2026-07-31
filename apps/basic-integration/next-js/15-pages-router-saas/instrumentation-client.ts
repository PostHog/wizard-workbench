import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (projectToken && host) {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-05-30',
    capture_exceptions: true,
    tracing_headers: [window.location.host],
  });
} else if (process.env.NODE_ENV !== 'production') {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once they are configured',
  );
}
