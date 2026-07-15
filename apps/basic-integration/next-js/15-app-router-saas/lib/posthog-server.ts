import 'server-only';
import { PostHog } from 'posthog-node';

type AnalyticsEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

type PersonProperties = {
  email?: string;
  name?: string | null;
  role?: string;
};

export async function captureServerEvent(
  { distinctId, event, properties }: AnalyticsEvent,
  personProperties?: PersonProperties
) {
  const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true
  });

  if (personProperties) {
    posthog.identify({ distinctId, properties: personProperties });
  }

  posthog.capture({ distinctId, event, properties });
  await posthog.shutdown();
}
