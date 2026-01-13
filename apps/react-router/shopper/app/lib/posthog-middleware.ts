import { PostHog } from "posthog-node";
import type { RouterContextProvider } from "react-router";
import type { Route } from "../+types/root";

export interface PostHogContext extends RouterContextProvider {
  posthog?: PostHog;
}

export const posthogMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next
) => {
  const posthogKey = process.env.VITE_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!posthogKey) {
    return next();
  }

  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  (context as PostHogContext).posthog = posthog;

  const response = await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    next
  );

  await posthog.shutdown().catch(() => {});

  return response;
};
