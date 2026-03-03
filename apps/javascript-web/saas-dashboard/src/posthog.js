import { PostHog } from 'posthog-node/edge';

const posthog = new PostHog(import.meta.env.VITE_POSTHOG_KEY, {
  host: import.meta.env.VITE_POSTHOG_HOST,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

export default posthog;
