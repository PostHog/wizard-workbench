import { PostHog } from "posthog-node";
import type { MiddlewareFunction } from "react-router";
import { createContext } from "react-router";

export const posthogContext = createContext<{ posthog: PostHog }>();

export const posthogMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const apiKey = process.env.VITE_PUBLIC_POSTHOG_KEY ?? "";
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  const posthog = new PostHog(apiKey, {
    flushAt: 1,
    flushInterval: 0,
    host,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  context.set(posthogContext, { posthog });

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
