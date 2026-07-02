import posthog from 'posthog-js';

// Initialize PostHog client for the browser. Values come from environment variables.
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: '/ingest',
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development'
});

export default posthog;
