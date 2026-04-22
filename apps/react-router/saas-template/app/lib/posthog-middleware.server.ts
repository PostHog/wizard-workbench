import { PostHog } from "posthog-node";
import type { MiddlewareFunction } from "react-router";
import { createContext } from "react-router";

export const posthogContext = createContext<PostHog | undefined>(undefined);

export const posthogMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const posthog = new PostHog(process.env.VITE_PUBLIC_POSTHOG_TOKEN ?? "", {
    flushAt: 1,
    flushInterval: 0,
    host: process.env.VITE_PUBLIC_POSTHOG_HOST,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  context.set(posthogContext, posthog);

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
