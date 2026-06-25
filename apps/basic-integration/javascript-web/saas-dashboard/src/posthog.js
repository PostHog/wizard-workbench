import posthog from 'posthog-js';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

export default posthog;
