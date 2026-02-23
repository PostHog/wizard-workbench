import { PostHog } from 'posthog-node';

export function getPostHogClient(): PostHog {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Flush immediately — Next.js server functions can be short-lived
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
