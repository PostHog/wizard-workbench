import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (!projectToken) {
  throw new Error('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is required');
}

posthog.init(projectToken, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2026-05-30',
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development',
});
