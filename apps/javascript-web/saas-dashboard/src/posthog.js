import { PostHog } from 'posthog-node';

export const posthog = new PostHog(
  import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  {
    host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    enableExceptionAutocapture: true,
  }
);
