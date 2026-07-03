import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  // Pin defaults to a fixed date per PostHog guidance to ensure stable defaults
  defaults: '2026-05-30',
  // Enable error tracking for uncaught exceptions on the client
  capture_exceptions: true,
  // Helpful debug logs in development
  debug: process.env.NODE_ENV === 'development',
});
