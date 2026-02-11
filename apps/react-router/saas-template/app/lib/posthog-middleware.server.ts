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
  const apiKey = process.env.VITE_PUBLIC_POSTHOG_KEY;
  const host = process.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !host) {
    return next();
  }

  const posthog = new PostHog(apiKey, {
    flushAt: 1,
    flushInterval: 0,
    host,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  (context as PostHogContext).posthog = posthog;

  const response = await posthog.withContext(
    { distinctId: distinctId ?? undefined, sessionId: sessionId ?? undefined },
    next,
  );

  await posthog.shutdown().catch(() => {});

  return response;
};
