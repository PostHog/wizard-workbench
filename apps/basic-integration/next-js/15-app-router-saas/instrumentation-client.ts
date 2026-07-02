import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development',
  // Defaults helps keep event schemas consistent across environments
  defaults: '2026-01-30',
});
