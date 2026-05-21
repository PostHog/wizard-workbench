import { PostHog } from "posthog-node";

/**
 * Capture a server-side event using a short-lived PostHog client.
 * Use this in webhook handlers or other contexts outside the PostHog middleware.
 */
export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}) {
  // biome-ignore lint/style/noNonNullAssertion: required keys validated in env.server.ts
  const posthog = new PostHog(process.env.VITE_PUBLIC_POSTHOG_TOKEN!, {
    flushAt: 1,
    flushInterval: 0,
    // biome-ignore lint/style/noNonNullAssertion: required keys validated in env.server.ts
    host: process.env.VITE_PUBLIC_POSTHOG_HOST!,
  });

  posthog.capture({ distinctId, event, properties });

  await posthog.shutdown().catch(() => {});
}
