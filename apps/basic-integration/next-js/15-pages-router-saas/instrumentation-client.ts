import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (projectToken && posthogHost) {
  posthog.init(projectToken, {
    api_host: posthogHost,
    capture_exceptions: true,
    defaults: '2026-01-30',
    debug: process.env.NODE_ENV === 'development',
    tracing_headers: [window.location.hostname]
  });
} else if (process.env.NODE_ENV === 'development') {
  const missingVariable = !projectToken
    ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'NEXT_PUBLIC_POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}
