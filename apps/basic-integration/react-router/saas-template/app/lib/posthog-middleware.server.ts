import { PostHog } from "posthog-node";
import { createContext } from "react-router";
import type { MiddlewareFunction } from "react-router";

export const posthogContext = createContext<PostHog | undefined>();

export const posthogMiddleware: MiddlewareFunction = async (
  { context, request },
  next,
) => {
  const posthog = new PostHog(process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    host: process.env.VITE_PUBLIC_POSTHOG_HOST,
  });
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID") ?? undefined;
  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID") ?? undefined;

  context.set(posthogContext, posthog);

  try {
    return await posthog.withContext({ distinctId, sessionId }, next);
  } finally {
    await posthog.shutdown().catch(() => undefined);
  }
};
