import { PostHog } from "posthog-node";
import type { RouterContextProvider } from "react-router";

import type { Route } from "../+types/root";

export interface PostHogContext extends RouterContextProvider {
  posthog?: PostHog;
}

export const posthogMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const posthog = new PostHog(process.env.VITE_POSTHOG_PROJECT_TOKEN!, {
    flushAt: 1,
    flushInterval: 0,
    host: process.env.VITE_POSTHOG_HOST!,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  (context as PostHogContext).posthog = posthog;

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
