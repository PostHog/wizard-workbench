import { PostHog } from 'posthog-node';

export function getPostHogClient(): PostHog {
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
  }

  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? '', {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}
