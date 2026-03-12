import { PostHog } from "posthog-node";
import type { AppLoadContext } from "react-router";

import type { Route } from "../+types/root";

export function getPostHogFromContext(
  context: AppLoadContext,
): PostHog | undefined {
  return (context as Record<string, unknown>).posthog as PostHog | undefined;
}

export const posthogMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const posthog = new PostHog(
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN as string,
    {
      flushAt: 1,
      flushInterval: 0,
      host: process.env.VITE_PUBLIC_POSTHOG_HOST as string,
    },
  );

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  (context as Record<string, unknown>).posthog = posthog;

  const response = await posthog.withContext(
    {
      distinctId: distinctId ?? undefined,
      sessionId: sessionId ?? undefined,
    },
    next,
  );

  await posthog.shutdown().catch(() => {});

  return response;
};
