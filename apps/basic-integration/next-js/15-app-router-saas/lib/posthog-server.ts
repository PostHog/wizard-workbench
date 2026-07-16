import 'server-only';
import { PostHog } from 'posthog-node';

export function createPostHogClient() {
  return new PostHog(process.env.POSTHOG_PROJECT_TOKEN!, {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true
  });
}
