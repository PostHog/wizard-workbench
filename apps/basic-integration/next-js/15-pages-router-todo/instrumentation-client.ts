import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !apiHost) {
  throw new Error('PostHog environment variables are required');
}

posthog.init(projectToken, {
  api_host: apiHost,
  defaults: '2025-05-24',
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development',
});
