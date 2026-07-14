import { PostHog } from "posthog-node";
import type { MiddlewareFunction } from "react-router";
import { createContext } from "react-router";

export const posthogContext = createContext<{
  distinctId?: string;
  posthog: PostHog;
  sessionId?: string;
}>();

export const posthogMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const posthog = new PostHog(process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    host: process.env.VITE_PUBLIC_POSTHOG_HOST,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID") ?? undefined;
  const distinctId =
    request.headers.get("X-POSTHOG-DISTINCT-ID") ?? undefined;

  context.set(posthogContext, {
    distinctId,
    posthog,
    sessionId,
  });

  try {
    return await posthog.withContext({ distinctId, sessionId }, next);
  } finally {
    await posthog.shutdown().catch(() => {});
  }
};
