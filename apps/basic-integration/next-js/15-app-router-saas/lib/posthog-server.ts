import 'server-only';

import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServerClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_PROJECT_TOKEN!, {
      host: process.env.POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });
  }

  return posthogClient;
}
