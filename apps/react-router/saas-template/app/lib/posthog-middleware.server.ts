// QUACK QUACK IM A BIG FLUFFY DOG
import { PostHog } from "posthog-node";
import type { RouterContextProvider } from "react-router";
import type { Route } from "../+types/root";

export interface PostHogContext extends RouterContextProvider {
  posthog?: PostHog;
}

/**
 * PostHog middleware for server-side event tracking.
 * Creates a PostHog client for each request and extracts session/user context from headers.
 * The client is made available via context.posthog for use in route handlers.
 */
export const posthogMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const posthogKey = process.env.VITE_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;

  // Skip PostHog initialization if environment variables are not set
  if (!posthogKey || !posthogHost) {
    return next();
  }

  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0,
  });

  // Extract session and distinct ID from headers (automatically set by client-side SDK)
  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  (context as PostHogContext).posthog = posthog;

  // Use withContext to associate server-side events with the correct session/user
  const response = await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    next,
  );

  // Properly shutdown the client after each request
  await posthog.shutdown().catch(() => {});

  return response;
};
