import 'server-only';

import { PostHog } from 'posthog-node';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let client: PostHog | null | undefined;

function getPostHogClient() {
  if (client !== undefined) {
    return client;
  }

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const variableName = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
      );
    }

    client = null;
    return client;
  }

  client = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });

  return client;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  const posthog = getPostHogClient();
  if (!posthog) {
    return;
  }

  posthog.capture({ distinctId, event, properties });
  await posthog.flush();
}
