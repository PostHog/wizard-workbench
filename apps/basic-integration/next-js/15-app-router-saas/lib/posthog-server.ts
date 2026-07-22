import { PostHog } from 'posthog-node';

type ServerEvent = {
  distinctId?: string;
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthog: PostHog | undefined;

function getPostHog() {
  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `${!projectToken ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'} is configured`
      );
    }

    return undefined;
  }

  if (!posthog) {
    posthog = new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0
    });
  }

  return posthog;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: ServerEvent) {
  const client = getPostHog();
  if (!client) {
    return;
  }

  client.capture({ distinctId, event, properties });
  await client.flush();
}
