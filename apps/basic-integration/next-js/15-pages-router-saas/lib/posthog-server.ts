import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null | undefined;

export function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN or NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once both variables are configured'
      );
    }
    posthogClient = null;
    return posthogClient;
  }

  posthogClient = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });

  return posthogClient;
}
