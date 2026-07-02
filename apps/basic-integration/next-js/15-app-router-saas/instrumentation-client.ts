import posthog from 'posthog-js';

// Initialize PostHog client for capturing analytics events in Next.js App Router
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  // Proxy through Next.js rewrites to avoid blocked requests
  api_host: '/ingest',
  // Host for UI assets and session replay
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  // Capture unhandled exceptions automatically
  capture_exceptions: true,
  // Enable debug mode during development
  debug: process.env.NODE_ENV === 'development',
});