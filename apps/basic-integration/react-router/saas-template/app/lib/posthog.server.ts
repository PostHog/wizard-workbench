import { PostHog } from "posthog-node";
import { createContext } from "react-router";

import type { Route } from "../+types/root";

export const posthogContext = createContext<PostHog | undefined>();

export const posthogMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const posthog = new PostHog(process.env.VITE_POSTHOG_PROJECT_TOKEN, {
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    host: process.env.VITE_POSTHOG_HOST,
  });
  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  context.set(posthogContext, posthog);

  try {
    return await posthog.withContext(
      {
        distinctId: distinctId ?? undefined,
        sessionId: sessionId ?? undefined,
      },
      next,
    );
  } catch (error) {
    if (distinctId) {
      posthog.captureException(error, distinctId);
    }
    throw error;
  } finally {
    await posthog.shutdown().catch(() => {});
  }
};
