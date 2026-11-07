import 'server-only';
import { PostHog } from 'posthog-node';

type EventProperties = Record<string, string | number | boolean | null>;

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfigurationWarning(variableName: string) {
  return `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: EventProperties
) {
  if (!posthogKey || !posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        missingConfigurationWarning(
          !posthogKey ? 'NEXT_PUBLIC_POSTHOG_KEY' : 'NEXT_PUBLIC_POSTHOG_HOST'
        )
      );
    }
    return;
  }

  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0
  });

  posthog.capture({ distinctId, event, properties });
  await posthog.shutdown().catch(() => {});
}
