import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    const projectToken = import.meta.env.POSTHOG_PROJECT_TOKEN;
    const host = import.meta.env.POSTHOG_HOST;

    if (!projectToken || !host) {
      throw new Error('PostHog server environment variables are not configured');
    }

    posthogClient = new PostHog(projectToken, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}

export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
