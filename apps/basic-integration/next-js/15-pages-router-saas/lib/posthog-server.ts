import { PostHog } from 'posthog-node';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
let hasReportedMissingConfiguration = false;

function getPostHogClient() {
  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development' && !hasReportedMissingConfiguration) {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
      hasReportedMissingConfiguration = true;
    }
    return null;
  }

  return new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });
}

export async function captureServerEvent(
  distinctId: number | string,
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  const posthog = getPostHogClient();
  if (!posthog) {
    return;
  }

  posthog.capture({ distinctId: String(distinctId), event, properties });
  await posthog.shutdown();
}
